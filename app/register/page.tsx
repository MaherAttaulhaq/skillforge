"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { registerUser } from "./actions";

const initialState = {
  message: "",
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Registering..." : "Register"}
    </Button>
  );
}

export default function Page() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <Card className="w-full max-w-sm mx-auto my-10">
      <CardHeader>
        <CardTitle>Register for an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
        <CardAction>
          <Link href="/Signin">
            <Button variant="link">Already have an account? Login</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="John Doe"
                required
              />
              {state.errors?.username && (
                <p className="text-red-500 text-sm">
                  {state.errors.username.join(", ")}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              {state.errors?.email && (
                <p className="text-red-500 text-sm">
                  {state.errors.email.join(", ")}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && (
                <p className="text-red-500 text-sm">
                  {state.errors.password.join(", ")}
                </p>
              )}
            </div>
          </div>
          {state.message && !state.errors && (
            <p className="text-red-500 text-sm mt-4">{state.message}</p>
          )}
          {state.message && state.message.includes("success") && (
            <p className="text-green-500 text-sm mt-4">{state.message}</p>
          )}
          <div className="mt-6">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
