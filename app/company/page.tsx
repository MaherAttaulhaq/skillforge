import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Params {
  id: string;
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const companyId = parseInt(id);

  if (isNaN(companyId)) {
    notFound();
  }

  // Fetch the company details
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .get();

  if (!company) {
    notFound();
  }

  // Fetch all jobs from this company
  const companyJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.companyId, companyId))
    .all();

  // Fetch similar companies
  const similarCompanies = await db
    .select()
    .from(companies)
    .where(ne(companies.id, companyId))
    .limit(3);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Company Header */}
        {/* <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex gap-6 items-center">
            <div className="bg-white dark:bg-slate-800 rounded-xl h-24 w-24 p-4 border shadow-sm">
              <img
                alt={`${company.name} Logo`}
                className="object-contain w-full h-full"
                src={company.logo}
              />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {company.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{company.location}</span>
              </div>
            </div>
          </div>
          <Button size="lg" className="font-bold">
            Visit Website
          </Button>
        </div> */}

        {/* Company Description */}
        <Card>
          <CardHeader>
            <CardTitle>About {company.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {company.description}
            </p>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyJobs.map((companyJob) => (
              <Link key={companyJob.id} href={`/jobs/${companyJob.id}`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {companyJob.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {companyJob.location}
                        </p>
                      </div>
                      {companyJob.type && (
                        <Badge variant="secondary">{companyJob.type}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                      <Briefcase className="h-4 w-4" />
                      <span>{companyJob.experience}</span>
                      <span className="mx-1">•</span>
                      <span>{companyJob.salary}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
