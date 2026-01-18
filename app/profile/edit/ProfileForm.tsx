"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(user.image);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (preview && preview !== user.image) {
      formData.set("image", preview);
    } else {
      formData.delete("image");
    }

    const result = await updateProfile(formData);

    if (result.success) {
      toast.success("Profile updated successfully");
      startTransition(() => {
        router.refresh();
        router.push("/profile");
      });
    } else {
      toast.error(result.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group cursor-pointer">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={preview || ""} />
            <AvatarFallback className="text-4xl">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="image-upload"
            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-8 w-8" />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Click to upload new picture
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full Name
          </label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={user.bio}
            placeholder="Tell us about yourself"
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading || isPending}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
