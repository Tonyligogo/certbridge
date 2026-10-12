
import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import type { LandingAudience } from "@/app/features/landing-page/types";


interface AudiencesSectionProps {
  audiences: LandingAudience[];
}

export default function AudiencesSection({
  audiences,
}: AudiencesSectionProps) {
  if (audiences.length === 0) return null;

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider">
                Training for Everyone
              </span>
              <h2 className="mt-3 text-4xl lg:text-5xl font-semibold ">
                Who are you looking to train?
              </h2>
          </div>

          <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-primary font-semibold transition"
            >
              Explore all courses <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        {/* Audience cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => {

            return (
              <Link
                key={audience.id}
                href={`/courses?audiences=${encodeURIComponent(audience.slug)}`}
                className="group flex flex-col rounded-md shadow-xs bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col">
                  <h3 className=" text-lg font-semibold leading-snug">
                    {audience.name}
                  </h3>
                  <div className="mt-4 flex justify-between gap-5 items-center">
                    <p className="text-sm text-slate-500">
                      {audience.courseCount}{" "}
                      {audience.courseCount === 1
                        ? "training programme"
                        : "training programmes"}
                    </p>
                    <ArrowRight className="h-4 w-4" />
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Supporting message */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">
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
