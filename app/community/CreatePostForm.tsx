"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "./actions";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Post"}
    </Button>
  );
}

export function CreatePostForm() {
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
          <div className="space-y-2">
            <label htmlFor="media">Image/Video (Optional)</label>
            <Input name="media" type="file" accept="image/*,video/*" />
          </div>
          <SubmitButton />
          {state?.message && (
            <p className={state.success ? "text-green-500" : "text-red-500"}>
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}