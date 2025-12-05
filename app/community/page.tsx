import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { posts as postsTable, users, categories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { NavLink } from "@/components/nav-link";

export default async function CommunityPage() {
  // Fetch users for contributors and post authors
  const allUsers = await db.select().from(users).limit(10);

  // Fetch categories for trending tags
  const allCategories = await db.select().from(categories);

  const postsData = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
      createdAt: postsTable.createdAt,
      authorId: postsTable.authorId,
      authorName: users.name,
      authorAvatar: users.avatar,
    })
    .from(postsTable)
    .leftJoin(users, eq(postsTable.authorId, users.id))
    .orderBy(desc(postsTable.createdAt));

  // Generate dynamic posts from courses and users
  const posts = postsData.map((post) => {
    let timeAgo = "N/A";
    if (post.createdAt) {
      try {
        const date = new Date(post.createdAt);
        if (!isNaN(date.getTime())) {
          timeAgo = formatDistanceToNow(date) + " ago";
        }
      } catch (error) {
        console.error("Invalid date:", post.createdAt);
      }
    }

    return {
      id: post.id,
      title: post.title,
      author: post.authorName || "Anonymous",
      authorAvatar: post.authorAvatar,
      authorInitials: (post.authorName || "Anonymous")
        .split(" ")
        .map((n) => n[0])
        .join(""),
      time: timeAgo,
      content: post.content,
      tags: ["AI", "Resume", "Career Advice"],
      likes: 12,
      comments: 5,
    };
  });

  // Generate trending tags from categories
  const trendingTags = allCategories.map((cat, index) => ({
    tag: `#${cat.slug}`,
    count: `${Math.max(50, 200 - index * 30)} posts`,
  }));

  // Get top contributors from users
  const topContributors = allUsers.slice(0, 3).map((user, index) => ({
    name: user.name,
    contributions: `${128 - index * 26} contributions`,
    img: user.avatar,
    fallback: user.name
      .split(" ")
      .map((n) => n[0])
      .join(""),
  }));

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Community Forum
                </h1>
                <p className="text-muted-foreground">
                  Ask questions, share knowledge, and connect with peers.
                </p>
              </div>
              <NavLink href="/community/create-post">
                <Button className="gap-2 shadow-sm transition-transform duration-200 ease-in-out hover:scale-105">
                  <PlusCircle className="h-4 w-4" />
                  Create Post
                </Button>
              </NavLink>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant="default"
                  className="rounded-full h-9 px-4 text-sm font-medium"
                >
                  All Posts
                </Button>
                {allCategories.slice(0, 4).map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className="rounded-full h-9 px-4 text-sm font-medium bg-card hover:bg-accent hover:text-accent-foreground"
                  >
                    {category.title}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                className="gap-2 h-9 px-3 text-sm font-medium bg-card"
              >
                <span>Sort by: Latest</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <CardContent className="p-4 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        {post.authorAvatar && (
                          <AvatarImage
                            src={post.authorAvatar}
                            alt={post.author}
                          />
                        )}
                        <AvatarFallback>{post.authorInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="text-lg font-semibold tracking-tight">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Posted by {post.author}, {post.time}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-indigo-100 text-primary dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-muted-foreground hover:text-primary group"
                        >
                          <ThumbsUp className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-muted-foreground hover:text-primary group"
                        >
                          <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span>{post.comments}</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground hover:text-primary group"
                      >
                        <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <aside className="col-span-12 hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 flex flex-col gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h4 className="mb-4 text-base font-semibold tracking-tight">
                  Trending Tags
                </h4>
                <div className="flex flex-col gap-3">
                  {trendingTags.map((item) => (
                    <Link
                      key={item.tag}
                      className="flex justify-between text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      href="#"
                    >
                      <span>{item.tag}</span>
                      <span>{item.count}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            {topContributors.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <h4 className="mb-4 text-base font-semibold tracking-tight">
                    Top Contributors
                  </h4>
                  <div className="flex flex-col gap-4">
                    {topContributors.map((contributor) => (
                      <div
                        key={contributor.name}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-10 w-10">
                          {contributor.img && (
                            <AvatarImage
                              src={contributor.img}
                              alt={contributor.name}
                            />
                          )}
                          <AvatarFallback>
                            {contributor.fallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold tracking-tight">
                            {contributor.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {contributor.contributions}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
