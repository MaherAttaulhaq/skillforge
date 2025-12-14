import { db } from "@/db";
import {
  courses as coursesTable,
  categories as categoriesTable,
} from "@/db/schema";
import { like, or, and, SQL, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Signal, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import CourseFilters from "@/components/CourseFilters";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkillForge - Courses",
  description: "Unlock Your Career Potential with AI",
  keywords: [
    "SkillForge",
    "Courses",
    "AI",
    "Resume",
    "Cover Letter",
    "LinkedIn",
    "Career",
    "Job Search",
    "Interview Preparation",
    "Skill Development",
    "Career Advice",
  ],
  openGraph: {
    title: "SkillForge - Courses",
    description: "Unlock Your Career Potential with AI",
    siteName: "SkillForge",
    type: "website",
    locale: "en_US",
    url: "https://skillforge.ai",
    images: [
      {
        url: "images/images.png",
        alt: "SkillForge - Courses",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillForge - Courses",
    description: "Unlock Your Career Potential with AI",
    images: ["images/images.png"],
    creator: "@skillforgeai",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      // noimages: true,
      noarchive: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};
interface SearchParams {
  search?: string;
  categories?: string;
  level?: string;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { search, categories, level } = params;

  // Build database query with filters
  const conditions: SQL[] = [];

  // Search filter
  if (search) {
    conditions.push(
      or(
        like(coursesTable.title, `%${search}%`),
        like(coursesTable.description, `%${search}%`)
      )!
    );
  }

  // Category filter - join with categories table
  if (categories) {
    const catArray = categories.split(",");
    // Get category IDs for selected categories
    const selectedCats = await db
      .select()
      .from(categoriesTable)
      .where(
        or(...catArray.map((cat) => like(categoriesTable.title, `%${cat}%`)))!
      );

    if (selectedCats.length > 0) {
      const catIds = selectedCats.map((cat) => cat.id);
      conditions.push(
        or(...catIds.map((id) => eq(coursesTable.categoryId, id)))!
      );
    }
  }

  // Level filter
  if (level && level !== "all") {
    conditions.push(eq(coursesTable.level, level));
  }

  // Execute query with filters
  const courses =
    conditions.length > 0
      ? await db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          slug: coursesTable.slug,
          description: coursesTable.description,
          thumbnail: coursesTable.thumbnail,
          level: coursesTable.level,
          price: coursesTable.price,
          categoryId: coursesTable.categoryId,
          category: categoriesTable.title,
        })
        .from(coursesTable)
        .leftJoin(
          categoriesTable,
          eq(coursesTable.categoryId, categoriesTable.id)
        )
        .where(and(...conditions))
      : await db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
          slug: coursesTable.slug,
          description: coursesTable.description,
          thumbnail: coursesTable.thumbnail,
          level: coursesTable.level,
          price: coursesTable.price,
          categoryId: coursesTable.categoryId,
          category: categoriesTable.title,
        })
        .from(coursesTable)
        .leftJoin(
          categoriesTable,
          eq(coursesTable.categoryId, categoriesTable.id)
        );

  const hasFilters = search || categories || level;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
          <div className="sticky top-28">
            <CourseFilters />
          </div>
        </aside>
        <div className="flex-1">
          <div className="mb-8 space-y-2">
            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
              Explore Courses
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover your next skill. Browse our extensive catalog of courses
              designed to propel your career forward.
              {hasFilters && (
                <span className="ml-1 font-medium text-primary">
                  ({courses.length} courses found)
                </span>
              )}
            </p>
          </div>

          {courses.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-12 flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-1">No courses found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
                <Link href="/courses">
                  <Button variant="outline">Clear All Filters</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="group flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-muted">
                    {course.thumbnail && (
                      <div
                        className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `url("${course.thumbnail}")`,
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold flex-grow mb-2 leading-tight">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Signal className="h-4 w-4" />
                        <span className="capitalize">{course.level}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      {course.price && course.price > 0 ? (
                        <span className="text-lg font-bold text-primary">
                          ${course.price}
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          Free
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/courses/details/${course.id}/${course.slug}`}
                      className="w-full"
                    >
                      <Button className="w-full font-semibold">
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
