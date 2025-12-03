"use server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const submitAction = async (data: { name: string; avatar: string | undefined }) => {
    const userId = 1; // Hardcoded user ID

    try {
        await db.update(users).set({
            name: data.name,
            avatar: data.avatar,
        }).where(eq(users.id, userId));

        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update profile" };
    }
}
