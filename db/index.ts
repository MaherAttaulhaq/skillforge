import { config as loadEnv } from "dotenv";
import { drizzle } from "drizzle-orm/sqlite-cloud";
import type { ExtractTablesWithRelations } from "drizzle-orm/_relations";
import { Database } from "@sqlitecloud/drivers";
import * as schema from "./schema";

// CLI scripts (tsx) do not auto-load Next.js env files.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env", override: false });

const connectionString = process.env.SQLITE_CLOUD_CONNECTION_STRING;
if (!connectionString) {
  throw new Error(
    "Missing SQLITE_CLOUD_CONNECTION_STRING. Add it to .env.local or .env.",
  );
}

// Initialize the SQLite Cloud client for Drizzle
const client = new Database(connectionString);

// Initialize Drizzle with the client and schema
// The schema is passed here to provide type-safety and enable relational queries.
type AppSchema = typeof schema;
type AppRelations = ExtractTablesWithRelations<AppSchema>;
export const db = drizzle<AppSchema, AppRelations>({ client, schema });
export default db;
