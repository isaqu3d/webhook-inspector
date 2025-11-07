import { env } from "../../../shared/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas";

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: "snake_case",
});
