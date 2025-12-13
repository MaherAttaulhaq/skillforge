"use server";

import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DrizzleSQLiteError } from "drizzle-orm/sqlite-core"; // Import DrizzleSQLiteError

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(
  prevState: { message: string; errors?: { [key: string]: string[] } },
  formData: FormData
) {
  const validatedFields = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error: Invalid registration fields.",
    };
  }

  const { username, email, password } = validatedFields.data;

  try {
    const passwordHash = await bcrypt.hash(password, 10); // Hash password
    
    await db.insert(users).values({
      name: username,
      email,
      passwordHash,
      // Default role is 'student' as per schema, no need to set here
    });

    revalidatePath("/"); // Revalidate any cached data that might show user counts or similar
    redirect("/Signin"); // Redirect to sign-in page after successful registration
    
  } catch (e: any) {
    console.error("Registration error:", e);
    // Check for unique constraint violation (e.g., duplicate email)
    if (e.message && e.message.includes("UNIQUE constraint failed")) {
      return {
        message: "Registration failed: An account with this email already exists.",
      };
    }
    return {
      message: "Registration failed: An unexpected error occurred.",
    };
  }
}
