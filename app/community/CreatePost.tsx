"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { createPost } from "./actions";

const initialState = {
  message: "",
};

export function CreatePost() {
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new post</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <Input name="title" placeholder="Title" required />
          <Textarea name="content" placeholder="Content" required />
          <Button type="submit">Create Post</Button>
          {state?.message && <p>{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}