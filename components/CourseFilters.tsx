"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getCategories } from "@/app/courses/actions";

interface Category {
  id: number;
  title: string;
  slug: string;
}

export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level") || "all"
  );
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories();
      setCategoryOptions(categories);
    }
    fetchCategories();
  }, []);

  // Toggle checkbox selection
  const toggleCategory = (value: string) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== value)
      );
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  // Apply filters - update URL params
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedLevel && selectedLevel !== "all")
      params.set("level", selectedLevel);

    router.push(`/courses?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLevel("all");
    router.push("/courses");
  };

  const levelOptions = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex flex-col gap-6">
        <h3 className="text-lg font-bold">Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Accordion
            type="single"
            collapsible
            defaultValue="categories"
            className="w-full"
          >
            <AccordionItem value="categories" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 pt-2">
                  {categoryOptions.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={String(category.id)}
                        checked={selectedCategories.includes(category.title)}
                        onCheckedChange={() => toggleCategory(category.title)}
                      />
                      <label
                        htmlFor={String(category.id)}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category.title}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="level" className="border-b-0 border-t">
              <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                Difficulty Level
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedLevel}
                  onValueChange={setSelectedLevel}
                  className="flex flex-col gap-3 pt-2"
                >
                  {levelOptions.map((level) => (
                    <div key={level.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={level.id} id={level.id} />
                      <Label
                        htmlFor={level.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
