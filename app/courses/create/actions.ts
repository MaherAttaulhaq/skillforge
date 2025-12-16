"use server";

import fs from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { courses, modules, lessons } from "@/db/schema";
import { z } from "zod";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/permissions";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  console.log("formdata is in action", formData);

  const modulesMap = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    // Match module fields: modules[<moduleIndex>][<field>]
    let match = key.match(/^modules\[(\d+)\]\[(\w+)\]$/);
    if (match) {
      const moduleIndex = parseInt(match[1]);
      const field = match[2];

      if (!modulesMap.has(moduleIndex)) {
        modulesMap.set(moduleIndex, { lessons: {} });
      }
      const module = modulesMap.get(moduleIndex);
      module[field] = value;
      continue;
    }

    // Match lesson fields: modules[<moduleIndex>][lessons][<lessonIndex>][<field>]
    match = key.match(/^modules\[(\d+)\]\[lessons\]\[(\d+)\]\[(\w+)\]$/);
    if (match) {
      const moduleIndex = parseInt(match[1]);
      const lessonIndex = parseInt(match[2]);
      const field = match[3];

      if (!modulesMap.has(moduleIndex)) {
        modulesMap.set(moduleIndex, { lessons: {} });
      }
      const module = modulesMap.get(moduleIndex);

      if (!module.lessons[lessonIndex]) {
        module.lessons[lessonIndex] = {};
      }
      module.lessons[lessonIndex][field] = value;
      continue;
    }
  }

  const modules: any[] = Array.from(modulesMap.entries())
    .sort(([aIndex], [bIndex]) => aIndex - bIndex)
    .map(([, module]) => {
      const lessons = Array.from(Object.entries(module.lessons))
        .sort(([aIndex], [bIndex]) => parseInt(aIndex) - parseInt(bIndex))
        .map(([, lesson]) => lesson);
      return { ...module, lessons };
    });

  console.log("[parseModulesFromFormData] Final modules array before return:", JSON.stringify(modules, (key, value) => {
    if (value instanceof File) return { name: value.name, size: value.size, type: value.type };
    return value;
  }, 2));

  return modules;
}

async function saveFile(file: File): Promise<string | null> {
  try {
    console.log(`[saveFile] Attempting to save file: ${file.name}`);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    console.log(`[saveFile] Target directory: ${uploadsDir}`);

    await fs.mkdir(uploadsDir, { recursive: true });
    console.log(`[saveFile] Directory ensured: ${uploadsDir}`);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.name);
    const newFilename = `${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadsDir, newFilename);
    console.log(`[saveFile] New filename: ${newFilename}, Full path: ${filePath}`);

    if (file.size === 0) {
      console.warn(`[saveFile] File ${file.name} has zero size. Skipping write.`);
      return null; // Or handle as an error, depending on desired behavior
    }

    console.log(`[saveFile] Reading file buffer for ${file.name}, size: ${file.size}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`[saveFile] Buffer created, length: ${buffer.length}`);

    await fs.writeFile(filePath, buffer);
    console.log(`[saveFile] File written successfully to ${filePath}`);

    return `/uploads/${newFilename}`;
  } catch (error) {
    console.error(`[saveFile] Error saving file ${file.name}:`, error);
    throw error; // Re-throw to be caught by the caller
  }
}

export async function createCourse(
  prevState: { message: string; errors?: { [key: string]: string[] } },
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Error: Not authenticated." };
  }

  const userRole = session?.user?.role;
  const canCreateCourse = hasPermission(userRole, PERMISSIONS.create_courses);

  if (!canCreateCourse) {
    return { message: "Error: You don't have permission to create courses." };
  }

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

  const instructorId = parseInt(session.user.id, 10);

  let newCourse: { id: number; slug: string } | undefined;
  try {
    const thumbnailUrl = await saveFile(thumbnail);
    if (!thumbnailUrl) {
      return {
        message: "Error: Failed to save thumbnail.",
      };
    }

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
          courseId: newCourse.id,
          position: moduleIndex,
        })
        .returning({ id: modules.id });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        let videoUrl: string | undefined;
        if (lesson.video) {
          videoUrl = await saveFile(lesson.video as File);
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
