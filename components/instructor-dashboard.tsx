import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Globe,
  Twitter,
  Github,
  Star,
  Users,
  Video,
  MessageSquare,
  Clock,
  User,
  Edit,
} from "lucide-react";
import { NavLink } from "@/components/nav-link";
import { db } from "@/db";
import { courses, reviews, enrollments, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { PaginationControl } from "@/components/PaginationControl";

export default async function InstructorProfilePage({ user, searchParams }: { user?: any, searchParams?: any }) {
  const coursesData = await db.select().from(courses).where(eq(courses.instructorId, user.id));
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

  const allReviews = instructorCourses.flatMap((c: any) =>
    (c.reviews || []).map((r: any) => ({ ...r, courseTitle: c.title }))
  );
  const totalCourses = instructorCourses.length;
  const totalReviews = allReviews.length;
  const totalStudents = instructorCourses.reduce(
    (acc: number, c: any) => acc + (c.enrollments?.length || 0),
    0
  );
  const averageRating =
    totalReviews > 0
      ? (
          allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "0.0";

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const pageSize = 2;
  const showAllReviews = searchParams?.view === 'reviews';
  const displayedReviews = showAllReviews 
    ? allReviews.slice((page - 1) * pageSize, page * pageSize)
    : allReviews.slice(0, 5);
  const totalPages = Math.ceil(totalReviews / pageSize);
  const createPageUrl = (newPage: number) => `/profile?view=reviews&page=${newPage}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Instructor Profile
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your public presence and view your impact.
          </p>
        </div>
        <NavLink href="/profile/edit">
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </NavLink>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Profile Info */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                    <AvatarImage
                      src={user?.image || undefined}
                      alt={user?.name || "Instructor"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">
                      {user?.name || "Instructor Name"}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {user?.email || "Instructor"}
                    </p>
                    <p className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4" /> 
                        {user?.location || "Location not specified"}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-center gap-4">
                    <NavLink
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </NavLink>
                    <NavLink
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </NavLink>
                    <NavLink
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </NavLink>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {user?.bio || "This instructor has not added a bio yet."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Teaching Impact
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {/* Stats Card 1 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Course Rating
                      </p>
                      <Star className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-3xl font-bold">
                        {averageRating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / 5.0
                      </span>
                    </div>
                    <Progress value={98} className="mt-4 h-1.5" />
                  </CardContent>
                </Card>

                {/* Stats Card 2 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col p-6 h-full">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Students
                      </p>
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">{totalStudents}</p>
                    <p className="mt-auto text-xs text-muted-foreground">
                      {totalStudents > 1000 ? "Popular Instructor" : "Keep Growing"}
                    </p>
                  </CardContent>
                </Card>

                {/* Stats Card 3 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col p-6 h-full">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Courses Taught
                      </p>
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">{totalCourses}</p>
                    <p className="mt-auto text-xs text-muted-foreground">
                      {totalCourses > 5 ? "Experienced Instructor" : "New Instructor"}
                    </p>
                  </CardContent>
                </Card>

                {/* Stats Card 4 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col p-6 h-full">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Review Count
                      </p>
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">{totalReviews}</p>
                    <p className="mt-auto text-xs text-muted-foreground">
                        {totalReviews > 50 ? "Well Reviewed" : "More Reviews Needed"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Courses Taught */}
            <Card>
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-semibold">Courses Taught</h3>
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                >
                  View All Courses
                </Button>
              </div>
              <div className="grid grid-cols-1 divide-y border-b md:grid-cols-2 md:divide-x md:divide-y-0">
                {instructorCourses.map((course: any) => (
                  <div
                    key={course.id}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="mb-4 flex justify-between items-start">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {course.level || "Course"}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="text-sm font-bold">
                          {course.reviews?.length > 0
                            ? (
                                course.reviews.reduce(
                                  (a: any, b: any) => a + b.rating,
                                  0
                                ) / course.reviews.length
                              ).toFixed(1)
                            : "N/A"}
                        </span>
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          ({course.reviews?.length || 0})
                        </span>
                      </div>
                    </div>
                    <h4 className="mb-2 text-lg font-bold line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration || "10h"}</span>
                        <span className="mx-1">•</span>
                        <User className="h-4 w-4" />
                        <span>{course.enrollments?.length || 0} students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader className="border-b p-6">
                <CardTitle className="text-lg font-semibold">
                  {showAllReviews ? "All Reviews" : "Recent Reviews"}
                </CardTitle>
              </CardHeader>
              <div className="divide-y">
                {displayedReviews.map((review: any, i: number) => (
                  <div key={i} className="flex flex-col gap-3 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900">
                          <AvatarImage src={review.user?.image} />
                          <AvatarFallback className="bg-indigo-100 text-primary dark:bg-indigo-900 dark:text-white">
                            {review.user?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {review.user?.name || "Student"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.courseTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? "fill-current"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
              {showAllReviews ? (
                <div className="p-4">
                  <PaginationControl currentPage={page} totalPages={totalPages} createPageUrl={createPageUrl} />
                </div>
              ) : (
                <div className="border-t p-4 text-center">
                  <NavLink href="/profile?view=reviews">
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary/80"
                    >
                      View all {totalReviews} reviews
                    </Button>
                  </NavLink>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
