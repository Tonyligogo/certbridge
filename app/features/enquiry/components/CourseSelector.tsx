
"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronsUpDown,
  Loader2,
  Plus,
  RotateCcw,
  SearchX,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCourseOptions } from "../../course-catalog/hooks/use-catalogue-search";


export interface CourseSelection {
  courseId: string | null;
  courseName: string | null;
}

interface CourseSelectorProps {
  value: CourseSelection;
  originalCourse: CourseSelection;
  onChange: (value: CourseSelection) => void;
  disabled?: boolean;
}

export function CourseSelector({
  value,
  originalCourse,
  onChange,
  disabled = false,
}: CourseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const hasSearch = search.trim().length > 0;
  const isDebouncing =
    hasSearch && search.trim() !== debouncedSearch;

  const {
    data: courses = [],
    isPending,
    isFetching,
    isError,
    refetch,
  } = useCourseOptions(
    debouncedSearch,
    open && hasSearch && !isDebouncing,
  );

  const isLoading =
    hasSearch && (isDebouncing || isPending || isFetching);

  const displayValue =
    value.courseName || "Select a course";

  const hasOriginalCourse = Boolean(
    originalCourse.courseId || originalCourse.courseName,
  );

  const isOriginalSelected =
    value.courseId === originalCourse.courseId &&
    value.courseName === originalCourse.courseName;

  function handleSelect(selection: CourseSelection) {
    onChange(selection);
    setOpen(false);
    setSearch("");
    setDebouncedSearch("");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
      setDebouncedSearch("");
    }
  }

  const filteredCourses = courses.filter(
    (course) => course.id !== originalCourse.courseId,
  );

  return (
    <Popover modal open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-10 w-full justify-between font-normal"
        >
          <span className="flex min-w-0 items-center gap-2">
            <BookOpen className="size-4 shrink-0 text-muted-foreground" />

            <span
              className={cn(
                "truncate",
                !value.courseName && "text-muted-foreground",
              )}
            >
              {displayValue}
            </span>
          </span>

          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search courses..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList className="h-72 overflow-y-scroll overscroll-contain ">
            {hasOriginalCourse && (
              <>
                <CommandGroup heading="Original course">
                  <CommandItem
                    value="restore-original-course"
                    onSelect={() => handleSelect(originalCourse)}
                    className="flex items-start gap-3 py-3"
                  >
                    <RotateCcw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {originalCourse.courseName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Restore the original selection
                      </p>
                    </div>

                    {isOriginalSelected && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />
              </>
            )}

            {!hasSearch ? (
              <div className="px-4 py-6 text-center">
                <BookOpen className="mx-auto mb-2 size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Start typing to search for a course.
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching courses...
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
                <SearchX className="size-5 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  Unable to search courses.
                </p>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => refetch()}
                >
                  Try again
                </Button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No matching courses found.
              </div>
            ) : (
              <CommandGroup heading="Search results">
                {filteredCourses.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={course.id}
                    onSelect={() =>
                      handleSelect({
                        courseId: course.id,
                        courseName: course.title,
                      })
                    }
                    className="flex items-start gap-3 py-2.5"
                  >
                    <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {course.title}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[
                          course.level?.replaceAll("_", " "),
                          course.durationDays
                            ? `${course.durationDays} ${
                                course.durationDays === 1
                                  ? "day"
                                  : "days"
                              }`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    {value.courseId === course.id && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandSeparator />

            <CommandGroup>
              <CommandItem
                value="custom-course-option"
                onSelect={() =>
                  handleSelect({
                    courseId: null,
                    courseName: "",
                  })
                }
                className="py-3"
              >
                <Plus className="size-4" />

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    Enter a custom course
                  </span>
                  <span className="text-xs text-muted-foreground">
                    For training not listed in the catalogue
                  </span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
