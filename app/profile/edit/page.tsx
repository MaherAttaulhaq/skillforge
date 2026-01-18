import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.email) return redirect("/api/auth/signin");

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return redirect("/api/auth/signin");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
