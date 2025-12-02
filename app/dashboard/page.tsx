import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ArrowUpRight } from "lucide-react";
import { db } from "@/db";
import {
  courses as coursesTable,
  categories,
  users,
  jobs as jobsTable,
  userSkills,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  // Fetch user data (using first user for demo - in real app, use session)
  const currentUser = await db
    .select()
    .from(users)
    .where(eq(users.role, "student"))
    .limit(1)
    .get();

  // Fetch user skills
  const skills = currentUser
    ? await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, currentUser.id))
    : [];

  // Fetch recommended courses (top 3 by creation date)
  const recommendedCourses = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      slug: coursesTable.slug,
      description: coursesTable.description,
      categoryTitle: categories.title,
    })
    .from(coursesTable)
    .leftJoin(categories, eq(coursesTable.categoryId, categories.id))
    .orderBy(desc(coursesTable.createdAt))
    .limit(3);

  // Fetch recommended jobs (top 3 by match score)
  const recommendedJobs = await db
    .select()
    .from(jobsTable)
    .orderBy(desc(jobsTable.match))
    .limit(3);

  // Calculate average job match from all jobs
  const allJobs = await db.select().from(jobsTable);
  const avgJobMatch =
    allJobs.length > 0
      ? Math.round(
        allJobs.reduce((acc, job) => acc + (job.match || 0), 0) /
        allJobs.length
      )
      : 0;

  // Get top skill gap (skill with lowest level)
  const topSkillGap =
    skills.length > 0
      ? skills.find((s) => s.level === "beginner")?.skill || skills[0]?.skill
      : "No skills tracked";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <p className="text-3xl sm:text-4xl font-black leading-tight tracking-tight min-w-72">
            Welcome back, {currentUser?.name || "User"}!
          </p>
          <div className="flex gap-3 flex-wrap justify-start">
            <Button className="gap-2 shadow-sm">
              <Upload className="h-5 w-5" />
              Upload New Resume
            </Button>
            <Button
              variant="outline"
              className="gap-2 shadow-sm bg-card hover:bg-accent"
            >
              <FileText className="h-5 w-5" />
              Analyze Job Description
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-md transition-shadow hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col gap-2">
                  <p className="text-base font-medium text-muted-foreground">
                    ATS Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-primary text-4xl font-bold leading-tight">
                      {skills.length > 0 ? 75 + skills.length * 5 : 70}
                    </p>
                    <p className="text-muted-foreground text-lg font-medium">
                      / 100
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md transition-shadow hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col gap-2">
                  <p className="text-base font-medium text-muted-foreground">
                    Average Job Match
                  </p>
                  <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden mt-4">
                    <div
                      className="absolute h-full bg-accent rounded-full"
                      style={{ width: `${avgJobMatch}%` }}
                    ></div>
                  </div>
                  <p className="text-teal-500 text-4xl font-bold leading-tight mt-2 self-end">
                    {avgJobMatch}%
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-md transition-shadow hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col gap-2">
                  <p className="text-base font-medium text-muted-foreground">
                    Top Skill Gap
                  </p>
                  <span className="inline-block mt-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold px-3 py-1.5 rounded-full text-lg">
                    {topSkillGap}
                  </span>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">
                Recommended Courses
              </h3>
              {recommendedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recommendedCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="flex flex-col shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <CardContent className="p-6 flex flex-col gap-4 h-full">
                        <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                          {course.categoryTitle || "GENERAL"}
                        </span>
                        <h4 className="text-lg font-bold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground flex-grow">
                          {course.description || "No description available"}
                        </p>
                        <Link
                          href={`/courses/details/${course.id}/${course.slug}`}
                        >
                          <Button
                            variant="link"
                            className="p-0 h-auto font-bold text-primary self-start"
                          >
                            View Course
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No courses available yet
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-md">
                <CardContent className="p-6 flex flex-col gap-2">
                  <p className="text-base font-medium">Skill Analysis</p>
                  <p className="text-3xl font-bold leading-tight truncate">
                    Overall Score:{" "}
                    {skills.length > 0 ? 70 + skills.length * 6 : 65}%
                  </p>
                  <div className="flex gap-1">
                    <p className="text-sm font-normal text-muted-foreground">
                      This Month
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                      +{skills.length > 0 ? 5 + skills.length : 3}.2%
                    </p>
                  </div>
                  <div className="grid min-h-[180px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-2 pt-4">
                    {skills.length > 0 ? (
                      <>
                        {skills.slice(0, 4).map((skill, index) => {
                          const height =
                            skill.level === "expert"
                              ? 85
                              : skill.level === "intermediate"
                                ? 60
                                : 40;
                          return (
                            <>
                              <div
                                key={`bar-${skill.id}`}
                                className={`${index % 2 === 0 ? "bg-primary" : "bg-accent"
                                  } rounded-t w-full transition-all duration-300 hover:opacity-80`}
                                style={{ height: `${height}%` }}
                              ></div>
                              <p
                                key={`label-${skill.id}`}
                                className="text-xs font-bold text-muted-foreground truncate max-w-[60px]"
                              >
                                {skill.skill}
                              </p>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <div
                          className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80"
                          style={{ height: "50%" }}
                        ></div>
                        <p className="text-xs font-bold text-muted-foreground">
                          No Data
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
          <div className="col-span-12">
            <h3 className="text-2xl font-bold tracking-tight mb-4">
              Recommended Jobs
            </h3>
            {recommendedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="flex flex-col shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        {job.match && job.match >= 90 && (
                          <Badge
                            variant="secondary"
                            className="bg-accent text-teal-900 hover:bg-accent/80"
                          >
                            Top Match
                          </Badge>
                        )}
                      </div>
                      <div className="text-center bg-primary/10 text-primary font-bold p-2 rounded-lg">
                        Match Score: {job.match || 0}%
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <Button
                          className={
                            job.match && job.match >= 90
                              ? "w-full"
                              : "w-full bg-card text-foreground border hover:bg-accent"
                          }
                        >
                          {job.match && job.match >= 90
                            ? "Apply Now"
                            : "View Job"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No jobs available yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}