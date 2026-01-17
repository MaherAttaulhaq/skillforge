import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  users,
  courses,
  reviews,
  enrollments,
  modules,
  lessons,
  lessonProgress,
  userSkills,
} from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Verified, Award, FileText, GraduationCap } from "lucide-react";
import InstructorProfilePage from "@/components/instructor-dashboard";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user?.email) {
    return redirect("/");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
    with: {
      skills: {
        columns: {
          skill: true,
        },
      },
    },
  });
  
  if (!user) return redirect("/");

  const skills = user.skills.map((s) => s.skill);

  if (user.role === "instructor") {
    const coursesData = await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, user.id));
    const courseIds = coursesData.map((c) => c.id);

    let reviewsData: any[] = [];
    let enrollmentsData: any[] = [];

    if (courseIds.length > 0) {
      reviewsData = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          courseId: reviews.courseId,
          createdAt: reviews.createdAt,
          user: users,
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(inArray(reviews.courseId, courseIds));

      enrollmentsData = await db
        .select()
        .from(enrollments)
        .where(inArray(enrollments.courseId, courseIds));
    }

    const instructorCourses = coursesData.map((course) => ({
      ...course,
      reviews: reviewsData.filter((r) => r.courseId === course.id),
      enrollments: enrollmentsData.filter((e) => e.courseId === course.id),
    }));
    return (
      <InstructorProfilePage
        user={user}
        searchParams={params}
        instructorCourses={instructorCourses}
      />
    );
  }

  // Student Logic: Fetch enrolled courses and calculate progress
  const userEnrollments = await db
    .select({
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, user.id));

  const coursesWithProgress = await Promise.all(
    userEnrollments.map(async ({ course }) => {
      // Get all lessons for the course to calculate progress
      const courseLessons = await db
        .select({ id: lessons.id })
        .from(modules)
        .innerJoin(lessons, eq(modules.id, lessons.moduleId))
        .where(eq(modules.courseId, course.id));

      const totalLessons = courseLessons.length;

      if (totalLessons === 0) {
        return { ...course, progress: 0, status: "Not Started" };
      }

      const completedLessons = await db
        .select()
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, user.id),
            eq(lessonProgress.isCompleted, true),
            inArray(
              lessonProgress.lessonId,
              courseLessons.map((l) => l.id)
            )
          )
        );

      const progress = Math.round(
        (completedLessons.length / totalLessons) * 100
      );
      let status = "In Progress";
      if (progress === 0) status = "Not Started";
      if (progress === 100) status = "Completed";

      return { ...course, progress, status };
    })
  );

  const completedCoursesCount = coursesWithProgress.filter(
    (c) => c.status === "Completed"
  ).length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="flex flex-col gap-6">
              <Card className="shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                      <AvatarImage
                        src={user.image ? user.image : undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-card bg-accent text-white">
                      <Verified className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold tracking-tight">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  {(user as any).bio && (
                    <p className="text-sm text-muted-foreground text-center">
                      {(user as any).bio}
                    </p>
                  )}
                  <Link href="/profile/edit" className="w-full">
                    <Button className="w-full">Edit Profile</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    My Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No skills added yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  Dashboard Statistics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Overall ATS Score
                        </p>
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <circle
                            className="stroke-current text-muted/20"
                            cx="18"
                            cy="18"
                            fill="none"
                            r="16"
                            strokeWidth="3"
                          ></circle>
                          <circle
                            className="stroke-current text-accent transition-all duration-500"
                            cx="18"
                            cy="18"
                            fill="none"
                            r="16"
                            strokeDasharray="100"
                            strokeDashoffset="12"
                            strokeLinecap="round"
                            strokeWidth="3"
                            transform="rotate(-90 18 18)"
                          ></circle>
                        </svg>
                        <p className="absolute text-2xl font-bold text-accent">
                          88%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Resumes Analyzed
                        </p>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-4xl font-bold tracking-tight">12</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Courses Completed
                        </p>
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-4xl font-bold tracking-tight">
                        {completedCoursesCount}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Skill Badges Earned
                        </p>
                        <Award className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-4xl font-bold tracking-tight">
                        {completedCoursesCount}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Card className="shadow-sm">
                <CardHeader className="p-6 border-b">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    My Courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-6 py-3">
                          Course Title
                        </TableHead>
                        <TableHead className="px-6 py-3">Status</TableHead>
                        <TableHead className="px-6 py-3">Progress</TableHead>
                        <TableHead className="px-6 py-3 text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coursesWithProgress.length > 0 ? (
                        coursesWithProgress.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="px-6 py-4 font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge
                                variant={
                                  course.status === "Completed"
                                    ? "default"
                                    : course.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {course.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 w-1/3">
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={course.progress}
                                  className="h-2"
                                />
                                <span className="text-xs text-muted-foreground w-8">
                                  {course.progress}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <Link
                                href={`/courses/details/${course.id}/${course.slug}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:text-primary/80"
                                >
                                  {course.status === "Completed"
                                    ? "Review"
                                    : "Continue"}
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            You haven&apos;t enrolled in any courses yet.
                            <br />
                            <Link
                              href="/courses"
                              className="text-primary hover:underline mt-2 inline-block"
                            >
                              Browse Courses
                            </Link>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
