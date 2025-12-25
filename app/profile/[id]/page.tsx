import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db";
import { users, posts as postsTable, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProfilePageProps = {
  params: {
    id: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const userId = await parseInt(id, 10);

  if (isNaN(userId)) {
    return <div>Invalid user ID</div>;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const userPosts = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
      createdAt: postsTable.createdAt,
      category: categories.title,
    })
    .from(postsTable)
    .leftJoin(categories, eq(postsTable.categoryId, categories.id))
    .where(eq(postsTable.authorId, userId))
    .orderBy(desc(postsTable.createdAt));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/community">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">User Profile</h1>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold">{user.name}</h2>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Posts by {user.name}</h3>
        <div className="flex flex-col gap-4">
          {userPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold">{post.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {post.createdAt
                    ? formatDistanceToNow(new Date(post.createdAt)) + " ago"
                    : "N/A"}{" "}
                  in <Badge variant="secondary">{post.category}</Badge>
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
