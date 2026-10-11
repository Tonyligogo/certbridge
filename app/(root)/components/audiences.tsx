
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  UsersRound,
  GraduationCap,
  UserRoundCheck,
  Target,
  BookOpen,
  Layers3,
  Building2,
} from "lucide-react";
import type { LandingAudience } from "@/app/features/landing-page/types";


interface AudiencesSectionProps {
  audiences: LandingAudience[];
}

const audienceIcons = [
  BriefcaseBusiness,
  UsersRound,
  GraduationCap,
  UserRoundCheck,
  Target,
  BookOpen,
  Layers3,
  Building2,
];

export default function AudiencesSection({
  audiences,
}: AudiencesSectionProps) {
  if (audiences.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Training for Every Team
            </span>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Who are you looking to train?
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              From emerging professionals to experienced leaders,
              explore training programmes suited to different roles,
              responsibilities, and development goals.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-primary transition hover:gap-3"
          >
            Explore all courses
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Audience cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => {
            const Icon = audienceIcons[index % audienceIcons.length];

            return (
              <Link
                key={audience.id}
                href={`/courses?audience=${encodeURIComponent(
                  audience.slug
                )}`}
                className="group flex min-h-[235px] flex-col rounded-2xl border border-blue-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                {/* Icon and number */}
                <div className="mb-7 flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>

                  <span className="font-display text-sm font-semibold text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Audience details */}
                <div className="flex flex-1 flex-col">
                  <h3 className="font-display text-xl font-bold leading-snug text-slate-900">
                    {audience.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {audience.courseCount}{" "}
                    {audience.courseCount === 1
                      ? "training programme"
                      : "training programmes"}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-sm font-semibold text-primary">
                      Explore courses
                    </span>

                    <ArrowUpRight
                      className="size-5 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Supporting message */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Training for mixed teams?
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Our programmes can be arranged for teams with different
              roles and experience levels. Tell us about your training
              needs and we&apos;ll help you find a suitable option.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Talk to our team
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
