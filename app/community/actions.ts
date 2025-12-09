"use server";

import fs from "node:fs/promises";
import path from "node:path";

import { db } from "@/db";
import { comments, posts } from "@/db/schema";
import { revalidatePath } from "next/cache";

async function saveFile(file: File) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileExtension = path.extname(file.name);
  const newFilename = `${uniqueSuffix}${fileExtension}`;
  const filePath = path.join(uploadsDir, newFilename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/${newFilename}`;
}

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
  const media = formData.get("media") as File;

  // Validate input
  if (!title || !content) {
    return { message: "Title and content are required", success: false };
  }

  let mediaUrl: string | undefined;
  try {
    if (media && media.size > 0) {
      mediaUrl = await saveFile(media);
    }

    await db.insert(posts).values({
      title,
      content,
      authorId: userId,
      mediaUrl,
    });

    revalidatePath("/community");
    return {
      message: "🎉 Post created successfully! Your post is now live.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      message: "Failed to create post. Please try again.",
      success: false,
    };
  }
}
