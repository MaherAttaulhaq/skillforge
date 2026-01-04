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
import {
  Image as ImageIcon,
  Type,
  Hash,
  FileText,
  Send,
  PenTool,
  Layers,
} from "lucide-react";

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
      size="lg"
    >
      {pending ? (
        "Creating..."
      ) : (
        <><Send className="w-4 h-4 mr-2" /> Publish Post</>
      )}
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
    <div className="flex justify-center items-center w-full py-8 px-4">
      <Card className="w-full max-w-3xl shadow-lg border-slate-200/60 dark:border-slate-800">
        <CardHeader className="space-y-1 border-b bg-slate-50/50 dark:bg-slate-900/50 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PenTool className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Create a New Post</CardTitle>
          </div>
          <CardDescription className="text-base ml-14">
            Share your knowledge, ask questions, or start a discussion with the community.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="What's on your mind?"
                className="h-12 text-lg"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  Category
                </Label>
                <Select name="categoryId" required>
                  <SelectTrigger className="h-11">
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
              <div className="space-y-3">
                <Label htmlFor="tags" className="text-base font-semibold flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  Tags
                </Label>
                <TagInput
                  value={tags}
                  onChange={setTags}
                  placeholder="Add tags (enter to add)"
                />
                <input type="hidden" name="tags" value={tags.join(",")} />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="content" className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Share your detailed thoughts here..."
                required
                className="min-h-[200px] resize-y text-base leading-relaxed p-4"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="media" className="text-base font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Media Attachment
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="media"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 transition-colors border-slate-300 dark:border-slate-700"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <Input
                    id="media"
                    name="media"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-8 pt-0 border-t bg-slate-50/50 dark:bg-slate-900/50 mt-0">
            <div className="w-full pt-6">
              <SubmitButton />
            </div>
            {state?.message && (
              <div
                className={`flex items-center gap-2 text-sm font-medium p-3 rounded-md w-full ${state.success
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                  }`}
              >
                {state.success ? "✅" : "❌"} {state.message}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}