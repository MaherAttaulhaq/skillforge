"use server";

import { auth, signOut } from "@/auth";
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
  const imageEntry = formData.get("image");
  const image =
    typeof imageEntry === "string" && imageEntry.length > 0
      ? imageEntry
      : undefined;

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

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.delete(users).where(eq(users.email, session.user.email));
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, message: "Failed to delete account" };
  }

  await signOut({ redirectTo: "/" });
}
