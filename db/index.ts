import { drizzle } from 'drizzle-orm/sqlite-cloud';
import { Database } from "@sqlitecloud/drivers";
// Initialize the native SQLite Cloud client
const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);

// Initialize Drizzle with the client
export const db = drizzle({ client });
export default db;
