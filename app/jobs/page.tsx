import { db } from "@/db";
import { jobs as jobsTable } from "@/db/schema";
import { like, or, and, SQL } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Link from "next/link";
import JobFilters from "@/components/JobFilters";

interface SearchParams {
  search?: string;
  roles?: string;
  experience?: string;
  location?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { search, roles, experience, location } = params;

  // Build database query with filters
  const conditions: SQL[] = [];

  // Search filter
  if (search) {
    conditions.push(
      or(
        like(jobsTable.title, `%${search}%`),
        like(jobsTable.company, `%${search}%`),
        like(jobsTable.tags, `%${search}%`)
      )!
    );
  }

  // Role filter
  if (roles) {
    const roleArray = roles.split(",");
    const roleConditions = roleArray.map((role) =>
      or(
        like(jobsTable.title, `%${role}%`),
        like(jobsTable.tags, `%${role}%`)
      )
    );
    conditions.push(or(...roleConditions)!);
  }

  // Experience filter
  if (experience) {
    const expArray = experience.split(",");
    const expConditions = expArray.map((level) =>
      like(jobsTable.tags, `%${level}%`)
    );
    conditions.push(or(...expConditions)!);
  }

  // Location filter
  if (location) {
    const locArray = location.split(",");
    const locConditions = locArray.map((loc) =>
      like(jobsTable.location, `%${loc}%`)
    );
    conditions.push(or(...locConditions)!);
  }

  // Execute query with filters
  const jobs =
    conditions.length > 0
      ? await db.select().from(jobsTable).where(and(...conditions))
      : await db.select().from(jobsTable);

  const hasFilters = search || roles || experience || location;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4 lg:max-w-xs shrink-0">
          <div className="sticky top-28">
            <JobFilters />
          </div>
        </aside>
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black tracking-tight">
                Recommended Jobs
              </h1>
              <p className="text-base text-muted-foreground">
                Based on your profile, here are jobs that match your skills.
                {hasFilters && (
                  <span className="ml-1 font-medium text-primary">
                    ({jobs.length} jobs found)
                  </span>
                )}
              </p>
            </div>
            {jobs.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="p-12 flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1">No jobs found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                  <Link href="/jobs">
                    <Button variant="outline">Clear All Filters</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="flex flex-col shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                  >
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="h-12 w-12 rounded-lg bg-center bg-no-repeat bg-cover p-1 border"
                            style={{ backgroundImage: `url('${job.logo}')` }}
                          ></div>
                          <div>
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {job.company} • {job.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-accent">
                            {job.match}%
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            Match
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.split(",").map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t mt-auto">
                        <p className="text-sm text-muted-foreground">
                          Posted {job.posted}
                        </p>
                        <Link href={`/jobs/${job.id}`}>
                          <Button className="h-9 px-4 font-bold">
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
