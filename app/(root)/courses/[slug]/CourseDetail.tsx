/* eslint-disable @next/next/no-img-element */
"use client";
import { ShareCourseButton } from "@/app/features/course-catalog/components/ShareCourseButton";
import type { Course } from "@/app/features/course-catalog/types/catalogue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DeliveryMode } from "@/generated/prisma/enums";
import {
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  BadgeCheck,
  Monitor,
  Building2,
  Hotel,
  Check,
  CalendarDays,
  Globe,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const MarkdownRenderer = dynamic(
  () => import("@/app/features/courses/MarkdownRenderer"),
  { ssr: false },
);

const formats = [
  {
    icon: Monitor,
    name: "Online",
    desc: "Live, instructor-led virtual training delivered over Meet, Zoom or Teams.",
  },
  {
    icon: Building2,
    name: "On-Site",
    desc: "Trainer travels to your premises, wherever you are.",
  },
  {
    icon: Hotel,
    name: "At our Venue",
    desc: "Training delivered at our one of our venues, closest to your location.",
  },
];

export default function CourseDetail({ course }: { course: Course }) {
  const selectedPricing = course.pricing.find(
    (pricing) => pricing.deliveryMode === DeliveryMode.ARRANGED_VENUE,
  );

  const price = selectedPricing ? Number(selectedPricing.amount) : null;

  const currency = selectedPricing?.currency ?? "KES";

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-350 px-4 pt-12 pb-16 lg:px-10">
          <nav className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/courses" className="hover:text-white">
              Courses
            </Link>
          </nav>

          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            {course.category.name}
          </span>
          <h1 className="mt-3 text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-3xl">
            {course.title}
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-2xl leading-relaxed">
            {course.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Online", "On-Site", "At our Venue"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15"
              >
                {f}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15 inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {course.durationDays} day
              {course.durationDays > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Two-column body */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-12">
          {/* Main */}
          <div className="min-w-0 space-y-14">
            {/* Description */}
            <div className="bg-white border border-blue-100 rounded-2xl p-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">
                Course Description
              </h2>
              <MarkdownRenderer value={course.description} />
            </div>
            {/* what you'll learn */}
            <div className="bg-white border border-blue-100 rounded-2xl p-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-6">
                What You&apos;ll Learn
              </h2>
              <ul className="space-y-2">
                {course.learningOutcomes.map((outcome, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-text-secondary leading-relaxed"
                  >
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* audience */}
            <div className="bg-white border border-blue-100 rounded-2xl p-8">
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-5">
                Who this course is for
              </h3>
              <ul className="space-y-2 text-text-secondary">
                {course.audiences.map((audience) => (
                  <li key={audience.id} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {audience.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outline */}
            <div className="bg-white border border-blue-100 rounded-2xl px-6 pt-6">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">
                Course Outline
              </h2>
              <Accordion type="single" collapsible defaultValue="item-0">
                {course.modules.map((m, i) => (
                  <AccordionItem
                    key={m.title}
                    value={`item-${i}`}
                    className="border-blue-100"
                  >
                    <AccordionTrigger className="text-left font-display text-lg font-semibold text-text-primary py-5">
                      {`Module ${i + 1}: ${m.title}`}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary text-base leading-relaxed pb-5">
                      {m.topics.map((topic) => (
                        <li
                          key={topic}
                          className="flex gap-3 text-text-secondary leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Delivery formats */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6 lg:p-8">
              {/* Header */}
              <div className="mb-7 max-w-3xl">
                <h2 className="font-display text-2xl font-bold lg:text-3xl">
                  Choose How You Want to Train
                </h2>

                <p className="mt-2 leading-relaxed text-text-secondary">
                  Choose the delivery format that works best for your team.
                  Pricing varies by format, and you can select your preferred
                  training dates and location when making your booking.
                </p>
              </div>

              {/* Formats */}
              <div className="grid gap-5 md:grid-cols-3">
                {formats.map((f) => (
                  <div
                    key={f.name}
                    className="flex flex-col border-blue-100 bg-white p-6 rounded-xl border"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-primary">
                      <f.icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-display text-lg font-bold">{f.name}</h3>

                    <p className="mt-2 flex-1 text-base leading-relaxed text-text-secondary">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Flexible scheduling */}
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50/60 p-4">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="font-semibold text-text-primary">
                    Flexible scheduling
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    You choose your preferred training dates when booking. For
                    in-person training, you can also specify where you would
                    like the training delivered, whether at your premises or at
                    an arranged venue.
                  </p>
                </div>
              </div>
            </div>

            {/* Trainer */}
            <div className="rounded-2xl border border-blue-100 bg-white p-8">
              <h2 className="mb-6 font-display text-2xl font-bold lg:text-3xl">
                Your Trainer
              </h2>

              <div>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    Matched to your training needs
                  </h3>

                  <p className="mt-2 leading-relaxed text-text-secondary">
                    Your trainer is selected after booking based on the course
                    requirements, your industry, team profile, location, and
                    learning objectives.
                  </p>

                  <p className="mt-3 leading-relaxed text-text-secondary">
                    CertBridge Global works with vetted trainers and
                    subject-matter experts, allowing us to match each engagement
                    with a facilitator whose experience is relevant to the
                    training being delivered.
                  </p>

                  <p className="mt-3 text-sm font-medium text-primary">
                    Your assigned trainer will be confirmed as part of the
                    training arrangements.
                  </p>
                </div>
              </div>
            </div>

            {/* certification */}
            <div className="rounded-2xl border border-blue-100 bg-white p-8">
              <div>
                <div>
                  <h2 className="font-display text-2xl mb-6 font-bold lg:text-3xl">
                    Certificate of Participation
                  </h2>

                  <h3 className="font-display text-lg font-bold">
                    Recognition for completing your training
                  </h3>

                  <p className="mt-3 leading-relaxed text-text-secondary">
                    Participants who attend the training receive a CertBridge
                    Global Certificate of Participation, recognising their
                    involvement in the programme and the learning undertaken.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="">
            <div className="lg:sticky top-4">
              <BookingCard course={course} />
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-blue-100 shadow-[0_-8px_24px_-12px_rgba(45,27,105,0.2)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-lg font-bold leading-none">{`From ${currency} ${price?.toLocaleString()}`}</div>
          <div className="text-xs text-text-muted mt-1">per participant</div>
        </div>
        <Link
          href={`/courses/${course.slug}/course-booking`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg font-semibold text-sm"
        >
          Book Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="lg:hidden h-20" />
    </>
  );
}

function BookingCard({ course }: { course: Course }) {
  const [selectedMode, setSelectedMode] = useState<DeliveryMode>(
    DeliveryMode.ARRANGED_VENUE,
  );

  const deliveryOptions = [
    {
      value: DeliveryMode.ARRANGED_VENUE,
      label: "Arranged Venue",
      description: "We organize the training venue",
      icon: Building2,
    },
    {
      value: DeliveryMode.CLIENT_SITE,
      label: "Client Site",
      description: "Training at your premises",
      icon: MapPin,
    },
    {
      value: DeliveryMode.ONLINE,
      label: "Online",
      description: "Instructor-led virtual training",
      icon: Globe,
    },
  ];

  const selectedPricing = course.pricing.find(
    (pricing) => pricing.deliveryMode === selectedMode,
  );

  const price = selectedPricing ? Number(selectedPricing.amount) : null;

  const currency = selectedPricing?.currency ?? "KES";

  const formattedPrice =
    price !== null && Number.isFinite(price)
      ? new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(price)
      : "Contact for Pricing";

  const imgUrl =
    "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg";

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_24px_60px_-20px_rgba(45,27,105,0.35)]">
      <div className="aspect-video overflow-hidden bg-blue-100">
        <img
          src={imgUrl}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-6">
        {/* Price */}
        <div aria-live="polite">
          <p className="mb-1 text-xs font-medium text-text-muted">
            Training price
          </p>

          <span className="font-display text-3xl font-bold text-primary">
            {formattedPrice}
          </span>

          {price !== null && (
            <p className="mt-1 text-sm text-text-muted">
              Per participant
            </p>
          )}
        </div>

        {/* Delivery mode selection */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-text-secondary">
            Choose your delivery mode
          </p>

          <div className="space-y-2">
            {deliveryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedMode === option.value;

              const optionPricing = course.pricing.find(
                (pricing) => pricing.deliveryMode === option.value,
              );

              const optionPrice = optionPricing
                ? Number(optionPricing.amount)
                : null;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedMode(option.value)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-blue-50"
                      : "border-blue-100 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-blue-50 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-text-secondary"
                      }`}
                    >
                      {option.label}
                    </p>

                    <p className="mt-0.5 text-xs text-text-muted">
                      {option.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-primary">
                      {optionPrice !== null && Number.isFinite(optionPrice)
                        ? optionPrice.toLocaleString("en-KE")
                        : "—"}
                    </p>
                    <p className="text-[10px] text-text-muted">per person</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course information */}
        <ul className="mt-5 space-y-3 border-y border-blue-100 py-5 text-sm text-text-secondary">
          <li className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary" />
            Duration: {course.durationDays} days
          </li>

          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary" />
            {
              deliveryOptions.find((option) => option.value === selectedMode)
                ?.label
            }
          </li>
        </ul>

        {/* Booking */}
        <Link
          href={{
            pathname: `/courses/${course.slug}/course-booking`,
            query: {
              deliveryMode: selectedMode,
            },
          }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90"
        >
          Book This Course
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="my-3 flex items-center gap-3 text-xs text-text-muted">
          <span className="h-px flex-1 bg-blue-100" />
          or
          <span className="h-px flex-1 bg-blue-100" />
        </div>

        <Link
          href="/contact"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 font-semibold text-primary transition hover:bg-blue-50"
        >
          Request a Quote
        </Link>

        {/* Benefits */}
        <ul className="mt-6 space-y-2.5 text-sm text-text-secondary">
          <li className="flex items-center gap-2.5">
            <CalendarCheck className="h-4 w-4 text-accent-green" />
            Confirmation within 24 hrs
          </li>

          <li className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-accent-green" />
            Vetted & certified trainers
          </li>

          <li className="flex items-center gap-2.5">
            <BadgeCheck className="h-4 w-4 text-accent-green" />
            Flexible scheduling
          </li>
        </ul>

        <ShareCourseButton courseSlug={course.slug} />
      </div>
    </div>
  );
}
