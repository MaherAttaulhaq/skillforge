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
import { useFormStatus } from "react-dom";
import { loginUser } from "./actions";
import { useActionState } from "react";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export default function Page() {
  const [state, formAction] = useActionState(loginUser, initialState.message);

  return (
    <Card className="w-full max-w-sm mx-auto my-10">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account
        </CardDescription>
        <CardAction>
          <Link href="/register">
            <Button variant="link"> Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
          {state?.message && (
            <p className="text-red-500 text-sm mt-4">{state.message}</p>
          )}
          <div className="mt-6">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

