"use server";

import db from "@/db";
import {
  categories,
  courses,
  chapters,
  users_courses as usersCourses,
} from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getCategories() {
  return await db.select().from(categories);
}

export async function getCourses() {
  return await db.select().from(courses);
}

export async function getCourse(courseId: string) {
  const id = parseInt(courseId, 10);
  if (isNaN(id)) {
    return null;
  }
  const data = await db.select().from(courses).where(eq(courses.id, id));
  return data[0] ?? null;
}

export async function getChapters(courseId: string) {
  const id = parseInt(courseId, 10);
  if (isNaN(id)) {
    return [];
  }
  return await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, id))
    .orderBy(asc(chapters.position));
}

export async function checkCourseAccess(courseId: string, userId: string) {
  const numericCourseId = parseInt(courseId, 10);
  if (isNaN(numericCourseId)) {
    return false;
  }
  const data = await db
    .select()
    .from(usersCourses) // Using 'usersCourses' which exists in your migrations, instead of 'purchases'
    .where(
      and(
        eq(usersCourses.userId, userId),
        eq(usersCourses.courseId, numericCourseId),
      ),
    );

  return data.length > 0;
}

export async function getEnrolledCourses(userId: string) {
  const data = await db
    .select({
      course: courses,
    })
    .from(courses)
    .innerJoin(usersCourses, eq(courses.id, usersCourses.courseId)) // Using 'usersCourses'
    .where(eq(usersCourses.userId, userId));

  return data.map((item) => item.course);
}
