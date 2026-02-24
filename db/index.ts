import { drizzle } from "drizzle-orm/sqlite-proxy";
import { createSQLiteCloudClient } from "@sqlitecloud/drizzle-driver";
import * as schema from "./schema";

// Initialize the SQLite Cloud client for Drizzle
const client = createSQLiteCloudClient({
  url: process.env.SQLITE_CLOUD_CONNECTION_STRING!,
});

// Initialize Drizzle with the client and schema
// The schema is passed here to provide type-safety and enable relational queries.
export const db = drizzle(client, { schema });
export default db;
