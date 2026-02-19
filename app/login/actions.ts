"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginUser(
  prevState: { message: string } | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/profile",
    });
    console.log(
      "signIn completed successfully, attempting redirect to /profile",
    );
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials." };
        default:
          return { message: "Something went wrong." };
      }
    }
    throw error;
  }
}
