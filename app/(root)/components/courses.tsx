import { CourseCard } from "@/components/web/courseCard";
import { courses } from "@/lib/courses";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PopularCourses() {
  return (
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                Popular Courses
              </span>
              <h2 className="mt-3 font-display text-4xl lg:text-5xl font-bold text-text-primary">
                Training your team will actually use
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:text-purple-500 transition"
            >
              View all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>
  )
}