import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, courses, users_courses, userSkills, posts, comments } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Download } from "lucide-react";
import Link from "next/link";
import  InstructorProfilePage  from "@/components/instructor-dashboard";

async function getProfileData() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return null;

  // Fetch stats
  const [postCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.authorId, user.id));

  const [commentCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(comments)
    .where(eq(comments.authorId, user.id));

  // Fetch skills
  const skills = await db
    .select({ name: userSkills.skill, level: userSkills.level })
    .from(userSkills)
    .where(eq(userSkills.userId, user.id));

  // Fetch courses
  const allUserCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      completedAt: users_courses.completedAt,
    })
    .from(courses)
    .innerJoin(users_courses, eq(courses.id, users_courses.courseId))
    .where(eq(users_courses.userId, user.id))
    .orderBy(desc(users_courses.completedAt));

  const createdCourses = user.role === "instructor" ? await db
    .select({
      id: courses.id,
      title: courses.title,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .where(eq(courses.instructorId, user.id))
    .orderBy(desc(courses.createdAt)) : [];

  const inProgressCourses = allUserCourses.filter((c) => !c.completedAt);
  const completedCoursesList = allUserCourses.filter((c) => c.completedAt);

  const atsScore = Math.min(
    100,
    skills.length * 10 + completedCoursesList.length * 15 + (postCount?.count || 0) * 2
  );

  return {
    user,
    stats: {
      posts: postCount?.count || 0,
      comments: commentCount?.count || 0,
      courses: completedCoursesList.length,
      atsScore,
    },
    skills: skills.map((s) => s.name),
    courses: {
      inProgress: inProgressCourses,
      completed: completedCoursesList,
      created: createdCourses,
    },
  };
}

export default async function ProfilePage() {
  const data = await getProfileData();

  if (!data) {
    redirect("/register");
  }

  const { user, stats, skills, courses } = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
          <AvatarImage src={user.image || ""} alt={user.name || ""} />
          <AvatarFallback className="text-4xl">{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.role || "Student"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Badge key={i} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4 pt-2">
            <Button>Edit Profile</Button>
            <Button variant="outline">Share Profile</Button>
          </div>
        </div>

        {/* {/* Stats Cards
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
        <InstructorProfilePage courses={courses.created} />
      ) : (
        <>
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold tracking-tight">My Courses</h2>

            <div className="flex flex-col gap-6">
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
                        <TableHead className="px-6 py-3">Course Title</TableHead>
                        <TableHead className="px-6 py-3">Status</TableHead>
                        <TableHead className="px-6 py-3 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses?.inProgress?.length ? (
                        courses.inProgress.map((course, index) => (
                          <TableRow key={course.id || index}>
                            <TableCell className="px-6 py-4 font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground">
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200">
                                In Progress
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <Link href={`/courses/${course.id}`}>
                                <Button variant="link" className="text-primary font-medium p-0 h-auto">
                                  Continue
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                            No courses in progress.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

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
                      {courses?.completed?.length ? (
                        courses.completed.map((course, index) => (
                          <TableRow key={course.id || index}>
                            <TableCell className="px-6 py-4 font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-muted-foreground">
                              {course.completedAt
                                ? new Date(course.completedAt).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <Button
                                variant="link"
                                className="text-primary font-medium p-0 h-auto"
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                            No completed courses yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-6">
            <h2 className="text-xl font-semibold tracking-tight">My Certificates</h2>
            {courses?.completed?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.completed.map((course, index) => (
                  <Card key={course.id || index} className="shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Award className="h-32 w-32" />
                    </div>
                    <CardContent className="p-6 flex flex-col gap-4 relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Completed on {new Date(course.completedAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full shrink-0">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" className="w-full gap-2 group">
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
          </div>
        </>
      )}
    </div>
  );
} */}
)