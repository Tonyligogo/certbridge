'use client';
import { ShareCourseButton } from "@/app/features/course-catalog/components/ShareCourseButton";
import type { Course } from "@/app/features/course-catalog/types/catalogue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "lucide-react";
import Link from "next/link";

const formats = [
  {
    icon: Monitor,
    name: "Online",
    desc: "Live, instructor-led virtual classroom delivered over Zoom or Teams. Includes breakout work, recordings and a digital workbook.",
  },
  {
    icon: Building2,
    name: "On-Site",
    desc: "Trainer travels to your premises anywhere in Kenya. Best for intact teams who want to apply learning to real, current challenges.",
  },
  {
    icon: Hotel,
    name: "At a Venue",
    desc: "We arrange a professional venue with catering and AV. Ideal for off-site retreats and immersive multi-day programmes.",
  },
];

export default function CourseDetail({course}:{course:Course}) {
  const price = Number(course.pricing?.amount ?? 0);
  const currency = course.pricing?.currency;

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-[1400px] px-4 pt-12 pb-16 lg:px-10">
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{course.title}</span>
          </nav>

          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            {course.category.name}
          </span>
          <h1 className="mt-3 font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-3xl">
            {course.title}
          </h1>
          <p className="mt-5 text-lg text-text-on-dark-muted max-w-2xl leading-relaxed">
            {course.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Online", "On-Site", "At a Venue"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15">
                {f}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15 inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {course.durationDays}
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
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">Course Description</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  {course.description}
                </p>
              </div>

              <h3 className="font-display text-xl font-bold mt-10 mb-4">Who this course is for</h3>
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
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">Course Outline</h2>
              <Accordion type="single" collapsible defaultValue="item-0" className="bg-white border border-blue-100 rounded-2xl px-6">
                {course.modules.map((m, i) => (
                  <AccordionItem key={m.title} value={`item-${i}`} className="border-blue-100">
                    <AccordionTrigger className="text-left font-display text-base font-bold text-text-primary py-5">
                      {`Module ${i + 1}: ${m.title}`}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary leading-relaxed pb-5">
                      {m.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Delivery formats */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">Delivery Formats</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {formats.map((f) => (
                  <div key={f.name} className="bg-white border border-blue-100 rounded-2xl p-6">
                    <div className="h-11 w-11 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-4">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{f.name}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainer */}
            <div className="bg-white border border-blue-100 rounded-2xl p-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-6">About the Trainer</h2>
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-primary flex items-center justify-center font-display text-xl font-bold shrink-0">
                  TH
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Assigned by CertBridge Global</h3>
                  <p className="text-sm text-text-muted mb-3">Vetted leadership facilitator</p>
                  <p className="text-text-secondary leading-relaxed">
                    Once you book, we match you with a trainer from our pre-vetted bench based on
                    your industry, team profile and learning goals. Every CertBridge Global facilitator
                    holds at least 8 years of senior leadership experience, has been peer-reviewed
                    by past clients, and is certified in adult learning methodologies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <aside className="">
            <div className="lg:sticky top-24">
              <BookingCard course={course} />
            </div>
          </aside>

        </div>
      </section>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-blue-100 shadow-[0_-8px_24px_-12px_rgba(45,27,105,0.2)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-lg font-bold leading-none">{`From ${currency} ${price.toLocaleString()}`}</div>
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

function BookingCard({ course }: { course: Course}) {
  const price = Number(course.pricing?.amount ?? 0);
  const currency = course.pricing?.currency;
    const imgUrl = course.thumbnailUrl || "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg";

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_24px_60px_-20px_rgba(45,27,105,0.35)] overflow-hidden">
      <div className="aspect-video bg-blue-100 overflow-hidden">
        <img src={imgUrl} alt={course.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-primary">{`From ${currency} ${price.toLocaleString()}`}</span>
        </div>
        <p className="text-sm text-text-muted">per participant</p>

        <ul className="mt-5 space-y-3 text-sm text-text-secondary border-y border-blue-100 py-5">
          <li className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary" /> Duration: {course.durationDays} days
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary" /> Online · On-Site · At a Venue
          </li>
        </ul>

        <Link
          href={`/courses/${course.slug}/course-booking`}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Book This Course <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="my-3 flex items-center gap-3 text-xs text-text-muted">
          <span className="h-px flex-1 bg-blue-100" /> or <span className="h-px flex-1 bg-blue-100" />
        </div>

        <Link
          href="/contact"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-blue-200 text-primary rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          Request a Quote
        </Link>

        <ul className="mt-6 space-y-2.5 text-sm text-text-secondary">
          <li className="flex items-center gap-2.5">
            <CalendarCheck className="h-4 w-4 text-accent-green" /> Confirmation within 24 hrs
          </li>
          <li className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-accent-green" /> Vetted & certified trainers
          </li>
          <li className="flex items-center gap-2.5">
            <BadgeCheck className="h-4 w-4 text-accent-green" /> Flexible scheduling
          </li>
        </ul>

        <ShareCourseButton courseSlug={course.slug} />
      </div>
    </div>
  );
}