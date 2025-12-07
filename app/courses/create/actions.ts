"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { courses, modules, lessons } from "@/db/schema";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryId: z.coerce.number(),
  level: z.string(),
  modules: z.array(
    z.object({
      title: z.string().min(1, "Module title is required"),
      description: z.string().optional(),
      lessons: z.array(
        z.object({
          title: z.string().min(1, "Lesson title is required"),
          content: z.string().optional(),
        })
      ),
    })
  ),
});

export async function createCourse(
  prevState: { message: string; errors: { [key: string]: string[] } },
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("Received form data:", rawFormData);
  // This is a simplified representation. In a real app, you'd parse
  // the nested module and lesson data properly, likely from a JSON string
  // passed in a hidden input field.
  const tempModules = JSON.parse((formData.get("modules") as string) || "[]");
  console.log("Parsed modules:", tempModules);

  const validatedFields = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("category"),
    level: formData.get("level"),
    modules: tempModules,
  });

  console.log("Validated fields:", validatedFields);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error: Invalid fields.",
    };
  }

  const {
    title,
    description,
    categoryId,
    level,
    modules: moduleData,
  } = validatedFields.data;

  // For now, let's assume a hardcoded instructorId
  const instructorId = 8; // In a real app, get this from the session/user context

  let newCourse: { id: number; slug: string } | undefined;
  try {
    [newCourse] = await db
      .insert(courses)
      .values({
        title,
        description,
        categoryId,
        level,
        instructorId,
        slug: title.toLowerCase().replace(/\s+/g, "-"), // simple slug generation
      })
      .returning({ id: courses.id, slug: courses.slug });

    if (!newCourse) {
      throw new Error("Failed to create course.");
    }

    for (const [moduleIndex, module] of moduleData.entries()) {
      const [newModule] = await db
        .insert(modules)
        .values({
          title: module.title,
          courseId: newCourse.id,
          position: moduleIndex,
        })
        .returning();

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        await db.insert(lessons).values({
          title: lesson.title,
          content: lesson.content,
          moduleId: newModule.id,
          position: lessonIndex,
        });
      }
    }
  } catch (e: any) {
    console.error(e);
    if (e.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return {
        message:
          "Database error: A foreign key constraint failed. This can happen if the database is not seeded with initial data (like users and categories). Please try running the seed script.",
      };
    }
    return {
      message: "Database error: Failed to create course.",
    };
  }

  revalidatePath("/courses");
  if (newCourse) {
    redirect(`/courses/${newCourse.slug}`);
  } else {
    redirect("/courses");
  }
}
