"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

interface SaveButtonProps {
  isSaved: boolean;
  toggleSaveAction: () => Promise<void>;
  disabled?: boolean;
}

export function SaveButton({
  isSaved,
  toggleSaveAction,
  disabled,
}: SaveButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await toggleSaveAction();
        if (isSaved) {
          toast.success("Job removed from saved jobs");
        } else {
          toast.success("Job saved successfully");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Button
      disabled={disabled || isPending}
      variant="outline"
      className="w-full h-12 text-base font-bold gap-2 border-2"
      onClick={handleSave}
    >
      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save Job"}
    </Button>
  );
}
