import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import ScalarApiReference from "@scalar/fastify-api-reference";
import { env } from "../../../shared/config/env";
import { captureWebhook } from "../../../presentation/routes/capture-webhook";
import { deleteWebhook } from "../../../presentation/routes/delete-webhook";
import { generateHandler } from "../../../presentation/routes/generate-handler";
import { getWebhook } from "../../../presentation/routes/get-webhook";
import { listWebhooks } from "../../../presentation/routes/list-webhooks";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //credentials: true
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Webhook Inspector API",
      description: "API for capturing and inspecting webhook requests",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(listWebhooks);
app.register(getWebhook);
app.register(deleteWebhook);
app.register(captureWebhook);
app.register(generateHandler);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("🔥 HTTP server running on http://0.0.0.0:3333");
  console.log("📖 API docs available on http://0.0.0.0:3333/docs");
});
