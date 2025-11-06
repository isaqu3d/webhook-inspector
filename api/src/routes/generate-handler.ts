import { db } from "@/db";
import { webhooks } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/generate",
    {
      schema: {
        summary: "Generate a Typescript handler",
        tags: ["Webhooks"],
        body: z.object({
          webhookIds: z.array(z.string()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body;

      const result = await db
        .select({
          body: webhooks.body,
        })
        .from(webhooks)
        .where(inArray(webhooks.id, webhookIds));

      const webhooksBodies = result.map((webhook) => webhook.body).join("\n\n");

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `
          You are a TypeScript code generator specialized in creating webhook handlers.

          Given the following webhook request body examples, generate a complete, production-ready TypeScript webhook handler that:

          1. **Creates Zod schemas** for each unique event type found in the examples
          2. **Implements type-safe event handlers** for each event type using TypeScript and Zod
          3. **Includes a main handler function** that routes incoming webhooks to the appropriate event handler based on the event type
          4. **Uses best practices** including:
             - Proper error handling and validation
             - TypeScript strict mode compatibility
             - Clear type inference from Zod schemas
             - Descriptive comments for complex logic
             - Modular, maintainable code structure

          5. **Exports**:
             - Individual Zod schemas for each event type
             - Type definitions inferred from schemas
             - Individual handler functions for each event type
             - A main webhook handler function that orchestrates event routing

          **Requirements**:
          - Use \`zod\` for schema validation
          - Generate types using \`z.infer<typeof schema>\`
          - Handle unknown event types gracefully
          - Include JSDoc comments for public functions
          - Use async/await for handlers
          - Return appropriate success/error responses

          **Output format**:
          Provide ONLY the TypeScript code without markdown code blocks or explanations.

          **Webhook Examples**:

          \`\`\`json
          ${webhooksBodies}
          \`\`\`

         Return only the code within and do not return \`\`\ typescript or any markdown symbols, do not include any introduction or text before or after the code.
        `.trim(),
      });

      return reply.status(201).send({ code: text });
    }
  );
};
