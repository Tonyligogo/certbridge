'use client';
import { courses } from "@/lib/courses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  Star,
  Clock,
  Users,
  MapPin,
  ChevronRight,
  ArrowRight,
  Monitor,
  Building2,
  Hotel,
  Share2,
  Link2,
  ShieldCheck,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const learningObjectives = [
  "Define your personal leadership style and how it affects team performance",
  "Adapt your approach across situational leadership models",
  "Run high-stakes conversations with confidence and clarity",
  "Give and receive feedback that actually changes behaviour",
  "Coach team members toward measurable growth and accountability",
  "Lead through change, ambiguity and competing priorities",
  "Make better decisions with structured frameworks and data",
  "Build a high-trust culture that retains top talent",
  "Delegate effectively without losing control of outcomes",
  "Resolve conflict and align diverse stakeholders around goals",
];

const modules = [
  {
    title: "Module 1: Understanding Leadership Styles",
    body: "Explore the spectrum of leadership styles — from directive to coaching to laissez-faire — and identify your default. Self-assessments, peer feedback and case studies anchor this module.",
  },
  {
    title: "Module 2: Communication & Influence",
    body: "Master the mechanics of executive communication: framing messages, reading the room, persuading without authority, and handling pushback in real time.",
  },
  {
    title: "Module 3: Coaching & Feedback",
    body: "Practise the GROW model, deliver radical-candor feedback, and design coaching conversations that move performance forward without breaking trust.",
  },
  {
    title: "Module 4: Decision Making Under Pressure",
    body: "Apply structured decision frameworks (RAPID, OODA, pre-mortems) to ambiguous, time-bound problems. Includes a live simulation.",
  },
  {
    title: "Module 5: Leading Change & Building Culture",
    body: "Diagnose your team culture, sequence change initiatives, and embed habits that outlast any single leader.",
  },
];

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

export default function CourseDetail({slug}: {slug: string}) {
//   const { slug } = useParams();
  const course =
    courses.find((c) => c.slug === slug) ?? {
      slug,
      title: "Leadership & Management Fundamentals",
      category: "Leadership",
      duration: "2 days",
      format: "Online, On-Site or Venue",
      level: "Beginner" as const,
      description:
        "Build the core skills every modern leader needs — from team dynamics to strategic decision making.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    };

  return (
    <>
      {/* Hero */}
      <section className="bg-purple-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 pb-16 lg:pr-[28rem]">
          <nav className="flex items-center gap-2 text-sm text-text-on-dark-muted mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{course.title}</span>
          </nav>

          <span className="text-sm font-semibold uppercase tracking-wider text-purple-300">
            {course.category}
          </span>
          <h1 className="mt-3 font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-3xl">
            {course.title}
          </h1>
          <p className="mt-5 text-lg text-text-on-dark-muted max-w-2xl leading-relaxed">
            {course.description} Designed for managers stepping up, and leaders
            sharpening their craft.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Star className="h-4 w-4 fill-accent-amber text-accent-amber" />
              4.8
              <span className="text-text-on-dark-muted font-normal">· 124 past participants</span>
            </span>
            <span className="text-text-on-dark-muted">Last updated May 2026</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Online", "On-Site", "At a Venue"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15">
                {f}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15 inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {course.duration}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15 inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Up to 20 participants
            </span>
          </div>
        </div>
      </section>

      {/* Two-column body */}
      <section className="bg-purple-50/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid lg:grid-cols-[1fr_22rem] gap-12">
          {/* Main */}
          <div className="min-w-0 space-y-14">
            {/* What you'll learn */}
            <div className="bg-white border border-purple-100 rounded-2xl p-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-6">What You&apos;ll Learn</h2>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {learningObjectives.map((o) => (
                  <li key={o} className="flex gap-3 text-text-secondary leading-relaxed">
                    <Check className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">Course Description</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Leadership & Management Fundamentals is a hands-on programme built for the
                  realities of leading teams in Kenya today. Across two intensive days, your team
                  will move from theory to practice — debating real cases, role-playing tough
                  conversations, and walking out with tools they will use on Monday morning.
                </p>
                <p>
                  This is not a lecture. Expect cohort discussion, scenario work, peer coaching and
                  a personal action plan that gets reviewed in a follow-up clinic two weeks after
                  the workshop. Every cohort is capped at 20 participants to protect depth.
                </p>
                <p>
                  We blend frameworks from Harvard, INSEAD and the Centre for Creative Leadership,
                  adapted to East African business contexts by trainers who have led teams in
                  banking, tech, FMCG and the public sector.
                </p>
              </div>

              <h3 className="font-display text-xl font-bold mt-10 mb-4">Who this course is for</h3>
              <ul className="space-y-2 text-text-secondary">
                {[
                  "First-time managers stepping into a team-lead role in the next 12 months",
                  "Mid-level managers who want a structured refresh on the fundamentals",
                  "High-potential individual contributors being groomed for leadership",
                  "Founders and operators building their first management layer",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outline */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">Course Outline</h2>
              <Accordion type="single" collapsible defaultValue="item-0" className="bg-white border border-purple-100 rounded-2xl px-6">
                {modules.map((m, i) => (
                  <AccordionItem key={m.title} value={`item-${i}`} className="border-purple-100">
                    <AccordionTrigger className="text-left font-display text-base font-bold text-text-primary py-5">
                      {m.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary leading-relaxed pb-5">
                      {m.body}
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
                  <div key={f.name} className="bg-white border border-purple-100 rounded-2xl p-6">
                    <div className="h-11 w-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{f.name}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-5">Requirements</h2>
              <ul className="space-y-2 text-text-secondary">
                {[
                  "No prior management experience required",
                  "A willingness to share real workplace examples in a confidential cohort",
                  "Laptop or notebook for exercises and personal action planning",
                  "For online delivery: stable internet and a webcam-enabled device",
                ].map((r) => (
                  <li key={r} className="flex gap-3">
                    <Check className="h-5 w-5 text-accent-green shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trainer */}
            <div className="bg-white border border-purple-100 rounded-2xl p-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-6">About the Trainer</h2>
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-display text-xl font-bold shrink-0">
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
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BookingCard course={course} />
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-purple-100 shadow-[0_-8px_24px_-12px_rgba(45,27,105,0.2)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-lg font-bold leading-none">From KES 45,000</div>
          <div className="text-xs text-text-muted mt-1">per group</div>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-3 bg-accent-green text-white rounded-lg font-semibold text-sm"
        >
          Book Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="lg:hidden h-20" />
    </>
  );
}

function BookingCard({ course }: { course: { image: string; title: string } }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-[0_24px_60px_-20px_rgba(45,27,105,0.35)] overflow-hidden">
      <div className="aspect-video bg-purple-100 overflow-hidden">
        <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-text-primary">From KES 45,000</span>
        </div>
        <p className="text-sm text-text-muted">per group</p>
        <p className="mt-2 text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">KES 12,000</span> per person (individual)
        </p>

        <ul className="mt-5 space-y-3 text-sm text-text-secondary border-y border-purple-100 py-5">
          <li className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-purple-600" /> Duration: 2 days
          </li>
          <li className="flex items-center gap-3">
            <Users className="h-4 w-4 text-purple-600" /> Up to 20 participants
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-purple-600" /> Online · On-Site · At a Venue
          </li>
        </ul>

        <Link
          href="/contact"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-accent-green text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          Book This Course <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="my-3 flex items-center gap-3 text-xs text-text-muted">
          <span className="h-px flex-1 bg-purple-100" /> or <span className="h-px flex-1 bg-purple-100" />
        </div>

        <Link
          href="/contact"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition"
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

        <div className="mt-6 pt-5 border-t border-purple-100 flex items-center gap-3 text-text-muted">
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Share</span>
          <div className="ml-auto flex items-center gap-2">
            {[Link2].map((Icon, i) => (
              <button
                key={i}
                className="h-8 w-8 rounded-full border border-purple-100 hover:bg-purple-50 flex items-center justify-center"
                aria-label="Share"
              >
                <Icon className="h-3.5 w-3.5 text-purple-700" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}