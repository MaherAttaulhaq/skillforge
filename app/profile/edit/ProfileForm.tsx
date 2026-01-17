"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitAction } from "../actions/form";
import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useFormStatus } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type User = InferSelectModel<typeof users>;

const initialState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function ProfileForm({
  user,
}: {
  user: (User & { skills: string[] }) | undefined;
}) {
  const [state, formAction] = useActionState(submitAction, initialState);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    setSkills(user?.skills || []);
  }, [user?.skills]);

  const addSkill = () => {
    if (currentSkill.trim()) {
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={user?.name ?? ""}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={(user as any)?.bio ?? ""}
          className="mt-1 block w-full"
          placeholder="Tell us a little about yourself"
        />
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Label htmlFor="avatar" className="text-gray-700 dark:text-gray-300">
            Avatar
          </Label>
          <Input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="skills" className="text-gray-700 dark:text-gray-300">
          Skills
        </Label>
        <div className="flex flex-wrap gap-2 mb-3 mt-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-muted rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="skill-input"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter"
            className="mt-1 block w-full"
          />
          <Button type="button" variant="outline" onClick={addSkill}>
            Add
          </Button>
        </div>
        <input type="hidden" name="skills" value={skills.join(",")} />
        <p className="text-sm text-muted-foreground mt-1">
          Type a skill and press Enter or click Add.
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
