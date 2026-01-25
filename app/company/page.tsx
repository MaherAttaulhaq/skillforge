import { db } from "@/db";
import { companies } from "@/db/schema";
import { count } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 9;
  const offset = (currentPage - 1) * pageSize;

  const [allCompanies, countResult] = await Promise.all([
    db.select().from(companies).limit(pageSize).offset(offset).all(),
    db.select({ count: count() }).from(companies).get(),
  ]);

  const totalCount = countResult?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight">Companies</h1>
          <p className="text-muted-foreground text-lg">
            Browse all companies and find your next opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/company/${company.id}`}
              className="group"
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between">
                    <div className="bg-white dark:bg-slate-800 rounded-xl h-16 w-16 p-3 border shadow-sm flex items-center justify-center shrink-0">
                      <img
                        alt={`${company.name} Logo`}
                        className="object-contain w-full h-full"
                        src={company.logo}
                      />
                    </div>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <h2 className="font-bold text-xl group-hover:text-primary transition-colors">
                      {company.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                    {company.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {allCompanies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Building2 className="h-12 w-12 mb-4 opacity-20" />
            <p>No companies found.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              asChild={currentPage > 1}
            >
              {currentPage > 1 ? (
                <Link href={`/company?page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Link>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              asChild={currentPage < totalPages}
            >
              {currentPage < totalPages ? (
                <Link href={`/company?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
