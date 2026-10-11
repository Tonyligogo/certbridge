import { LandingCourse } from "@/app/features/landing-page/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export function PopularCourses({courses}:{courses: LandingCourse[]}) {
  return (
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Popular Courses
              </span>
              <h2 className="mt-3 text-4xl lg:text-5xl font-bold ">
                Training every team wants to take
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

export function LandingCourseCard({ course }: { course: LandingCourse }) {
  return (
    <article className="group panel flex h-full flex-col overflow-hidden rounded-xl shadow transition-shadow hover:shadow-lg">
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Category */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {course.category.name}
          </span>

          <Sparkles
            className="size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
        </div>

        {/* Course information */}
        <div className="min-w-0">
          <h3 className="mb-2 line-clamp-2 font-display text-xl font-bold leading-snug text-text-primary">
            {course.title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary">
            {course.shortDescription}
          </p>
        </div>

        {/* Course details */}
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
          <li className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {course.durationDays}{" "}
            {course.durationDays === 1 ? "day" : "days"}
          </li>

          {course.certificateProvided && (
            <li className="flex items-center gap-1.5">
              <Award className="size-3.5 shrink-0" aria-hidden="true" />
              Certificate of Participation
            </li>
          )}
        </ul>

        {/* Price and CTA */}
        <div className="mt-auto flex flex-col gap-4 pt-3">
          <div className="border-t pt-4">
            <p className="mb-1 text-xs text-text-muted">
              Starting from
            </p>

            {course.startingPrice ? (
              <p className="font-display text-xl font-bold text-text-primary">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: course.startingPrice.currency,
                  maximumFractionDigits: 0,
                }).format(Number(course.startingPrice.amount))}
              </p>
            ) : (
              <p className="text-sm font-medium text-text-secondary">
                Contact us for pricing
              </p>
            )}

            <p className="mt-1 text-xs text-text-muted">
              Price varies by delivery format
            </p>
          </div>

          <Button size="lg" className="w-full gap-1.5" asChild>
            <Link href={`/courses/${course.slug}`}>
              View Course
              <ArrowRight className="size-4" aria-hidden="true" />
              <span className="sr-only">: {course.title}</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default LandingCourseCard;