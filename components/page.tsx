import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import InstructorProfilePage from "@/components/instructor-dashboard";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function InstructorPage() {
  // 1. Fetch the data from the database
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return redirect("/login");

  const instructorData = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      instructorProfile: true,
      courses: {
        limit: 4,
        orderBy: (courses, { desc }) => [desc(courses.createdAt)],
        with: {
          reviews: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!instructorData || !instructorData.instructorProfile) {
    // Handle case where profile doesn't exist
    return <div className="p-8">Instructor profile not found.</div>;
  }

  // The instructor-dashboard component expects a user object with profile properties flattened.
  const userForDashboard = {
    ...instructorData,
    ...instructorData.instructorProfile,
  };

  // 3. Pass the prepared data to the presentation component
  return (
    <InstructorProfilePage
      user={userForDashboard}
      instructorCourses={instructorData.courses}
    />
  );
}
