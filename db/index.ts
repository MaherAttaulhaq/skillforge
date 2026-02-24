import { drizzle } from 'drizzle-orm/sqlite-cloud';
import { Database } from "@sqlitecloud/drivers";
import * as schema from "./schema";

// Initialize the SQLite Cloud client for Drizzle
const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);

// Initialize Drizzle with the client and schema
// The schema is passed here to provide type-safety and enable relational queries.
const db = drizzle({ client, schema });
export default db;
