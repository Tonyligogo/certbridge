import { LandingCourse } from "@/app/features/landing-page/types";
import { ArrowRight, ArrowUpRight, Award, Clock } from "lucide-react";
import Link from "next/link";

export function PopularCourses({ courses }: { courses: LandingCourse[] }) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider">
              Popular Courses
            </span>
            <h2 className="mt-3 text-4xl lg:text-5xl font-semibold ">
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
  );
}

export function LandingCourseCard({ course }: { course: LandingCourse }) {
  return (
    <article className="group panel bg-white rounded-md flex overflow-hidden shadow transition-shadow hover:shadow-xl hover:shadow-primary/5">
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Course information */}
        <div className="min-w-0">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold leading-snug">
            {course.title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary">
            {course.shortDescription}
          </p>
        </div>

        {/* Course details */}
        <ul className="flex flex-col gap-x-4 gap-y-2 text-xs text-text-secondary">
          <li className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {course.durationDays} {course.durationDays === 1 ? "day" : "days"}
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
            <div className="flex justify-between items-center">
              {course.startingPrice ? (
                <p className="font-semibold text-foreground">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: course.startingPrice.currency,
                    maximumFractionDigits: 0,
                  }).format(Number(course.startingPrice.amount))}
                  <span className="text-xs block font-normal">
                    / participant
                  </span>
                </p>
              ) : (
                <p className="text-sm font-medium text-text-secondary">
                  Contact us for pricing
                </p>
              )}
              <Link
                href={`/courses/${course.slug}`}
                className="flex text-sm text-primary gap-1.5 hover:underline"
              >
                View Course
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default LandingCourseCard;
