"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader } from "lucide-react";
import { useTransition } from "react";
import { toggleLessonCompletion } from "../actions";

interface MarkAsCompleteButtonProps {
  lessonId: number;
  isCompleted: boolean;
  courseId: number;
  courseSlug: string;
}

export function MarkAsCompleteButton({
  lessonId,
  isCompleted,
  courseId,
  courseSlug,
}: MarkAsCompleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await toggleLessonCompletion(lessonId, isCompleted, courseId, courseSlug);
    });
  };

  const Icon = isCompleted ? CheckCircle : Circle;

  return (
    <Button
      className="gap-2 shadow-sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      <span>{isCompleted ? "Mark as Incomplete" : "Mark as Complete"}</span>
    </Button>
  );
}
