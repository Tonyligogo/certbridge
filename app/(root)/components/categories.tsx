/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LandingCategory } from "@/app/features/landing-page/types";

interface PopularCategoriesProps {
  categories: LandingCategory[];
}

const FEATURED_IMAGE =
  "https://images.pexels.com/photos/8276212/pexels-photo-8276212.jpeg";

export default function PopularCategories({
  categories,
}: PopularCategoriesProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // The first category is featured by default.
  const selectedCategory = useMemo(() => {
    return (
      categories.find((category) => category.slug === selectedSlug) ??
      categories[0]
    );
  }, [categories, selectedSlug]);

  // Display the remaining categories in the smaller cards.
  const otherCategories = useMemo(() => {
    if (!selectedCategory) return [];

    return categories
      .filter((category) => category.id !== selectedCategory.id)
      .slice(0, 6);
  }, [categories, selectedCategory]);

  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-7xl bg-slate-50 px-4">
      <div className="mb-8">
        {/* Header Section */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider">
              Our Course Portfolio
            </span>

            <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
              Explore our expert-led professional training categories
            </h2>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 font-semibold text-primary transition hover:underline"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategory?.id === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedSlug(category.slug)}
                aria-pressed={isSelected}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-white ring-2 ring-blue-200 ring-offset-2"
                    : "bg-primary/10 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Featured Category Card */}
        <div className="group relative flex min-h-125 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-8 text-white md:row-span-2">
          {/* Background Image */}
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <img
              src={FEATURED_IMAGE}
              alt=""
              className="h-full w-full object-cover opacity-50"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
          </div>

          <div className="relative z-10">
            <h3 className="mb-3 text-3xl font-bold">
              {selectedCategory.name}
            </h3>

            <p className="mb-4 text-sm leading-relaxed text-slate-200">
              {selectedCategory.description ||
                `Explore professional training programmes in ${selectedCategory.name}.`}
            </p>

            <p className="mb-6 text-sm font-medium text-slate-200">
              {selectedCategory.courseCount}{" "}
              {selectedCategory.courseCount === 1
                ? "training course"
                : "training courses"}{" "}
              available
            </p>

            <Link
              href={`/courses?category=${encodeURIComponent(
                selectedCategory.slug
              )}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-slate-900"
            >
              Explore courses
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Other Categories Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
          {otherCategories.map((category) => (
            <div
              key={category.id}
              className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
            >
              <h4 className="mb-3 text-xl font-bold leading-tight text-slate-900">
                {category.name}
              </h4>

              <p className="mb-5 grow text-sm leading-relaxed text-slate-500">
                {category.description ||
                  `Explore training programmes designed to develop skills in ${category.name}.`}
              </p>

              <p className="mb-5 text-xs font-medium text-slate-500">
                {category.courseCount}{" "}
                {category.courseCount === 1 ? "course" : "courses"}
              </p>

              <Link
                href={`/courses?category=${encodeURIComponent(category.slug)}`}
                className="group/link flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Explore the courses
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover/link:translate-x-1"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}