"use server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";

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

export const submitAction = async (
  prevState: { message: string; success: boolean },
  formData: FormData,
) => {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "You must be logged in to update your profile",
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return { success: false, message: "User not found" };

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const skills = formData.get("skills") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl: string | undefined;

  try {
    if (avatarFile && avatarFile.size > 0) {
      avatarUrl = await saveFile(avatarFile);
    }

    const dataToUpdate: { name: string; bio: string; avatar?: string } = {
      name,
      bio,
    };
    if (avatarUrl) {
      dataToUpdate.avatar = avatarUrl;
    }

    await db.update(users).set(dataToUpdate).where(eq(users.id, user.id));

    if (skills !== null) {
      const skillList = skills.split(",").filter((s) => s.trim() !== "");

      await db.delete(userSkills).where(eq(userSkills.userId, user.id));

      if (skillList.length > 0) {
        await db.insert(userSkills).values(
          skillList.map((skill) => ({
            userId: user.id,
            skill: skill.trim(),
          }))
        );
      }
    }

    revalidatePath("/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update profile" };
  }
};
