"use client";

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
import { MarkAsCompleteButton } from "./MarkAsCompleteButton";
import Link from "next/link";
import { useEffect, useState } from "react";

interface params {
  slug?: string[];
}

export default function CourseDetails({
  params,
  searchParams,
}: {
  params: params;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [course, setCourse] = useState<any>(null);
  const [modulesWithLessons, setModulesWithLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = params;
      const id = slug && slug[0];

      const res = await fetch(`/api/courses/${id}`);
      const data = await res.json();

      setCourse(data.course);
      setModulesWithLessons(data.modulesWithLessons);
      setUserProgress(data.userProgress);
      setRelatedCourses(data.relatedCourses);
      setLoading(false);
    };

    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data.session);
    };

    fetchData();
    fetchSession();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const search = searchParams;
  const lessonId = search.lesson;

  const totalLessons = modulesWithLessons.flatMap((m) => m.lessons).length;
  const completedLessons = userProgress.filter((p) => p.isCompleted).length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const currentLesson =
    modulesWithLessons
      .flatMap((m) => m.lessons)
      .find((l) => l.id === Number(lessonId)) ||
    modulesWithLessons[0]?.lessons[0];

  const user = session?.user;

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
              {currentLesson && user && (
                <MarkAsCompleteButton
                  lessonId={currentLesson.id}
                  isCompleted={
                    !!userProgress.find((p) => p.lessonId === currentLesson.id)
                      ?.isCompleted
                  }
                  courseId={course.id}
                  courseSlug={course.slug}
                  user={user}
                />
              )}
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              {currentLesson?.videoUrl ? (
                <div className="relative aspect-video">
                  <video
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    controls
                    className="absolute inset-0 w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
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
                        {module.lessons.map((lesson: any) => {
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
            {relatedCourses.map((relatedCourse: any) => (
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
