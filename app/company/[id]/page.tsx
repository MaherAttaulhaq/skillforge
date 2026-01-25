import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Briefcase, Globe, ArrowRight } from "lucide-react";
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
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 mb-8 text-sm">
        <Link
          href="/jobs"
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Jobs
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/company"
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Companies
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{company.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="bg-white dark:bg-slate-800 rounded-xl h-24 w-24 p-4 border shadow-sm shrink-0 flex items-center justify-center">
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

          {/* Company Description */}
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Open Positions ({companyJobs.length})
            </h2>
            <div className="flex flex-col gap-4">
              {companyJobs.length > 0 ? (
                companyJobs.map((companyJob) => (
                  <Link key={companyJob.id} href={`/jobs/${companyJob.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                              {companyJob.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>{companyJob.location}</span>
                            </div>
                          </div>
                          {companyJob.type && (
                            <Badge variant="secondary">{companyJob.type}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4" />
                            <span>{companyJob.experience}</span>
                          </div>
                          {companyJob.salary && (
                            <div className="flex items-center gap-1.5">
                              <span>•</span>
                              <span>{companyJob.salary}</span>
                            </div>
                          )}
                          <div className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No open positions at the moment.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Button className="w-full font-bold gap-2" size="lg" asChild>
                <a
                  href={company.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            </CardContent>
          </Card>

          {similarCompanies.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4">Similar Companies</h3>
              <div className="flex flex-col gap-3">
                {similarCompanies.map((simCompany) => (
                  <Link key={simCompany.id} href={`/company/${simCompany.id}`}>
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-lg border p-2 flex items-center justify-center shrink-0">
                          <img
                            src={simCompany.logo}
                            alt={simCompany.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{simCompany.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {simCompany.location}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
