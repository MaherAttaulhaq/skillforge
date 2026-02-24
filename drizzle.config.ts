import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  // driver: "sqlite-proxy", // Specify the proxy driver for SQLite Cloud
  dbCredentials: {
    url: process.env.SQLITE_CLOUD_CONNECTION_STRING!,
  },
});
