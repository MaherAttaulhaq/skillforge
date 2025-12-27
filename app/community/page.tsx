import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import {
  posts as postsTable,
  tags,
  posts_tags,
  users,
  categories,
  comments,
  likes,
  shares,
} from "@/db/schema";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { NavLink } from "@/components/nav-link";
import { PostFilters } from "@/components/PostFilters";
import { PostInteractions } from "./PostInteractions"
type CommunityPageProps = {
  searchParams: {
    category?: string;
    sort?: "latest" | "popular" | "most-voted";
    tag?: string;
  };
};

export default async function CommunityPage({
  searchParams,
}: CommunityPageProps) {
  const { category, sort = "latest", tag } = await searchParams;
  const currentUserId = 1; // Hardcoded user ID

  const allCategories = await db.select().from(categories);

  const postsQuery = db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
      createdAt: postsTable.createdAt,
      authorId: postsTable.authorId,
      mediaUrl: postsTable.mediaUrl,
      authorName: users.name,
      authorAvatar: users.avatar,
      categorySlug: categories.slug,
      categoryTitle: categories.title,
      commentCount: sql<number>`count(distinct ${comments.id})`.mapWith(Number),
      likeCount: sql<number>`count(distinct ${likes.userId})`.mapWith(Number),
      shareCount: sql<number>`count(distinct ${shares.id})`.mapWith(Number),
      isLiked: sql<number>`max(case when ${likes.userId} = ${currentUserId} then 1 else 0 end)`.mapWith(Boolean),
    })
    .from(postsTable)
    .leftJoin(users, eq(postsTable.authorId, users.id))
    .leftJoin(categories, eq(postsTable.categoryId, categories.id))
    .leftJoin(comments, eq(postsTable.id, comments.postId))
    .leftJoin(likes, eq(postsTable.id, likes.postId))
    .leftJoin(shares, eq(postsTable.id, shares.postId));

  if (tag) {
    postsQuery
      .innerJoin(posts_tags, eq(postsTable.id, posts_tags.postId))
      .innerJoin(tags, eq(posts_tags.tagId, tags.id));
  }

  const conditions = [];
  if (category && category !== "all") {
    conditions.push(eq(categories.slug, category));
  }
  if (tag) {
    conditions.push(eq(tags.name, tag));
  }

  if (conditions.length > 0) {
    postsQuery.where(and(...conditions));
  }

  postsQuery.groupBy(
    postsTable.id,
    users.name,
    users.avatar,
    categories.slug,
    categories.title
  );

  if (sort === "popular" || sort === "most-voted") {
    postsQuery.orderBy(desc(sql<number>`count(distinct ${comments.id})`));
  } else {
    postsQuery.orderBy(asc(postsTable.createdAt));
  }

  const postsData = await postsQuery;
  const postIds = postsData.map((p) => p.id);

  let allTagsForPosts: { postId: number; tag: string }[] = [];
  if (postIds.length > 0) {
    const tagsData = await db
      .select({
        postId: posts_tags.postId,
        tag: tags.name,
      })
      .from(posts_tags)
      .innerJoin(tags, eq(posts_tags.tagId, tags.id))
      .where(inArray(posts_tags.postId, postIds));
    allTagsForPosts = tagsData;
  }

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

    const postTags = allTagsForPosts
      .filter((t) => t.postId === post.id)
      .map((t) => t.tag);

    return {
      id: post.id,
      title: post.title,
      authorId: post.authorId,
      author: post.authorName || "Anonymous",
      authorAvatar: post.authorAvatar,
      authorInitials: (post.authorName || "Anonymous")
        .split(" ")
        .map((n) => n[0])
        .join(""),
      time: timeAgo,
      content: post.content,
      mediaUrl: post.mediaUrl,
      tags: postTags,
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      shares: post.shareCount || 0,
      isLiked: post.isLiked,
    };
  });

  const trendingTagsResult = await db
    .select({
      tag: tags.name,
      count: sql<number>`count(${posts_tags.postId})`.mapWith(Number),
    })
    .from(tags)
    .innerJoin(posts_tags, eq(tags.id, posts_tags.tagId))
    .groupBy(tags.name)
    .orderBy(desc(sql<number>`count(${posts_tags.postId})`))
    .limit(10);

  const trendingTags = trendingTagsResult.map((item) => ({
    tag: `#${item.tag}`,
    count: `${item.count} posts`,
  }));

  const topContributorsData = await db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      contributions: sql<number>`count(${postsTable.id})`.mapWith(Number),
    })
    .from(postsTable)
    .innerJoin(users, eq(postsTable.authorId, users.id))
    .groupBy(users.id, users.name, users.avatar)
    .orderBy(desc(sql<number>`count(${postsTable.id})`))
    .limit(5);

  const topContributors = topContributorsData.map((contributor) => ({
    id: contributor.id,
    name: contributor.name,
    contributions: `${contributor.contributions} contributions`,
    img: contributor.avatar,
    fallback: contributor.name
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

            <PostFilters categories={allCategories} />

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
                          Posted by{" "}
                          <Link
                            href={`/profile/${post.authorId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {post.author}
                          </Link>
                          , {post.time}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                        {post.mediaUrl && (
                          <div className="mt-3">
                            {post.mediaUrl.endsWith(".mp4") ||
                              post.mediaUrl.endsWith(".webm") ? (
                              <video
                                src={post.mediaUrl}
                                controls
                                className="w-full rounded-lg"
                              />
                            ) : (
                              <img
                                src={post.mediaUrl}
                                alt={post.title}
                                className="w-full rounded-lg"
                              />
                            )}
                          </div>
                        )}
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
                    <PostInteractions
                      postId={post.id}
                      initialLikes={post.likes}
                      initialComments={post.comments}
                      initialShares={post.shares}
                      isLiked={post.isLiked}
                    />
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
                      href={`/community?tag=${item.tag.substring(1)}`}
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
                      <Link
                        key={contributor.id}
                        href={`/profile/${contributor.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
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
                      </Link>
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
