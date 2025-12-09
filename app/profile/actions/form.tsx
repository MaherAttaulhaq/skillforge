"use server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import fs from "node:fs/promises";
import path from "node:path";

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

export const submitAction = async (prevState: { message: string; success: boolean }, formData: FormData) => {
    const userId = 1; // Hardcoded user ID

    const name = formData.get("name") as string;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined;

    try {
        if (avatarFile && avatarFile.size > 0) {
            avatarUrl = await saveFile(avatarFile);
        }

        const dataToUpdate: { name: string; avatar?: string } = { name };
        if (avatarUrl) {
            dataToUpdate.avatar = avatarUrl;
        }

        await db.update(users).set(dataToUpdate).where(eq(users.id, userId));

        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update profile" };
    }
}
