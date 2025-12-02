import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Bookmark,
  Sparkles,
  Briefcase,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

interface params {
  id?: number;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<params>;
}) {
  const { id } = await params;
  const job = db
    .select()
    .from(jobs)
    .where(eq(jobs.id, Number(id)))
    .get();
  console.log(job);
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-8 text-sm">
        <Link
          href="/jobs"
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Jobs
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/jobs"
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Search Results
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">
          {job?.title} at {job?.company}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
        {/* Left Column (Sticky Summary) */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 h-fit mb-8 lg:mb-0">
          <div className="flex flex-col gap-6">
            {/* Company Header */}
            <div className="flex gap-4 items-center">
              <div className="bg-white dark:bg-slate-800 rounded-lg min-h-20 w-20 p-2 border">
                <img
                  alt={`${job?.company} Logo`}
                  className="object-contain w-full h-full"
                  src={job?.logo}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold">{job?.company}</p>
                <p className="text-base text-muted-foreground">
                  {job?.location}
                </p>
              </div>
            </div>

            {/* Job Title & Salary */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black leading-tight tracking-tighter">
                {job?.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {job?.salary || "Salary not specified"}
              </p>
            </div>

            {/* Job Type Badges */}
            <div className="flex gap-2 flex-wrap">
              {job?.type && (
                <Badge variant="secondary" className="h-8 px-3">
                  {job.type}
                </Badge>
              )}
              {job?.workMode && (
                <Badge variant="secondary" className="h-8 px-3">
                  {job.workMode}
                </Badge>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button className="w-full h-12 text-base font-bold gap-2">
                <ArrowRight className="h-5 w-5" />
                Apply Now
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-bold gap-2 border-2"
              >
                <Bookmark className="h-5 w-5" />
                Save Job
              </Button>
            </div>

            {/* AI Match Card */}
            <Card className="border-accent/30 bg-accent/10 dark:bg-accent/5">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-accent-700 dark:text-accent">
                    SkillForge Analysis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re a{" "}
                    <span className="font-bold">{job?.match}% match</span> for
                    this role.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Information Card */}
            <Card>
              <CardContent className="p-5 flex flex-col gap-4">
                <h3 className="text-lg font-bold">Key Information</h3>
                <ul className="space-y-3 text-muted-foreground">
                  {job?.experience && (
                    <li className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-primary shrink-0" />
                      <span>{job.experience} Experience</span>
                    </li>
                  )}
                  {job?.type && (
                    <li className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary shrink-0" />
                      <span>{job.type}</span>
                    </li>
                  )}
                  <li className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <span>{job?.posted}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (Scrollable Details) */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-8">
            {/* Job Details Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline">
                  {job?.description && (
                    <>
                      <h3>About the Role</h3>
                      <p>{job.description}</p>
                    </>
                  )}
                   <br />
                  {job?.requirements && (
                    <>
                      <h4>Requirements</h4>
                      <p>{job.requirements}</p>
                    </>
                  )}
<br />
                  {job?.benefits && (
                    <>
                      <h4>Benefits</h4>
                      <p>{job.benefits}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Required Card */}
            {job?.tags && (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-4">Skills Required</h3>
                  <div className="flex flex-wrap gap-3">
                    {job.tags.split(',').map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-accent/20 text-accent-800 dark:bg-accent/10 dark:text-accent hover:bg-accent/30 px-4 py-1.5 text-sm font-medium"
                      >
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}


          </div>
        </div>
      </div>
    </main>
  );
}
