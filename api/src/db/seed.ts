import { faker } from "@faker-js/faker";
import { db } from "./index";
import { webhooks } from "./schema";

const stripeEvents = [
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "payment_intent.created",
  "payment_intent.requires_action",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "invoice.created",
  "invoice.finalized",
  "invoice.sent",
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "charge.succeeded",
  "charge.failed",
  "charge.pending",
  "charge.captured",
  "charge.refunded",
  "checkout.session.completed",
  "checkout.session.expired",
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "subscription_schedule.created",
  "subscription_schedule.updated",
];

function generateStripeWebhookBody(eventType: string) {
  const baseEvent = {
    id: `evt_${faker.string.alphanumeric(24)}`,
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: `req_${faker.string.alphanumeric(24)}`,
      idempotency_key: null,
    },
    type: eventType,
  };

  let data: any = {};

  if (eventType.startsWith("payment_intent")) {
    data = {
      object: {
        id: `pi_${faker.string.alphanumeric(24)}`,
        object: "payment_intent",
        amount: faker.number.int({ min: 500, max: 50000 }),
        currency: "usd",
        status: eventType.includes("succeeded")
          ? "succeeded"
          : eventType.includes("failed")
            ? "failed"
            : "requires_payment_method",
        customer: `cus_${faker.string.alphanumeric(14)}`,
        description: faker.commerce.productDescription(),
        metadata: {
          order_id: faker.string.uuid(),
        },
      },
    };
  } else if (eventType.startsWith("invoice")) {
    data = {
      object: {
        id: `in_${faker.string.alphanumeric(24)}`,
        object: "invoice",
        amount_due: faker.number.int({ min: 1000, max: 100000 }),
        amount_paid: eventType.includes("succeeded")
          ? faker.number.int({ min: 1000, max: 100000 })
          : 0,
        currency: "usd",
        customer: `cus_${faker.string.alphanumeric(14)}`,
        status: eventType.includes("succeeded")
          ? "paid"
          : eventType.includes("failed")
            ? "payment_failed"
            : "open",
        subscription: `sub_${faker.string.alphanumeric(14)}`,
      },
    };
  } else if (eventType.startsWith("customer")) {
    data = {
      object: {
        id: `cus_${faker.string.alphanumeric(14)}`,
        object: "customer",
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        created: Math.floor(Date.now() / 1000),
      },
    };
  } else if (eventType.startsWith("charge")) {
    data = {
      object: {
        id: `ch_${faker.string.alphanumeric(24)}`,
        object: "charge",
        amount: faker.number.int({ min: 500, max: 50000 }),
        currency: "usd",
        customer: `cus_${faker.string.alphanumeric(14)}`,
        status: eventType.includes("succeeded")
          ? "succeeded"
          : eventType.includes("failed")
            ? "failed"
            : "pending",
        payment_method: `pm_${faker.string.alphanumeric(24)}`,
      },
    };
  } else if (eventType.startsWith("checkout.session")) {
    data = {
      object: {
        id: `cs_${faker.string.alphanumeric(24)}`,
        object: "checkout.session",
        amount_total: faker.number.int({ min: 1000, max: 100000 }),
        currency: "usd",
        customer: `cus_${faker.string.alphanumeric(14)}`,
        payment_status: eventType.includes("completed") ? "paid" : "unpaid",
        status: eventType.includes("completed") ? "complete" : "expired",
      },
    };
  } else if (eventType.startsWith("product")) {
    data = {
      object: {
        id: `prod_${faker.string.alphanumeric(14)}`,
        object: "product",
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        active: true,
        created: Math.floor(Date.now() / 1000),
      },
    };
  } else if (eventType.startsWith("price")) {
    data = {
      object: {
        id: `price_${faker.string.alphanumeric(14)}`,
        object: "price",
        currency: "usd",
        unit_amount: faker.number.int({ min: 500, max: 50000 }),
        product: `prod_${faker.string.alphanumeric(14)}`,
        active: true,
      },
    };
  } else {
    data = {
      object: {
        id: faker.string.alphanumeric(24),
        object: eventType.split(".")[0],
        created: Math.floor(Date.now() / 1000),
      },
    };
  }

  return JSON.stringify({ ...baseEvent, data });
}

function generateStripeHeaders() {
  return {
    accept: "*/*",
    "accept-encoding": "gzip",
    "content-type": "application/json",
    "stripe-signature": `t=${Math.floor(Date.now() / 1000)},v1=${faker.string.alphanumeric(64)}`,
    "user-agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
    "x-forwarded-for": faker.internet.ip(),
    "x-forwarded-proto": "https",
    "x-real-ip": faker.internet.ip(),
  };
}

async function seed() {
  console.log("<1 Starting database seed...");

  try {
    // Clear existing webhooks
    await db.delete(webhooks);
    console.log("=�  Cleared existing webhooks");

    const webhookData = [];

    for (let i = 0; i < 60; i++) {
      const eventType = faker.helpers.arrayElement(stripeEvents);
      const body = generateStripeWebhookBody(eventType);
      const headers = generateStripeHeaders();

      webhookData.push({
        method: "POST",
        pathname: "/webhook/stripe",
        ip: faker.internet.ip(),
        statusCode: faker.helpers.weightedArrayElement([
          { weight: 85, value: 200 },
          { weight: 10, value: 400 },
          { weight: 3, value: 401 },
          { weight: 2, value: 500 },
        ]),
        contentType: "application/json",
        contentLength: Buffer.byteLength(body, "utf8"),
        queryParams: {},
        headers,
        body,
        createdAt: faker.date.recent({ days: 30 }),
      });
    }

    await db.insert(webhooks).values(webhookData);
    console.log(`✅ Successfully seeded ${webhookData.length} webhook records`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log("<� Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("=� Seed failed:", error);
      process.exit(1);
    });
}
