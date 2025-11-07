import { env } from "./src/shared/config/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },

  out: "./src/infrastructure/database/drizzle/migrations",
  schema: "./src/infrastructure/database/drizzle/schemas/index.ts",
  casing: "snake_case",
});
