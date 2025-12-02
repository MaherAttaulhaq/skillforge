import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  PlayCircle,
  Play,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  courses as coursesTable,
  modules as modulesTable,
  lessons as lessonsTable,
  categories as categoriesTable,
  users as usersTable,
} from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

interface params {
  slug?: string[];
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<params>;
}) {
  const { slug } = await params;
  const id = slug && slug[0];

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

  // Calculate progress (for demo, set to 0)
  const totalLessons = modulesWithLessons.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );
  const completedLessons = 0; // Would come from lesson_progress table
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get first lesson as current
  const currentLesson = modulesWithLessons[0]?.lessons[0];

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
              <Button className="gap-2 shadow-sm">
                <CheckCircle className="h-4 w-4" />
                Mark as Complete
              </Button>
            </div>
            <div>
              <div className="relative flex items-center justify-center bg-black aspect-video rounded-xl overflow-hidden shadow-lg group">
                {course.thumbnail ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity"
                    style={{
                      backgroundImage: `url("${course.thumbnail}")`,
                    }}
                  ></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                )}
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full bg-primary/90 text-white hover:bg-primary z-10"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
                <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="relative flex h-4 items-center justify-center group/progress">
                    <div className="h-1.5 w-full rounded-full bg-white/30">
                      <div
                        className="h-1.5 rounded-full bg-accent"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <div
                      className="absolute h-3 w-3 rounded-full bg-white shadow transition-transform group-hover/progress:scale-110"
                      style={{ left: "25%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-white text-xs font-medium">
                    <span>2:37</span>
                    <span>10:14</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="border-b">
                <nav className="-mb-px flex space-x-6">
                  <Link
                    href="#"
                    className="border-b-2 border-primary py-3 px-1 text-sm font-medium text-primary"
                  >
                    Overview
                  </Link>
                  <Link
                    href="#"
                    className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border"
                  >
                    Q&A
                  </Link>
                  <Link
                    href="#"
                    className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border"
                  >
                    My Notes
                  </Link>
                </nav>
              </div>
              <div className="py-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-bold">About this lesson</h3>
                  <p className="text-muted-foreground">
                    {currentLesson?.content ||
                      course.description ||
                      "In this course, you'll learn the fundamentals and advanced concepts."}
                  </p>
                  {course.instructorName && (
                    <>
                      <h4 className="text-md font-bold mt-4">Instructor</h4>
                      <p className="text-muted-foreground">
                        {course.instructorName}
                      </p>
                    </>
                  )}
                  <h4 className="text-md font-bold mt-4">Resources</h4>
                  <ul className="list-none pl-0 space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Download className="h-4 w-4" />
                        Downloadable Source Code (.zip)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Official Documentation
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
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
              {modulesWithLessons.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="item-0"
                  className="w-full"
                >
                  {modulesWithLessons.map((module, index) => (
                    <AccordionItem
                      key={module.id}
                      value={`item-${index}`}
                      className="border-b-0"
                    >
                      <AccordionTrigger className="hover:no-underline py-2">
                        <div className="flex flex-col items-start gap-1 text-left">
                          <span className="font-bold text-sm">
                            {module.position}. {module.title}
                          </span>
                          <span className="text-xs text-muted-foreground font-normal">
                            {module.lessons.length} lesson
                            {module.lessons.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-1 mt-1">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <Link
                              key={lesson.id}
                              href="#"
                              className={`flex items-center gap-3 p-3 rounded-lg ${lessonIndex === 0 && index === 0
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted text-muted-foreground"
                                }`}
                            >
                              {lessonIndex === 0 && index === 0 ? (
                                <PlayCircle className="h-5 w-5 shrink-0" />
                              ) : (
                                <CheckCircle className="h-5 w-5 shrink-0" />
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {lesson.title}
                                </span>
                                {lesson.videoUrl && (
                                  <span className="text-xs opacity-80">
                                    Video
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No modules available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
