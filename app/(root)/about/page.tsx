
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  Target,
  Users,
  BriefcaseBusiness,
  Lightbulb,
  Handshake,
} from "lucide-react";

const services = [
  {
    icon: BookOpen,
    number: "01",
    title: "Corporate Training Programmes",
    description:
      "Access a catalogue of professional training programmes across different disciplines and areas of organisational development.",
  },
  {
    icon: Users,
    number: "02",
    title: "Trainer Coordination",
    description:
      "We select trainers with relevant expertise and professional experience to deliver the required programmes.",
  },
  {
    icon: MapPin,
    number: "03",
    title: "Training Delivery Arrangements",
    description:
      "We coordinate online, client-site and arranged-venue training options to suit different organisational requirements.",
  },
  {
    icon: ClipboardCheck,
    number: "04",
    title: "Training Coordination",
    description:
      "We coordinate the arrangements around each programme, helping organisations move from booking to training delivery.",
  },
];

const approachSteps = [
  {
    number: "01",
    icon: Target,
    title: "Understand the Need",
    description:
      "We consider the organisation's training objectives, participants and preferred delivery arrangements.",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Match the Right Expertise",
    description:
      "We select trainers whose knowledge and experience align with the programme and its learning objectives.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Coordinate the Experience",
    description:
      "We bring together the necessary arrangements to support a smooth and effective training experience.",
  },
];

const audiences = [
  {
    icon: BriefcaseBusiness,
    title: "Private Businesses",
    description:
      "Companies looking to strengthen employee capabilities and support professional growth.",
  },
  {
    icon: Building2,
    title: "Corporate Teams",
    description:
      "Departments, managers and teams seeking relevant learning and development opportunities.",
  },
  {
    icon: Users,
    title: "Public Sector Organisations",
    description:
      "Government institutions and public-sector teams investing in professional development.",
  },
  {
    icon: Lightbulb,
    title: "NGOs & Institutions",
    description:
      "Non-governmental organisations, development organisations and other professional institutions.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30">
        <div className="mx-auto max-w-7xl items-center gap-14 px-6 py-20 md:px-10 md:py-28">
          <div>
            <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Building Skills.
              <span className="mt-2 block text-primary">
                Strengthening Organisations.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              CertBridge Global connects organisations with professional
              training opportunities designed to strengthen skills, develop
              capabilities and support workplace growth.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              We work with organisations to understand their learning needs
              and coordinate training programmes that bring together relevant
              expertise, practical learning and suitable delivery arrangements.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore Our Courses
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-md border border-border bg-background px-6 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Who We Are
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Making Professional Development More Accessible to Organisations.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-muted-foreground">
            <p>
              CertBridge Global is a corporate training coordination and
              facilitation company focused on helping organisations access
              relevant professional development opportunities.
            </p>
            <p>
              We understand that effective training involves more than
              selecting a course. It requires understanding an organisation&apos;s
              needs, identifying the right expertise and coordinating the
              practical arrangements that make learning possible.
            </p>
            <p>
              Through our training catalogue and tailored training enquiries,
              we help organisations navigate that process. Whether an
              organisation has a specific programme in mind or needs help
              exploring its options, we provide a way to move forward.
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              What We Do
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Connecting Organisations with the Right Training Support
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              We coordinate different parts of the corporate training
              experience to help organisations access and arrange relevant
              learning programmes.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="rounded-xl border border-border bg-background p-7 transition-colors hover:border-primary/40 md:p-9"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold tracking-widest text-muted-foreground/60">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Our Approach
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Training Should Be Relevant, Practical and Well Coordinated.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            We approach each training engagement with attention to the
            organisation&apos;s needs, the expertise required and the arrangements
            that support effective delivery.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-border md:block" />

          {approachSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative text-center"
              >
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-background text-primary shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>

                <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-primary">
                  STEP {step.number}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Who We Serve
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Supporting Learning Across Organisations.
              </h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                Our services are intended for organisations looking to
                develop their people, strengthen professional capabilities
                and support workplace growth.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {audiences.map((audience) => {
                const Icon = audience.icon;

                return (
                  <article
                    key={audience.title}
                    className="rounded-xl border border-border bg-background p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-semibold">{audience.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {audience.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our commitment */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white px-7 py-12 md:px-14 md:py-16">
          <div className="relative grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Our Commitment
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A Thoughtful Approach to Professional Development.
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-8 text-muted-foreground">
                We believe that professional development should be purposeful.
                Every training engagement should respond to a learning need
                and provide participants with knowledge and skills they can
                apply in their work.
              </p>

              <p className="leading-8 text-muted-foreground">
                We are committed to coordinating relevant training
                opportunities, working with capable professionals and
                supporting organisations throughout the training process.
              </p>

              <div className="flex items-center gap-3 pt-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-5 w-5" />
                Relevant training. Practical learning. Coordinated delivery.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
        <div className="relative isolate overflow-hidden rounded-2xl bg-primary px-7 py-14 text-center text-primary-foreground md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-40 border-primary-foreground/5" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full border-40 border-primary-foreground/5" />

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            Take the Next Step
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Let&apos;s Build Better Capabilities Together.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-primary-foreground/80">
            Whether you already know the training your organisation needs or
            are exploring development opportunities for your team, CertBridge
            Global is ready to help you take the next step.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-3 rounded-md bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
            >
              Explore Training Programmes
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
