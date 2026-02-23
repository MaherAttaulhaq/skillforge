import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env.local" });
console.log("DB URL:", process.env.SQLITE_CLOUD_CONNECTION_STRING);
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.SQLITE_CLOUD_CONNECTION_STRING!, // Path to your SQLite database file
  },
});
