import { db } from "@/db";
import {
  courses as coursesTable,
  modules as modulesTable,
  lessons as lessonsTable,
  categories as categoriesTable,
  users as usersTable,
  lessonProgress,
} from "@/db/schema";
import { eq, and, ne, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const session = await getSession();
  const user = session?.user;

  const course = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      slug: coursesTable.slug,
      description: coursesTable.description,
      thumbnail: coursesTable.thumbnail,
      level: coursesTable.level,
      price: coursesTable.price,
      categoryId: coursesTable.categoryId,
      categoryTitle: categoriesTable.title,
      instructorName: usersTable.name,
    })
    .from(coursesTable)
    .leftJoin(categoriesTable, eq(coursesTable.categoryId, categoriesTable.id))
    .leftJoin(usersTable, eq(coursesTable.instructorId, usersTable.id))
    .where(eq(coursesTable.id, Number(id)))
    .get();
  console.log("courses is ", course);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const modules = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.courseId, Number(id)))
    .orderBy(modulesTable.position);

  const modulesWithLessons = await Promise.all(
    modules.map(async (module) => {
      const lessons = await db
        .select()
        .from(lessonsTable)
        .where(eq(lessonsTable.moduleId, module.id))
        .orderBy(lessonsTable.position);
      return { ...module, lessons };
    })
  );

  const allLessonsIds = modulesWithLessons.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );

  let userProgress: { isCompleted: boolean | null; lessonId: number }[] = [];

  if (user && allLessonsIds.length > 0) {
    userProgress = await db
      .select({
        lessonId: lessonProgress.lessonId,
        isCompleted: lessonProgress.isCompleted,
      })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, user.id),
          inArray(lessonProgress.lessonId, allLessonsIds)
        )
      );
  }

  const relatedCourses = course.categoryId
    ? await db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          slug: coursesTable.slug,
          thumbnail: coursesTable.thumbnail,
          level: coursesTable.level,
          categoryTitle: categoriesTable.title,
        })
        .from(coursesTable)
        .leftJoin(
          categoriesTable,
          eq(coursesTable.categoryId, categoriesTable.id)
        )
        .where(
          and(
            eq(coursesTable.categoryId, course.categoryId),
            ne(coursesTable.id, course.id)
          )
        )
        .limit(3)
    : [];

  return NextResponse.json({
    course,
    modulesWithLessons,
    userProgress,
    relatedCourses,
  });
}
