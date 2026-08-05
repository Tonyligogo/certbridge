import { Suspense } from "react";

import prisma from "@/lib/prisma";
import { FilterSidebar } from "@/app/features/course-catalog/components/FilterSidebar";
import { CourseCardSkeleton } from "@/app/features/course-catalog/components/CourseCard";
import { CoursesGrid } from "@/app/features/course-catalog/components/CoursesGrid";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <header>
        <div className="flex justify-between items-center gap-4 pb-8">
          <h1 className="mt-1 text-3xl font-semibold text-foreground">Course Catalogue</h1>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">New course</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex gap-8">
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
