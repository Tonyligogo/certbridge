/* eslint-disable @next/next/no-img-element */
'use client';

import Link from "next/link";
import { Clock, Users, Award, ChartNoAxesColumnIncreasing, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "../types/catalogue";
import { formatStartingPrice } from "./catalogue-data";

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

  return (
    <article
      className={cn(
        "group panel bg-white rounded-md flex overflow-hidden shadow transition-shadow hover:shadow-xl hover:shadow-primary/5",
        list ? "flex-col sm:flex-row" : "flex-col"
      )}
    >
      {/* <div
        className={cn(
          "relative shrink-0 bg-linear-to-br",
          course || "from-muted/50 to-muted",
          list ? "h-40 sm:h-auto sm:w-56" : "aspect-video"
        )}
        role="img"
        aria-label={`${course.category?.name ?? "Course"} thumbnail`}
      >
        
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
      </div> */}

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="min-w-0">
          <h3 className="font-display line-clamp-2 text-xl font-bold text-text-primary leading-snug mb-2">
          {course.title}
        </h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {course.shortDescription}
        </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* {course.category?.name && (
            <span className="text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            {course.category.name}
          </span>
          )} */}
        </div>


        <ul className="flex flex-col gap-x-4 gap-y-1.5 text-sm">
          <li className="flex items-center gap-1.5 text-xs">
                <ChartNoAxesColumnIncreasing className="size-3.5 shrink-0" aria-hidden="true" />
                {course.level}
            </li>
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

        <div className="mt-auto border-t flex justify-between items-center gap-3 pt-2">
          <p className="font-semibold text-foreground">
            {formatStartingPrice(course)} 
            <span className="text-xs block font-normal">/ participant</span>
          </p>
          {
            isDashboard ? 
            (<button className="flex text-sm text-primary gap-1.5 hover:underline" onClick={onClick}>
              <span>View course</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
          </button>)
             :
            (
            <Link href={`/courses/${course.slug}`} className="flex gap-1.5 text-primary text-sm hover:underline">
              <span>View course</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          )
        } 
        </div>
      </div>
      {course.status === 'ARCHIVED' && 
      <div className="bg-rose-200 text-rose-500 text-center">
        <span className="text-sm">Archived</span>
      </div>}
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