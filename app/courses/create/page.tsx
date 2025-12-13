import { CreateCourseForm } from "./CreateCourseForm";
import { BrainCircuit, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/db";

export default async function CreateCoursePage() {
  const categories = await db.query.categories.findMany();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">SkillForge</h2>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-sm font-bold text-primary"
              href="/courses/create"
            >
              Create a Course
            </Link>
            <Link
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              href="/courses"
            >
              My Courses
            </Link>
            <Link
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              href="/profile"
            >
              My Profile
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Create a New Course
          </h1>
          <p className="text-muted-foreground text-base">
            Fill in the details below to create your course and start teaching.
          </p>
        </div>

        <CreateCourseForm categories={categories} />
      </main>
    </div>
  );
}
