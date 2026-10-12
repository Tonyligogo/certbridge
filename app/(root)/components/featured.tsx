import { LandingCourse } from "@/app/features/landing-page/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import LandingCourseCard from "./courses";

const FeaturedCourses = ({courses}:{courses: LandingCourse[]}) => {
  return (
    <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Featured Courses
              </span>
              <h2 className="mt-3 text-4xl lg:text-5xl font-semibold ">
                Selected courses for you
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-primary font-semibold transition"
            >
              View all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <LandingCourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>
  )
}

export default FeaturedCourses