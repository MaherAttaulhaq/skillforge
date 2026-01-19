import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, Download } from "lucide-react";
import { db } from "@/db";
import {
  courses,
  enrollments,
  users,
  posts,
  comments,
  userSkills,
  users_courses,
} from "@/db/schema";
import { eq, desc, sql, and, like } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InstructorDashboard from "@/components/instructor-dashboard";
import { PaginationControl } from "@/components/PaginationControl";
import { ProfileTabs } from "./ProfileTabs";
import { SearchCourses } from "./SearchCourses";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

async function getProfileData(query: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return null;

  // Fetch stats
  const [postCount] = await db
    .select({ count: sql`count(*)` })
    .from(posts)
    .where(eq(posts.authorId, user.id));

  const [commentCount] = await db
    .select({ count: sql`count(*)` })
    .from(comments)
    .where(eq(comments.authorId, user.id));

  // Fetch skills
  const skills = await db
    .select({ name: userSkills.skill, level: userSkills.level })
    .from(userSkills)
    .where(eq(userSkills.userId, user.id));

  // Fetch courses
  const userEnrollments = await db
    .select({
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(
      and(
        eq(enrollments.userId, user.id),
        query ? like(courses.title, `%${query}%`) : undefined,
      ),
    );

  const coursesWithDetails = await Promise.all(
    userEnrollments.map(async ({ course }) => {
      const completion = await db.query.users_courses.findFirst({
        where: and(
          eq(users_courses.userId, user.id),
          eq(users_courses.courseId, course.id),
        ),
      });

      return {
        ...course,
        progress: completion?.completedAt ? 100 : 0,
        status: completion?.completedAt ? "Completed" : "In Progress",
        completedAt: completion?.completedAt || null,
      };
    }),
  );

  const createdCourses =
    user.role === "instructor"
      ? await db
          .select({
            id: courses.id,
            title: courses.title,
            createdAt: courses.createdAt,
          })
          .from(courses)
          .where(eq(courses.instructorId, user.id))
          .orderBy(desc(courses.createdAt))
      : [];

  const inProgressCourses = coursesWithDetails.filter((c) => !c.completedAt);
  const completedCoursesList = coursesWithDetails.filter((c) => c.completedAt);

  const atsScore = Math.min(
    100,
    skills.length * 10 +
      completedCoursesList.length * 15 +
      (postCount?.count || 0) * 2,
  );

  return {
    user,
    stats: {
      posts: postCount?.count || 0,
      comments: commentCount?.count || 0,
      courses: completedCoursesList.length,
      atsScore,
    },
    skills: skills,
    courses: {
      inProgress: inProgressCourses,
      completed: completedCoursesList,
      created: createdCourses,
    },
  };
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = (params.q as string) || "";
  const tab = (params.tab as string) || "in-progress";
  const page = params.page ? parseInt(params.page as string) : 1;
  const pageSize = 5;

  const data = await getProfileData(query);
  if (!data) {
    redirect("/register");
  }

  const { user, stats, skills, courses } = data;

  const inProgressPaginated = courses.inProgress.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const completedPaginated = courses.completed.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const currentListLength =
    tab === "in-progress"
      ? courses.inProgress.length
      : tab === "completed" || tab === "certificates"
        ? courses.completed.length
        : 0;

  const totalPages = Math.ceil(currentListLength / pageSize);

  const createPageUrl = (newPage: number) => {
    const newParams = new URLSearchParams();
    newParams.set("tab", tab);
    newParams.set("page", newPage.toString());
    if (query) newParams.set("q", query);
    return `/profile?${newParams.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
          <AvatarImage
            src={user.image || ""}
            alt={user.name || ""}
            className="object-cover"
          />
          <AvatarFallback className="text-4xl">
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.role || "Student"}</p>
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
            )}
          </div>
          <div className="flex gap-4 pt-2">
            <Link href="/profile/edit">
              <Button>Edit Profile</Button>
            </Link>
            <Button variant="outline">Share Profile</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.courses}</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.atsScore}</div>
              <div className="text-xs text-muted-foreground">ATS Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.posts}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.comments}</div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {user.role === "instructor" ? (
        <InstructorDashboard courses={courses.created} />
      ) : (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {skills.map((skill, i) => {
                    const progress =
                      skill.level === "expert"
                        ? 100
                        : skill.level === "intermediate"
                          ? 65
                          : 35;
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground capitalize text-xs">
                            {skill.level}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills added yet.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">My Courses</h2>
            <SearchCourses />
          </div>

          {/* Tabs Section */}
          <ProfileTabs defaultValue={tab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="in-progress">In-Progress Courses</TabsTrigger>
              <TabsTrigger value="completed">Completed Courses</TabsTrigger>
              <TabsTrigger value="certificates">My Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress" className="mt-6">
              <Card className="shadow-sm">
                <CardHeader className="p-6 border-b">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    In-Progress Courses
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
                      {inProgressPaginated.length ? (
                        inProgressPaginated.map((course, index) => (
                          <TableRow key={course.id || index}>
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
                                  Continue
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
                            No courses in progress.
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
              {courses.inProgress.length > pageSize && (
                <PaginationControl
                  currentPage={page}
                  totalPages={totalPages}
                  createPageUrl={createPageUrl}
                />
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <Card className="shadow-sm">
                <CardHeader className="p-6 border-b">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    Completed Courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-6 py-3">
                          Course Title
                        </TableHead>
                        <TableHead className="px-6 py-3">
                          Completion Date
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right">
                          Certificate
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedPaginated.length ? (
                        completedPaginated.map((course, index) => (
                          <TableRow key={course.id || index}>
                            <TableCell className="px-6 py-4 font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground">
                              {course.completedAt
                                ? new Date(
                                    course.completedAt,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/certificate/${course.id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                  >
                                    <Award className="h-4 w-4" />
                                    Certificate
                                  </Button>
                                </Link>
                                <Link
                                  href={`/courses/details/${course.id}/${course.slug}`}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-primary/80"
                                  >
                                    Review
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            No completed courses yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              {courses.completed.length > pageSize && (
                <PaginationControl
                  currentPage={page}
                  totalPages={totalPages}
                  createPageUrl={createPageUrl}
                />
              )}
            </TabsContent>

            <TabsContent value="certificates" className="mt-6">
              <h2 className="text-xl font-semibold tracking-tight">
                My Certificates
              </h2>
              {completedPaginated.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedPaginated.map((course, index) => (
                    <Card
                      key={course.id || index}
                      className="shadow-sm overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Award className="h-32 w-32" />
                      </div>
                      <CardContent className="p-6 flex flex-col gap-4 relative z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Completed on{" "}
                              {new Date(
                                course.completedAt!,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-primary/10 p-2 rounded-full shrink-0">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            className="w-full gap-2 group"
                          >
                            <Download className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                            Download Certificate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-sm border-dashed">
                  <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                    <Award className="h-12 w-12 opacity-20" />
                    <p>Complete courses to earn certificates.</p>
                  </CardContent>
                </Card>
              )}
              {courses.completed.length > pageSize && (
                <PaginationControl
                  currentPage={page}
                  totalPages={totalPages}
                  createPageUrl={createPageUrl}
                />
              )}
            </TabsContent>
          </ProfileTabs>
        </div>
      )}
    </div>
  );
}
