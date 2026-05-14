import { Course } from "@/lib/courses";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="card-hover group bg-white rounded-xl border border-secondary/50 shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-16/10 overflow-hidden bg-secondary">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            {course.category}
          </span>
          <span className="text-xs font-medium text-text-muted">{course.level}</span>
        </div>
        <h3 className="font-display text-xl font-bold text-text-primary leading-snug mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-text-muted mb-5">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {course.format}
          </span>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className="mt-auto inline-flex items-center justify-between gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          View Course
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}