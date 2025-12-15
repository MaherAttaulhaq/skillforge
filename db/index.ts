// server-only
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

let db: BetterSQLite3Database<typeof schema>;
try {
  const sqlite = new Database("./sqlite.db");
  sqlite.pragma("foreign_keys = ON");
  db = drizzle(sqlite, { schema });
  console.log("✅ Database connected successfully!");
} catch (error) {
  console.error("Failed to connect to the database:", error);
  throw error; // Re-throw the error to ensure the application fails loudly
}

export { db };
export default db;
