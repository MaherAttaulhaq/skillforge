import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitAction } from "../actions/form";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  avatar: z.string().url().optional(),
});

function ProfileForm({ user }: { user: User | undefined }) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      avatar: user?.avatar ?? "",
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await submitAction({ name: values.name, avatar: values.avatar });
    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
          Name
        </Label>
        <Input
          id="name"
          {...form.register("name")}
          className="mt-1 block w-full"
        />
        {form.formState.errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="avatar" className="text-gray-700 dark:text-gray-300">
          Avatar URL
        </Label>
        <Input
          id="avatar"
          {...form.register("avatar")}
          className="mt-1 block w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}

export default async function ProfileEditPage() {
  const userId = 1; // Hardcoded user ID
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Edit Profile
        </h1>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
