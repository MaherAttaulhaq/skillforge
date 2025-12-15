import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema from "./schema";

const sqlite = new Database("./sqlite.db");
const db = drizzle(sqlite, { schema });

async function main() {
  await migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("Migrations complete!");
  sqlite.close();
}

main();
