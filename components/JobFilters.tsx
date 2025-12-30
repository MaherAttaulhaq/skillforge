"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function JobFilters({ titles = [] }: { titles?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTitles = titles.filter((title) =>
    title.toLowerCase().includes(q.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (type && type !== "all") params.set("type", type);

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1fr_200px_auto] items-center bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search title or keyword..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isOpen && filteredTitles.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {filteredTitles.map((title) => (
              <div
                key={title}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setQ(title);
                  setIsOpen(false);
                }}
              >
                {title}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger>
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Full-time">Full-time</SelectItem>
          <SelectItem value="Part-time">Part-time</SelectItem>
          <SelectItem value="Contract">Contract</SelectItem>
          <SelectItem value="Internship">Internship</SelectItem>
          <SelectItem value="Remote">Remote</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}