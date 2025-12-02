"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    searchParams.get("roles")?.split(",").filter(Boolean) || []
  );
  const [selectedExperience, setSelectedExperience] = useState<string[]>(
    searchParams.get("experience")?.split(",").filter(Boolean) || []
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    searchParams.get("location")?.split(",").filter(Boolean) || []
  );

  // Toggle checkbox selection
  const toggleSelection = (
    value: string,
    selectedArray: string[],
    setSelectedArray: (arr: string[]) => void
  ) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  // Apply filters - update URL params
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedRoles.length > 0) params.set("roles", selectedRoles.join(","));
    if (selectedExperience.length > 0)
      params.set("experience", selectedExperience.join(","));
    if (selectedLocations.length > 0)
      params.set("location", selectedLocations.join(","));

    router.push(`/jobs?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedRoles([]);
    setSelectedExperience([]);
    setSelectedLocations([]);
    router.push("/jobs");
  };

  const roleOptions = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX/UI Designer",
  ];

  const experienceOptions = ["Entry Level", "Mid Level", "Senior Level"];

  const locationOptions = ["Remote", "Hybrid", "On-site"];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex flex-col gap-6">
        <h3 className="text-lg font-bold">Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, skill..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Accordion
            type="single"
            collapsible
            defaultValue="role"
            className="w-full"
          >
            <AccordionItem value="role" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                Role
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 pt-2">
                  {roleOptions.map((role) => (
                    <div key={role} className="flex items-center space-x-3">
                      <Checkbox
                        id={role}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={() =>
                          toggleSelection(role, selectedRoles, setSelectedRoles)
                        }
                      />
                      <label
                        htmlFor={role}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="experience" className="border-b-0 border-t">
              <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                Experience Level
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 pt-2">
                  {experienceOptions.map((level) => (
                    <div key={level} className="flex items-center space-x-3">
                      <Checkbox
                        id={level}
                        checked={selectedExperience.includes(level)}
                        onCheckedChange={() =>
                          toggleSelection(
                            level,
                            selectedExperience,
                            setSelectedExperience
                          )
                        }
                      />
                      <label
                        htmlFor={level}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="location" className="border-b-0 border-t">
              <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                Location
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 pt-2">
                  {locationOptions.map((loc) => (
                    <div key={loc} className="flex items-center space-x-3">
                      <Checkbox
                        id={loc}
                        checked={selectedLocations.includes(loc)}
                        onCheckedChange={() =>
                          toggleSelection(
                            loc,
                            selectedLocations,
                            setSelectedLocations
                          )
                        }
                      />
                      <label
                        htmlFor={loc}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {loc}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t">
          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="ghost" className="w-full" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
