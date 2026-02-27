"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginUser(
  prevState: { message: string } | undefined,
  formData: FormData,
) {
  try {
    const formValues = Object.fromEntries(formData);
    if (typeof formValues.email === "string") {
      formValues.email = formValues.email.trim();
    }

    await signIn("credentials", {
      ...formValues,
      redirectTo: "/profile",
    });
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
