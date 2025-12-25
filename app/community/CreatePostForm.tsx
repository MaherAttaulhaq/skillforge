"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "./actions";
import { Label } from "@/components/ui/label";
import { type Category } from "@/db/schema";
import { TagInput } from "@/components/ui/tag-input";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating..." : "Create Post"}
    </Button>
  );
}

type CreatePostFormProps = {
  categories: Category[];
};

export function CreatePostForm({ categories }: CreatePostFormProps) {
  const [state, formAction] = useActionState(createPost, initialState);
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>
            Share your thoughts and experiences with the community.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title for your post"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="categoryId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <TagInput
                  value={tags}
                  onChange={setTags}
                  placeholder="Add up to 5 tags..."
                />
                <input type="hidden" name="tags" value={tags.join(",")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content here."
                required
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media">Image or Video (Optional)</Label>
              <Input
                id="media"
                name="media"
                type="file"
                accept="image/*,video/*"
                className="file:text-foreground"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <SubmitButton />
            {state?.message && (
              <p
                className={`text-sm ${
                  state.success ? "text-green-500" : "text-red-500"
                }`}
              >
                {state.message}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}