"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";

export async function getCategories() {
  return await db.select().from(categories);
}
