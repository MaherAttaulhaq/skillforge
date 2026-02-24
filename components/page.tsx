import { db } from "@/db";
import InstructorProfilePage from "@/components/instructor-dashboard";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { courses, enrollments, instructors, reviews, users } from "@/db/schema";
import { desc, eq, inArray, sql } from "drizzle-orm";

export default async function InstructorPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return redirect("/login");

  const instructorData = await db
    .select({
      user: users,
      instructorProfile: instructors,
    })
    .from(users)
    .leftJoin(instructors, eq(instructors.userId, users.id))
    .where(eq(users.id, userId))
    .get();

  if (!instructorData || !instructorData.instructorProfile) {
    return <div className="p-8">Instructor profile not found.</div>;
  }

  const instructorCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.instructorId, userId))
    .orderBy(desc(courses.createdAt))
    .limit(4);

  const courseIds = instructorCourses.map((course) => course.id);

  const courseReviews =
    courseIds.length > 0
      ? await db
          .select({
            review: reviews,
            reviewerName: users.name,
            reviewerImage: users.image,
          })
          .from(reviews)
          .leftJoin(users, eq(reviews.userId, users.id))
          .where(inArray(reviews.courseId, courseIds))
      : [];

  const enrollmentCounts =
    courseIds.length > 0
      ? await db
          .select({
            courseId: enrollments.courseId,
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(enrollments)
          .where(inArray(enrollments.courseId, courseIds))
          .groupBy(enrollments.courseId)
      : [];

  const reviewsByCourseId = new Map<number>();
  for (const row of courseReviews) {
    const current = reviewsByCourseId.get(row.review.courseId) ?? [];
    current.push({
      ...row.review,
      user: {
        name: row.reviewerName,
        image: row.reviewerImage,
      },
    });
    reviewsByCourseId.set(row.review.courseId, current);
  }

  const enrollmentCountByCourseId = new Map<number, number>(
    enrollmentCounts.map((entry) => [entry.courseId, entry.count]),
  );

  const coursesForDashboard = instructorCourses.map((course) => ({
    ...course,
    reviews: reviewsByCourseId.get(course.id) ?? [],
    enrollments: Array.from({
      length: enrollmentCountByCourseId.get(course.id) ?? 0,
    }),
  }));

  const userForDashboard = {
    ...instructorData.user,
    ...instructorData.instructorProfile,
  };

  return (
    <InstructorProfilePage
      user={userForDashboard}
      instructorCourses={coursesForDashboard}
    />
  );
}
