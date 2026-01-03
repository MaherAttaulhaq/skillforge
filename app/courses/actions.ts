"use server";

import { db } from "@/db";
import { categories, courses, chapters, purchases } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getCategories() {
  return await db.select().from(categories);
}

export async function getCourses() {
  return await db.select().from(courses);
}

export async function getCourse(courseId: string) {
  const data = await db
    .select()
    .from(courses)
    .where(eq(courses.id, parseInt(courseId)));
  return data[0];
}

export async function getChapters(courseId: string) {
  return await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, parseInt(courseId)))
    .orderBy(asc(chapters.position));
}

export async function checkCourseAccess(courseId: string, userId: string) {
  const data = await db
    .select()
    .from(purchases)
    .where(
      and(
        eq(purchases.userId, parseInt(userId)),
        eq(purchases.courseId, parseInt(courseId))
      )
    );

  return data.length > 0;
}
