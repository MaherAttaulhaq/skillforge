import { db } from "@/db";
import { jobs as jobsTable } from "@/db/schema";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { PaginationControl } from "@/components/PaginationControl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { Metadata } from "next";
import { JobFilters } from "@/components/JobFilters";

export const metadata: Metadata = {
  title: "SkillForge - Jobs",
  description: "Find your dream job",
};

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
    page?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { q, location, type, page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const conditions = [];
  if (q) {
    conditions.push(
      or(like(jobsTable.title, `%${q}%`), like(jobsTable.description, `%${q}%`))
    );
  }
  if (location) {
    conditions.push(like(jobsTable.location, `%${location}%`));
  }
  if (type) {
    conditions.push(eq(jobsTable.type, type));
  }

  const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

  const jobsQuery = db
    .select()
    .from(jobsTable)
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(jobsTable.createdAt));

  const countQuery = db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(jobsTable);

  if (whereCondition) {
    jobsQuery.where(whereCondition);
    countQuery.where(whereCondition);
  }

  const [data, [totalResult], titlesResult] = await Promise.all([
    jobsQuery,
    countQuery,
    db.select({ title: jobsTable.title }).from(jobsTable).groupBy(jobsTable.title),
  ]);

  const totalJobs = totalResult?.count || 0;
  const totalPages = Math.ceil(totalJobs / pageSize);
  const titles = titlesResult.map((t) => t.title);

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    params.set("page", newPage.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Find your next career opportunity.
          </p>
        </div>

        <JobFilters titles={titles} />

        {data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-semibold">No jobs found</p>
            <p>Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button asChild>
                        <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          createPageUrl={createPageUrl}
        />
      </div>
    </div>
  );
}