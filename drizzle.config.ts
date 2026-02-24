import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

if (!process.env.SQLITE_CLOUD_CONNECTION_STRING) {
  throw new Error("SQLITE_CLOUD_CONNECTION_STRING is required");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  driver: "sqlite-cloud",
  dbCredentials: {
    url: process.env.SQLITE_CLOUD_CONNECTION_STRING!,
  },
});
