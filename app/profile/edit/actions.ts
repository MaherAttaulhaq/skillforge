"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as string;

  try {
    await db
      .update(users)
      .set({
        name,
        bio,
        ...(image ? { image } : {}),
      })
      .where(eq(users.email, session.user.email));

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Failed to update profile" };
  }
}
