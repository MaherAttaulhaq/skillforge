"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, userSkills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";

export async function submitAction(
  prevState: { message: string; success: boolean },
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: "Not authenticated", success: false };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    return { message: "User not found", success: false };
  }

  const name = formData.get("name") as string;
  const skillsString = formData.get("skills") as string;
  const imageFile = formData.get("image") as File;

  try {
    // Update name
    if (name && name !== user.name) {
      await db.update(users).set({ name }).where(eq(users.id, user.id));
    }

    // Handle Image Upload
    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(imageFile.name);
      const filename = `image-${user.id}-${uniqueSuffix}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(filepath, buffer);

      const imageUrl = `/uploads/${filename}`;
      await db
        .update(users)
        .set({ image: imageUrl })
        .where(eq(users.id, user.id));
    }

    // Update skills
    const newSkills = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await db.delete(userSkills).where(eq(userSkills.userId, user.id));

    if (newSkills.length > 0) {
      await db.insert(userSkills).values(
        newSkills.map((skill) => ({
          userId: user.id,
          skill: skill,
        })),
      );
    }

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return { message: "Profile updated successfully!", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Failed to update profile.", success: false };
  }
}
