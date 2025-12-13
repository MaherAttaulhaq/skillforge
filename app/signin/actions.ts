"use server";

import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm"; // Import eq for equality comparison

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginUser(
  prevState: { message: string },
  formData: FormData
) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error: Invalid login fields.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
      return {
        message: "Login failed: Invalid email or password.",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return {
        message: "Login failed: Invalid email or password.",
      };
    }

    // --- Authentication Successful ---
    // In a real application, you would set up a session here.
    // For example, using an authentication library like NextAuth.js or custom session management.
    console.log("User logged in successfully:", user.email);

    redirect("/dashboard"); // Redirect to the dashboard or a protected route

  } catch (e: any) {
    console.error("Login error:", e);
    return {
      message: "Login failed: An unexpected error occurred.",
    };
  }
}
