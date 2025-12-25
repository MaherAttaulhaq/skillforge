import { CreatePostForm } from "../CreatePostForm";
import { db } from "@/db";
import { categories } from "@/db/schema";

export default async function CreatePostPage() {
  const allCategories = await db.select().from(categories);

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <CreatePostForm categories={allCategories} />
    </div>
  );
}
