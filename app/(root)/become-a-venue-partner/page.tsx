
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Coffee,
  Presentation,
  Projector,
  ShieldCheck,
  Users,
} from "lucide-react";

const venueTypes = [
  {
    icon: Building2,
    title: "Hotels & Conference Facilities",
    description:
      "Hotels with meeting rooms, conference halls and supporting hospitality services for corporate training programmes.",
  },
  {
    icon: Presentation,
    title: "Dedicated Training Centres",
    description:
      "Purpose-built learning spaces designed to support workshops, seminars and professional development.",
  },
  {
    icon: Users,
    title: "Meeting & Event Spaces",
    description:
      "Professional meeting rooms and event facilities that can accommodate group learning and collaborative sessions.",
  },
  {
    icon: Coffee,
    title: "Other Suitable Facilities",
    description:
      "Other well-equipped spaces that can provide a comfortable and productive environment for professional learning.",
  },
];

const suitabilityAreas = [
  {
    icon: Presentation,
    title: "Training Facilities",
    description:
      "Spaces that can accommodate the expected number of participants and support different training formats.",
    points: [
      "Appropriate room sizes and capacities.",
      "Flexible seating arrangements.",
      "Suitable tables, chairs and workspace.",
      "Presentation facilities where available.",
    ],
  },
  {
    icon: Projector,
    title: "Equipment & Connectivity",
    description:
      "Facilities that help trainers deliver sessions effectively and participants engage with the content.",
    points: [
      "Projectors, screens or display equipment.",
      "Sound equipment where required.",
      "Reliable internet connectivity.",
      "Adequate power access.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Comfort & Accessibility",
    description:
      "An environment where participants can focus, interact and comfortably spend time during training.",
    points: [
      "Clean and well-maintained spaces.",
      "Good lighting and ventilation.",
      "Comfortable seating.",
      "Convenient location and accessibility.",
    ],
  },
  {
    icon: Coffee,
    title: "Hospitality & Support",
    description:
      "Additional services that contribute to a smooth and well-organised training experience.",
    points: [
      "Catering and refreshment options.",
      "Responsive venue staff.",
      "Clean washroom facilities.",
      "Reliable on-site support.",
    ],
  },
];

const partnershipSteps = [
  {
    number: "01",
    title: "Express Your Interest",
    description:
      "Get in touch with our team and introduce your venue or facility.",
  },
  {
    number: "02",
    title: "Share Your Facilities",
    description:
      "Tell us about your available spaces, capacity, equipment and services.",
  },
  {
    number: "03",
    title: "Venue Assessment",
    description:
      "We review the information you provide and consider its suitability for relevant training requirements.",
  },
  {
    number: "04",
    title: "Opportunity Matching",
    description:
      "When a programme requires a venue that matches your facilities, we may contact you to explore availability.",
  },
  {
    number: "05",
    title: "Coordinate the Engagement",
    description:
      "We discuss the specific requirements, availability and arrangements for the training programme.",
  },
];

const informationChecklist = [
  "Venue or facility name and location.",
  "Description of available rooms and spaces.",
  "Room capacities and seating configurations.",
  "Available equipment and amenities.",
  "Catering and hospitality options.",
  "Venue photographs or a facilities brochure.",
  "Contact details for the person responsible for venue bookings.",
];

export default function BecomeAVenuePartnerPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16 md:px-10">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Make Your Space Part of{" "}
              <span className="text-primary">Meaningful Learning.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8">
              Partner with CertBridge Global to provide professional spaces
              for corporate training and development. We would like to learn
              more about your facilities and explore opportunities to work
              together.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore Venue Partnerships
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Corporate training
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Professional learning
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Flexible facilities
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="bg-muted/20 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              The Opportunity
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Why Partner with CertBridge?
            </h2>
            <p className="mt-5 leading-7">
              We aim to build working relationships with facilities that
              understand the needs of professional training and corporate
              learning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Reach Corporate Clients",
                description:
                  "Have your facility considered for venue requirements arising from corporate training programmes.",
              },
              {
                icon: Building2,
                title: "Create More Opportunities",
                description:
                  "Make your spaces available for different types of workshops, seminars and professional development sessions.",
              },
              {
                icon: ShieldCheck,
                title: "Build a Professional Partnership",
                description:
                  "Work with a team that coordinates training arrangements and communicates venue requirements.",
              },
            ].map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-xl border border-primary/20 bg-background p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="mt-4 leading-7">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Venue types */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Who Can Partner?
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What Types of Venues Are We Looking For?
            </h2>
            <p className="mt-5 leading-8">
              We are interested in facilities that can accommodate
              professional learning activities, from small group workshops
              to larger corporate training sessions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {venueTypes.map((venue) => {
              const Icon = venue.icon;

              return (
                <article
                  key={venue.title}
                  className="rounded-xl border border-primary/20 p-6 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{venue.title}</h3>
                  <p className="mt-3 leading-7">
                    {venue.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Suitability */}
      <section className="bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Venue Suitability
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What Makes a Suitable Training Venue?
            </h2>
            <p className="mt-5 leading-7">
              Every training programme has different requirements. These are
              some of the factors we consider when reviewing a venue.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {suitabilityAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article
                  key={area.title}
                  className="rounded-xl border border-primary/20 bg-background p-7 md:p-9"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-5">
                      <h3 className="text-xl font-semibold">{area.title}</h3>
                      <p className="mt-2 leading-7">
                        {area.description}
                      </p>
                    </div>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {area.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-sm leading-6"
                      >
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership process */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            The Process
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            How Venue Partnerships Work
          </h2>
          <p className="mt-5 leading-7">
            We keep the process straightforward, from your initial
            introduction to coordinating a specific training engagement.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {partnershipSteps.map((step, index) => (
            <div key={step.number} className="relative">
              {index !== partnershipSteps.length - 1 && (
                <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-2rem)] bg-primary/20 lg:block" />
              )}

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                {step.number}
              </div>

              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 leading-7">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Information checklist */}
      <section className="bg-muted/30 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-6 w-6" />
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Getting Started
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Information to Share With Us
            </h2>
            <p className="mt-5 leading-7">
              When introducing your venue, a little information about your
              facilities will help us understand what you can offer and the
              types of training engagements your space may support.
            </p>

            <p className="mt-5 leading-7">
              You do not need to complete a formal application. Simply get in
              touch with our team and share the details available to you.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-background p-7 md:p-9">
            <h3 className="text-xl font-semibold">
              Useful information to prepare
            </h3>

            <ul className="mt-7 space-y-5">
              {informationChecklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-7 py-14 text-center text-primary-foreground md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-40 border-primary-foreground/5" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full border-40 border-primary-foreground/5" />

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            Let&apos;s Work Together
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Have a Space That Supports Great Learning?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-primary-foreground/80">
            We&apos;d like to learn more about your facilities and explore whether
            they could support upcoming corporate training programmes.
          </p>

          <Link
            href="/contact"
            className="mt-9 inline-flex items-center gap-3 rounded-md bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
          >
            Contact Our Team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
