"use server";

import { db } from "@/db";
import { lessonProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Placeholder for user authentication
const getUserId = async () => {
  // In a real app, you'd get this from your auth system
  return 1;
};

export async function toggleLessonCompletion(
  lessonId: number,
  isCompleted: boolean,
  courseId: number,
  courseSlug: string,
) {
  const userId = await getUserId();

  if (!userId) {
    return { error: "User not authenticated" };
  }

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
