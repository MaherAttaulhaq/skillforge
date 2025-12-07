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
  prevState: { message: string; success: boolean } | undefined,
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const user = await db.query.users.findFirst();
  const userId = user?.id;

  if (!userId) {
    return { message: "No user found to create post.", success: false };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = formData.get("tags") as string;

  // Validate input
  if (!title || !content) {
    return { message: "Title and content are required", success: false };
  }

  try {
    await db.insert(posts).values({
      title,
      content,
      authorId: userId,
    });

    revalidatePath("/community");
    return {
      message: "🎉 Post created successfully! Your post is now live.",
      success: true
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      message: "Failed to create post. Please try again.",
      success: false
    };
  }
}
