"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

interface ApplyButtonProps {
  isApplied: boolean;
  applyAction: () => Promise<void>;
}

export function ApplyButton({ isApplied, applyAction }: ApplyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
  const onClick = () => {
    startTransition(async () => {
      try {
        await applyAction();
        toast.success("You have successfully applied for the job!");
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while applying for the job.");
      }
      await applyAction();
    });
  };

  if (isApplied) {
    return (
      <Button disabled className="w-full h-12 text-base font-bold gap-2">
      <Button
        disabled
        className="w-full h-12 text-base font-bold gap-2 bg-green-600 text-white hover:bg-green-600 opacity-100"
      >
        <Check className="h-5 w-5" />
        Applied
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full h-12 text-base font-bold gap-2">
          <ArrowRight className="h-5 w-5" />
          Apply Now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to apply for this position? Your profile
            information will be shared with the company.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApply} disabled={isPending}>
            {isPending ? "Applying..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Button
      onClick={onClick}
      disabled={isPending}
      className="w-full h-12 text-base font-bold gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Applying...
        </>
      ) : (
        "Apply Now"
      )}
    </Button>
  );
}
