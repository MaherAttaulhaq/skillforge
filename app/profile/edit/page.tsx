import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./ProfileForm";

export default async function ProfileEditPage() {
  const userId = 1; // Hardcoded user ID
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Edit Profile
        </h1>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
