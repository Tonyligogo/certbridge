
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  MessageSquareText,
  Monitor,
  Presentation,
  Target,
  Users,
  Building2,
  RefreshCw,
} from "lucide-react";

const qualityPrinciples = [
  {
    icon: Target,
    number: "01",
    title: "Programme Relevance",
    description:
      "Training should respond to organisational objectives and the professional development needs of participants.",
  },
  {
    icon: GraduationCap,
    number: "02",
    title: "Trainer Suitability",
    description:
      "Trainers should bring relevant subject knowledge, professional experience and the ability to facilitate learning effectively.",
  },
  {
    icon: Building2,
    number: "03",
    title: "Delivery Readiness",
    description:
      "The delivery format, venue, equipment and supporting arrangements should meet the requirements of the programme.",
  },
  {
    icon: Users,
    number: "04",
    title: "Learning Experience",
    description:
      "Participants should have an environment that encourages engagement, understanding and practical application.",
  },
];

const programmeCriteria = [
  "Alignment between programme content and its intended subject area.",
  "Appropriate programme level and participant audience.",
  "Clear learning objectives and expected outcomes.",
  "A balance between conceptual knowledge and practical application.",
];

const trainerCriteria = [
  "Relevant academic and professional qualifications.",
  "Subject expertise and industry experience.",
  "Ability to communicate and explain concepts clearly.",
  "Training, facilitation and participant engagement skills.",
  "Professionalism and reliability.",
];

const deliveryOptions = [
  {
    icon: Monitor,
    title: "Online Training",
    description:
      "Appropriate arrangements for remote participation, including consideration of the technology and connectivity needed for the programme.",
    href: "/delivery-options",
    linkLabel: "Explore online delivery",
  },
  {
    icon: Building2,
    title: "Client-Site Training",
    description:
      "Coordination around the client's premises, training requirements and the practical needs of the participants.",
    href: "/delivery-options",
    linkLabel: "Explore client-site delivery",
  },
  {
    icon: Presentation,
    title: "Arranged-Venue Training",
    description:
      "Suitable physical learning spaces and supporting facilities based on the nature and requirements of the programme.",
    href: "/delivery-options",
    linkLabel: "Explore arranged venues",
  },
];

const participantConsiderations = [
  {
    icon: MessageSquareText,
    title: "Clear Communication",
    description:
      "Participants should receive relevant information about the programme and its arrangements.",
  },
  {
    icon: ClipboardCheck,
    title: "Appropriate Preparation",
    description:
      "Training arrangements should be coordinated with the programme requirements in mind.",
  },
  {
    icon: Users,
    title: "Engaging Learning",
    description:
      "The learning environment should encourage interaction, participation and practical engagement.",
  },
  {
    icon: GraduationCap,
    title: "Recognition of Participation",
    description:
      "Relevant certificates are provided following fulfilment of the applicable programme requirements.",
  },
];

export default function QualityAssurancePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Quality at Every Stage of the{" "}
              <span className="text-primary">Learning Experience.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8">
              At CertBridge Global, we believe effective training requires
              more than delivering course content. It requires relevant
              programmes, capable trainers, appropriate learning environments
              and thoughtful coordination.
            </p>

            <p className="mt-4 max-w-xl leading-8 text-lg">
              We pay attention to the different elements that contribute to
              a meaningful professional learning experience.
            </p>

            <Link
              href="/courses"
              className="mt-9 inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Our Training Programmes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quality approach */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Our Approach
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Quality Is Built Into the Entire Training Process.
          </h2>
          <p className="mt-5 leading-8">
            We consider the different elements that come together to support
            effective training, from selecting a relevant programme to
            coordinating its delivery.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {qualityPrinciples.map((principle) => {
            const Icon = principle.icon;

            return (
              <article
                key={principle.number}
                className="rounded-xl border border-primary/20 bg-background p-6 md:p-7"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold tracking-widest text-primary">
                    {principle.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-3 leading-7">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Programme quality */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              01 — Programme Quality
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Relevant Content. Purposeful Learning.
            </h2>
            <p className="mt-5 leading-8">
              We consider the relevance of each programme to its intended
              learning objectives and the needs of the organisation. Training
              should give participants knowledge and skills that connect with
              their professional responsibilities.
            </p>
            <p className="mt-4 leading-8">
              The programme level, subject matter and intended audience all
              contribute to determining whether a training option is
              appropriate.
            </p>

            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Browse our training catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-primary/20 bg-background p-7 md:p-9">
            <h3 className="text-xl font-semibold">
              What we consider
            </h3>
            <ul className="mt-7 space-y-5">
              {programmeCriteria.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trainer quality */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              02 — Trainer Quality
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              The Right Expertise Makes a Difference.
            </h2>
            <p className="mt-5 leading-8">
              Trainers play an important role in translating programme
              content into meaningful learning. We select trainers based on
              their suitability for the specific programme, considering both
              their professional background and ability to facilitate
              learning.
            </p>

            <Link
              href="/trainer-requirements"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              View Trainer Requirements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-primary/20 bg-card p-7 md:p-9">
            <h3 className="text-xl font-semibold">
              Trainer suitability considerations
            </h3>

            <ul className="mt-7 space-y-3">
              {trainerCriteria.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Delivery quality */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              03 — Training Delivery
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              The Right Conditions for Effective Learning.
            </h2>
            <p className="mt-5 leading-7">
              We coordinate delivery arrangements based on the organisation&apos;s
              needs and the nature of the programme. Each format has different
              practical considerations.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {deliveryOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className="flex flex-col rounded-xl border border-primary/20 bg-background p-7 md:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {option.title}
                  </h3>
                  <p className="mt-4 flex-1 leading-7">
                    {option.description}
                  </p>

                  <Link
                    href={option.href}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {option.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Participant experience */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              04 — Participant Experience
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Creating an Environment That Supports Learning.
            </h2>
            <p className="mt-5 leading-7">
              The participant experience matters throughout the training
              engagement. From receiving clear information before a programme
              to participating in the learning activities, each stage
              contributes to the overall experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {participantConsiderations.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-primary/20 bg-background p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Continuous improvement */}
      <section>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white px-7 py-12 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="h-6 w-6" />
                </div>

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Continuous Improvement
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  Learning From Every Training Engagement.
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg leading-8">
                  Quality is an ongoing consideration. Feedback and
                  observations from training engagements can help identify
                  areas where programmes, coordination and delivery
                  arrangements may be improved.
                </p>
                <p className="leading-8 text-lg">
                  We aim to use relevant feedback to inform future training
                  engagements and strengthen the overall learning experience.
                  By remaining attentive to what works well and where
                  improvements may be needed, we can continue refining how
                  training is coordinated and delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-7 py-14 text-center text-primary-foreground md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-40 border-primary-foreground/5" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full border-40 border-primary-foreground/5" />

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
            Start With the Right Approach
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Quality Learning Starts With the Right Training Approach.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-primary-foreground/80">
            Whether your organisation has a specific training requirement or
            needs help identifying suitable development opportunities,
            CertBridge Global can help coordinate the next step.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-3 rounded-md bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
            >
              Explore Our Courses
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
