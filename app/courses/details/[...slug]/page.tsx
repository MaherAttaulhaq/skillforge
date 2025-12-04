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
import { eq, and, ne } from "drizzle-orm";

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
  console.log(modulesWithLessons);

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
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20"></div>
                )}
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full bg-primary/90 text-white hover:bg-primary z-10"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
                <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-linear-to-t from-black/80 to-transparent">
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
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                              currentLesson?.id === lesson.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="h-5 w-5" />
                              <span>{lesson.title}</span>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </li>
                        ))}
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
