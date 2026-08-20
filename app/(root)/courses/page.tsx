import { Suspense } from "react";

import prisma from "@/lib/prisma";
import { FilterSidebar } from "@/app/features/course-catalog/components/FilterSidebar";
import { CourseCardSkeleton } from "@/app/features/course-catalog/components/CourseCard";
import { CoursesGrid } from "@/app/features/course-catalog/components/CoursesGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalogue",
  description:
    "Professional training and learning solutions for individuals, teams, and organizations.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const [categories, audiences] = await Promise.all([
    prisma.courseCategory.findMany(),

    prisma.courseAudience.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <section className="bg-primary text-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            Course Catalogue
          </span>
          <h1 className="mt-3 font-display text-4xl lg:text-6xl font-bold max-w-3xl">
            Find the right training for your team
          </h1>
          <p className="mt-5 text-lg text-white/75 max-w-2xl">
            Pick a course and submit a booking request. We&apos;ll match you with a vetted
            trainer and arrange everything end-to-end.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex gap-8 px-8 py-16">
        <FilterSidebar categories={categories} audiences={audiences} />
        <Suspense
          key={JSON.stringify(params)}
          fallback={
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} layout="grid" />
              ))}
            </div>
          }
        >
          <CoursesGrid
            searchParams={params}
            sheetCategories={categories}
            sheetAudiences={audiences}
          />
        </Suspense>
      </main>
    </div>
  );
}
