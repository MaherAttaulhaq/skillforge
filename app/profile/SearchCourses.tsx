"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchCourses() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [term, setTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      if (params.toString() !== searchParams.toString()) {
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [term, router, searchParams]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Filter courses..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
