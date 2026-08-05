'use client';

import { useState } from "react";
import { LayoutGrid, List, SearchX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { activeFilterCount, useCatalogueSearch } from "../hooks/use-catalogue-search";
import { FilterPanel } from "./FilterSidebar";
import { CourseSortSelect } from "./CourseSortSelect";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { CourseCard } from "./CourseCard";
import type { Course, CourseCategory, CourseAudience } from "../types/catalogue";
import { CourseDetailsSheet } from "./CourseDetailSheet";
import { usePathname } from "next/navigation";

interface CourseCatalogueProps {
  courses: Course[];
  sheetCategories?: CourseCategory[];
  sheetAudiences?: CourseAudience[];
}

export function CourseCatalogue({
  courses = [],
  sheetCategories = [],
  sheetAudiences = [],
}: CourseCatalogueProps) {
  const { search, setSearch, clearAll } = useCatalogueSearch();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const isDashboard = pathname.includes("/admin") || pathname.includes("/portal");

  const count = activeFilterCount(search);
  const list = search.view === "list";

  return (
        <div className="min-w-0 flex-1">
          <div className="mb-5 space-y-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
              <p className="min-w-0 truncate text-sm font-medium text-foreground" aria-live="polite">
                Showing {courses.length} course{courses.length === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-2">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                      <SlidersHorizontal className="size-4" aria-hidden="true" />
                      Filters
                      {count > 0 && (
                        <Badge className="ml-0.5 size-5 justify-center rounded-full p-0 text-[11px]">
                          {count}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[min(22rem,92vw)] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Narrow the catalogue by category, audience, price and more.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-4 pb-8 pt-4">
                      <FilterPanel idPrefix="mobile" categories={sheetCategories} audiences={sheetAudiences} />
                    </div>
                  </SheetContent>
                </Sheet>

                <CourseSortSelect />

                <ToggleGroup
                  type="single"
                  value={search.view}
                  onValueChange={(v) => v && setSearch({ view: v as "grid" | "list" })}
                  aria-label="View layout"
                  className="hidden sm:flex"
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="size-4" aria-hidden="true" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="size-4" aria-hidden="true" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <ActiveFilterChips />
          </div>

          {/* Course Grid/List */}
          {
          courses.length === 0 ? 
          (
            <div className="panel flex flex-col items-center gap-4 px-6 py-16 text-center rounded-xl border border-border bg-card">
              <div className="grid size-14 place-items-center rounded-full bg-muted">
                <SearchX className="size-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  No courses found matching your criteria
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try removing a filter or broadening your search terms.
                </p>
              </div>
              <Button onClick={clearAll}>Reset filters</Button>
            </div>
          ) 
          : 
          (
            <div
              className={cn(
                "grid gap-5",
                list ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              )}
            >
              {courses.map((course) => (
                  <CourseCard key={course.id} course={course} layout={list ? "list" : "grid"} isDashboard={isDashboard} onClick={() => setSelectedCourse(course)} />
              ))}
            </div>
          )
          }
          {/* Side Drawer for Course Details */}
      <CourseDetailsSheet
        course={selectedCourse}
        open={!!selectedCourse}
        onOpenChange={(open) => {
          if (!open) setSelectedCourse(null);
        }}
        onEnroll={(course) => {
          console.log("Enrolling in course:", course.id);
        }}
      />
        </div>
  );
}