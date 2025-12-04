"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addComment(postId: number, content: string) {
  const userId = 1; // Hardcoded user ID for now

  if (content) {
    await db.insert(comments).values({
      content,
      postId,
      authorId: userId,
    });
    revalidatePath("/community");
  }
}
