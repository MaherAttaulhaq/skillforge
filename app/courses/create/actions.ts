"use server";

import fs from "node:fs/promises";
import path from "node:path";

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
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Thumbnail is required.")
    .refine(
      (file) => file.size === 0 || file.type.startsWith("image/"),
      "Invalid file type. Must be an image."
    ),
  modules: z.array(
    z.object({
      title: z.string().min(1, "Module title is required"),
      description: z.string().optional(),
      lessons: z.array(
        z.object({
          title: z.string().min(1, "Lesson title is required"),
          content: z.string().optional(),
          video: z
            .instanceof(File)
            .optional()
            .refine(
              (file) =>
                !file || file.size === 0 || file.type.startsWith("video/"),
              "Invalid file type. Must be a video."
            ),
        })
      ),
    })
  ),
});

function parseModulesFromFormData(formData: FormData) {
  const modules: any[] = [];
  const moduleRegex = /modules\[(\d+)\]\[(\w+)\]/;
  const lessonRegex = /modules\[(\d+)\]\[lessons\]\[(\d+)\]\[(\w+)\]/;

  const tempModules: { [key: string]: any } = {};

  for (const [key, value] of formData.entries()) {
    let match = key.match(moduleRegex);
    if (match) {
      const index = match[1];
      const field = match[2];
      if (!tempModules[index]) {
        tempModules[index] = { lessons: {} };
      }
      tempModules[index][field] = value;
    } else {
      match = key.match(lessonRegex);
      if (match) {
        const moduleIndex = match[1];
        const lessonIndex = match[2];
        const field = match[3];

        if (!tempModules[moduleIndex]) {
          tempModules[moduleIndex] = { lessons: {} };
        }
        if (!tempModules[moduleIndex].lessons[lessonIndex]) {
          tempModules[moduleIndex].lessons[lessonIndex] = {};
        }
        tempModules[moduleIndex].lessons[lessonIndex][field] = value;
      }
    }
  }

  for (const key in tempModules) {
    const module = tempModules[key];
    const lessons = [];
    for (const lessonKey in module.lessons) {
      lessons.push(module.lessons[lessonKey]);
    }
    module.lessons = lessons;
    modules.push(module);
  }

  return modules;
}

async function saveFile(file: File) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileExtension = path.extname(file.name);
  const newFilename = `${uniqueSuffix}${fileExtension}`;
  const filePath = path.join(uploadsDir, newFilename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/${newFilename}`;
}

export async function createCourse(
  prevState: { message: string; errors?: { [key: string]: string[] } },
  formData: FormData
) {
  const parsedModules = parseModulesFromFormData(formData);

  const validatedFields = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("category"),
    level: formData.get("level"),
    thumbnail: formData.get("thumbnail"),
    modules: parsedModules,
  });

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
    thumbnail,
    modules: moduleData,
  } = validatedFields.data;

  // For now, let's assume a hardcoded instructorId
  const instructorId = 8; // In a real app, get this from the session/user context

  let newCourse: { id: number; slug: string } | undefined;
  try {
    const thumbnailUrl = await saveFile(thumbnail);

    [newCourse] = await db
      .insert(courses)
      .values({
        title,
        description,
        categoryId,
        level,
        instructorId,
        thumbnail: thumbnailUrl,
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
          description: module.description,
          courseId: newCourse.id,
          position: moduleIndex,
        })
        .returning({ id: modules.id });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        let videoUrl: string | undefined;
        if (lesson.video) {
          videoUrl = await saveFile(lesson.video);
        }

        await db.insert(lessons).values({
          title: lesson.title,
          content: lesson.content,
          moduleId: newModule.id,
          videoUrl,
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
    redirect(`/courses/details/${newCourse.slug}`);
  } else {
    redirect("/courses");
  }
}
