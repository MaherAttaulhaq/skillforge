import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, PlayCircle, Play, ExternalLink } from "lucide-react";
import { MarkAsCompleteButton } from "./MarkAsCompleteButton"; // Corrected import path
import Link from "next/link";
import {
  courses as coursesTable,
  modules as modulesTable,
  lessons as lessonsTable,
  categories as categoriesTable,
  users as usersTable,
  lessonProgress,
} from "@/db/schema";
import { db } from "@/db";
import { eq, and, ne, inArray } from "drizzle-orm";

interface params {
  slug?: string[];
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const id = slug && slug[0];
  const lessonId = search.lesson;

  // Fetch course with category and instructor info
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

  if (!course) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <Link href="/courses">
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </div>
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

  // Fetch modules with lessons
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

  // Placeholder for user
  const userId = 1;

  // Fetch user progress
  const allLessonsIds = modulesWithLessons.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );

  let userProgress: { isCompleted: boolean | null; lessonId: number }[] = [];

  if (allLessonsIds.length > 0) {
    userProgress = await db
      .select({
        lessonId: lessonProgress.lessonId,
        isCompleted: lessonProgress.isCompleted,
      })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          inArray(lessonProgress.lessonId, allLessonsIds)
        )
      );
  }

  // Calculate progress
  const totalLessons = allLessonsIds.length;
  const completedLessons = userProgress.filter((p) => p.isCompleted).length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const currentLesson =
    modulesWithLessons
      .flatMap((m) => m.lessons)
      .find((l) => l.id === Number(lessonId)) ||
    modulesWithLessons[0]?.lessons[0];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2 text-sm font-medium text-muted-foreground">
              <Link href="/courses" className="hover:text-primary">
                My Courses
              </Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-primary">
                {course.categoryTitle || "Category"}
              </Link>
              <span>/</span>
              <span className="text-foreground">{course.title}</span>
            </div>
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                  {currentLesson?.title || course.title}
                </h1>
                <p className="text-base font-normal text-muted-foreground">
                  {course.description ||
                    "Master concepts and build modern applications."}
                </p>
              </div>
              {currentLesson && (
                <MarkAsCompleteButton
                  lessonId={currentLesson.id}
                  isCompleted={
                    !!userProgress.find((p) => p.lessonId === currentLesson.id)
                      ?.isCompleted
                  }
                  courseId={course.id}
                  courseSlug={course.slug}
                />
              )}
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              {currentLesson?.videoUrl ? (
                <div className="relative aspect-video">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              ) : currentLesson?.content ? (
                <div className="p-6 bg-muted/20">
                  <h2 className="text-2xl font-bold mb-4">Lesson Content</h2>
                  <pre className="bg-white p-4 rounded-md whitespace-pre-wrap font-sans">
                    {currentLesson.content}
                  </pre>
                </div>
              ) : (
                <div className="relative flex items-center justify-center bg-black aspect-video">
                  {course.thumbnail ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-60"
                      style={{
                        backgroundImage: `url("${course.thumbnail}")`,
                      }}
                    ></div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                  )}
                  <PlayCircle className="h-16 w-16 text-white z-10" />
                </div>
              )}
            </div>
          </div>
        </div>
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
          <Card className="sticky top-24 shadow-sm">
            <CardContent className="p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 justify-between items-center">
                  <p className="text-sm font-bold">Course Progress</p>
                  <p className="text-sm font-medium text-primary">
                    {progressPercentage}%
                  </p>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-4">Modules</h3>
              <Accordion
                type="multiple"
                defaultValue={modulesWithLessons.map((m) => m.id.toString())}
                className="w-full"
              >
                {modulesWithLessons.map((module) => (
                  <AccordionItem key={module.id} value={module.id.toString()}>
                    <AccordionTrigger className="font-bold text-lg">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-2 mt-2">
                        {module.lessons.map((lesson) => {
                          const isCompleted = !!userProgress.find(
                            (p) => p.lessonId === lesson.id
                          )?.isCompleted;

                          return (
                            <li
                              key={lesson.id}
                              className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                                currentLesson?.id === lesson.id
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <Link
                                href={`/courses/details/${course.id}/${course.slug}?lesson=${lesson.id}`}
                                className="flex items-center gap-3"
                              >
                                <PlayCircle className="h-5 w-5" />
                                <span>{lesson.title}</span>
                              </Link>
                              <CheckCircle
                                className={`h-5 w-5 ${
                                  isCompleted
                                    ? "text-green-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </aside>
      </div>
      {relatedCourses.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Related Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((relatedCourse) => (
              <Link
                key={relatedCourse.id}
                href={`/courses/details/${relatedCourse.id}/${relatedCourse.slug}`}
              >
                <Card className="h-full flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className="relative h-48 w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${relatedCourse.thumbnail}")`,
                    }}
                  >
                    {!relatedCourse.thumbnail && (
                      <div className="h-48 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <p className="text-sm text-primary font-medium mb-1">
                      {relatedCourse.categoryTitle}
                    </p>
                    <h3 className="text-lg font-bold mb-2 flex-grow">
                      {relatedCourse.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <p className="capitalize">{relatedCourse.level}</p>
                      <p>⭐ 4.5</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
