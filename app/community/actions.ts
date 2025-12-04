"use server";

import { db } from "@/db";
import { comments, posts } from "@/db/schema";
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
// make a form action to create a post
export async function createPost(
  prevState: { message: string },
  formData: FormData
) {
  const userId = 1; // Hardcoded user ID for now

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    await db.insert(posts).values({
      title,
      content,
      authorId: userId,
    });
    revalidatePath("/community");
    return { message: "Post created successfully" };
  } catch (error) {
    return { message: "Failed to create post" };
  }
}
