"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitAction } from "../actions/form";
import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useFormStatus } from "react-dom";

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

export function ProfileForm({ user }: { user: User | undefined }) {
  const [state, formAction] = useActionState(submitAction, initialState);

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
        <Label htmlFor="avatar" className="text-gray-700 dark:text-gray-300">
          Avatar
        </Label>
        <Input
          id="avatar"
          name="avatar"
          type="file"
          className="mt-1 block w-full"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
