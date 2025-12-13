"use server";

import { db } from "@/db";
import { lessonProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleLessonCompletion(
  lessonId: number,
  isCompleted: boolean,
  courseId: number,
  courseSlug: string,
  user: any
) {
  if (!user) {
    return { error: "User not authenticated" };
  }

  const userId = user.id;

  try {
    await db
      .insert(lessonProgress)
      .values({
        userId,
        lessonId,
        isCompleted: !isCompleted,
      })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: { isCompleted: !isCompleted },
      });

    revalidatePath(`/courses/details/${courseId}/${courseSlug}`);

    return { success: true };
  } catch (error) {
    console.error("Error toggling lesson completion:", error);
    return { error: "Failed to toggle lesson completion" };
  }
}
