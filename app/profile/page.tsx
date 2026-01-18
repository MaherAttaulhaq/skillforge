import { auth } from "@/auth";
import { db } from "@/db";
import { users, users_courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CertificateView } from "./CertificateView";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) return redirect("/api/auth/signin");

  const { courseId } = await params;
  const id = parseInt(courseId);
  if (isNaN(id)) return redirect("/profile");

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return redirect("/api/auth/signin");

  const completion = await db.query.users_courses.findFirst({
    where: and(
      eq(users_courses.userId, user.id),
      eq(users_courses.courseId, id),
    ),
    with: {
      course: true,
    },
  });

  if (!completion || !completion.completedAt) {
    return redirect("/profile");
  }

  return (
    <CertificateView
      studentName={user.name}
      courseTitle={completion.course.title}
      completionDate={completion.completedAt}
    />
  );
}
