import { auth } from "@/auth";
import { db } from "@/db";
import { applications, jobs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, MapPin, Building2, ArrowRight } from "lucide-react";

export default async function AppliedJobsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);

  const appliedJobs = await db
    .select({
      job: jobs,
      appliedAt: applications.appliedAt,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.appliedAt));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applied Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your job applications
            </p>
          </div>
          <Link href="/jobs">
            <Button>
              Find More Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {appliedJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No applications yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                You haven't applied to any jobs yet. Start browsing to find your
                next opportunity.
              </p>
              <Link href="/jobs" className="mt-6">
                <Button variant="outline">Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appliedJobs.map(({ job, appliedAt }) => (
              <Card
                key={job.id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex gap-4 w-full">
                      <div className="h-16 w-16 rounded-lg border bg-white dark:bg-slate-900 p-2 flex items-center justify-center shrink-0">
                        <img
                          src={job.logo}
                          alt={`${job.company} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold hover:text-primary transition-colors truncate">
                              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-base font-medium text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              {job.company}
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-0">
                            Applied
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(appliedAt!).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.type && (
                            <Badge variant="secondary">{job.type}</Badge>
                          )}
                          {job.workMode && (
                            <Badge variant="outline">{job.workMode}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="w-full md:w-auto"
                      >
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
