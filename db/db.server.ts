// server-only
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

try {
  const sqlite = new Database("./sqlite.db");
  sqlite.pragma('foreign_keys = ON');
  export const db = drizzle(sqlite, { schema });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  throw error; // Re-throw the error to ensure the application fails loudly
}
