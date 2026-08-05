'use client';

import Link from "next/link";
import { Clock, Users, Award, Sparkles, Flame, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course } from "../types/catalogue";
import { formatStartingPrice } from "./catalogue-data";

const LEVEL_LABELS: Record<string, string> = {
  ALL_LEVELS: "All Levels",
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function CourseCard({
  course,
  layout = "grid",
  isDashboard,
  onClick
}: {
  course: Course;
  layout?: "grid" | "list";
  isDashboard?: boolean;
  onClick?: () => void;
}) {
  const list = layout === "list";
  const highlight = course.featured ? "Featured" : course.isPopular ? "Popular" : null;

  return (
    <article
      className={cn(
        "group panel flex overflow-hidden shadow transition-shadow rounded-xl hover:shadow-lg",
        list ? "flex-col sm:flex-row" : "flex-col"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 bg-linear-to-br",
          course || "from-muted/50 to-muted",
          list ? "h-40 sm:h-auto sm:w-56" : "aspect-video"
        )}
        role="img"
        aria-label={`${course.category?.name ?? "Course"} thumbnail`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
        {highlight ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
            {course.featured ? (
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            ) : (
              <Flame className="size-3.5 text-primary" aria-hidden="true" />
            )}
            {highlight}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {course.category?.name && (
            <Badge variant="secondary" className="font-medium">
              {course.category.name}
            </Badge>
          )}
          {course.level && (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {LEVEL_LABELS[course.level] ?? course.level}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
              {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {course.shortDescription || course.description}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {course.durationDays > 0 && (
            <li className="flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              {course.durationDays} {course.durationDays === 1 ? "day" : "days"}
            </li>
          )}
          {course.audiences && course.audiences.length > 0 && (
            <li className="flex min-w-0 items-center gap-1.5">
              <Users className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {course.audiences.map((a) => a.name).join(", ")}
              </span>
            </li>
          )}
          {course.certificateProvided && (
            <li className="flex items-center gap-1.5">
              <Award className="size-3.5 shrink-0" aria-hidden="true" />
              Certificate
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-lg font-semibold text-foreground">
            {formatStartingPrice(course)}
          </p>
          {
            isDashboard ? 
            (<Button size="sm" className="gap-1.5" onClick={onClick}>
              View Course
              <ArrowRight className="size-4" aria-hidden="true" />
              <span className="sr-only">: {course.title}</span>
          </Button>)
             :
            (<Button size="sm" className="gap-1.5" asChild>
            <Link href={`/courses/${course.slug}`}>
              View Course
              <ArrowRight className="size-4" aria-hidden="true" />
              <span className="sr-only">: {course.title}</span>
            </Link>
          </Button>)
        }
        </div>
      </div>
    </article>
  );
}

export function CourseCardSkeleton({
  layout = "grid",
}: {
  layout?: "grid" | "list";
}) {
  const list = layout === "list";
  return (
    <div
      className={cn(
        "panel flex overflow-hidden",
        list ? "flex-col sm:flex-row" : "flex-col"
      )}
    >
      <div
        className={cn(
          "shrink-0 animate-pulse bg-slate-100",
          list ? "h-40 sm:h-auto sm:w-56" : "aspect-video"
        )}
      />
      <div className="flex flex-1 flex-col gap-3 py-5">
        <div className="h-5 w-32 animate-pulse rounded-full bg-slate-100 " />
        <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-slate-100" />
          <div className="h-9 w-28 animate-pulse rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
}