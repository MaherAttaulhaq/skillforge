import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, courses, users_courses } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  Video,
  ClipboardList,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/register");

  const currentUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!currentUser || currentUser.role !== "instructor") {
    redirect("/profile");
  }

  // Fetch Instructor's Courses
  const instructorCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      createdAt: courses.createdAt,
      // price: courses.price, // Uncomment if price exists in schema
    })
    .from(courses)
    .where(eq(courses.authorId, currentUser.id))
    .orderBy(desc(courses.createdAt));

  // Calculate Total Students (Enrollments in instructor's courses)
  const enrollments = await db
    .select({ count: sql<number>`count(*)` })
    .from(users_courses)
    .innerJoin(courses, eq(users_courses.courseId, courses.id))
    .where(eq(courses.authorId, currentUser.id));

  const totalStudents = enrollments[0]?.count || 0;
  const totalCourses = instructorCourses.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses, content, and students.</p>
        </div>
        <Link href="/instructor/create-course">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Student feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="courses" className="py-2">Courses</TabsTrigger>
          <TabsTrigger value="content" className="py-2">Content</TabsTrigger>
          <TabsTrigger value="quizzes" className="py-2">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments" className="py-2">Assignments</TabsTrigger>
          <TabsTrigger value="analytics" className="py-2">Analytics</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Manage your existing courses and create new ones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructorCourses.length > 0 ? (
                    instructorCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Published</Badge>
                        </TableCell>
                        <TableCell>{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/instructor/course/${course.id}/builder`} className="flex w-full">
                                  Course Builder
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No courses found. Create your first course!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Manage videos, documents, and other resources.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Video className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a course to manage its specific content.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Manager</CardTitle>
              <CardDescription>Create and manage quizzes for your courses.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
              <p>No quizzes created yet.</p>
              <Button variant="outline" className="mt-4">Create Quiz</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Review and grade student submissions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-20" />
              <p>No pending assignments to review.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Analytics</CardTitle>
              <CardDescription>Detailed insights into student performance.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mb-4 opacity-20" />
              <p>Analytics dashboard coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}