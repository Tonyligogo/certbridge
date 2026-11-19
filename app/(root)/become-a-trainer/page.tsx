
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Lightbulb,
  Users,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Reach More Organisations",
    description:
      "Get opportunities to deliver training to organisations looking for expertise in your field.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Focus on What You Do Best",
    description:
      "Concentrate on delivering quality training while CertBridge coordinates the client engagement and training arrangements.",
  },
  {
    icon: Lightbulb,
    title: "Make a Difference",
    description:
      "Help professionals and organisations develop the skills and knowledge they need to grow.",
  },
];

const trainerProfiles = [
  "Industry professionals with practical experience.",
  "Consultants and independent professionals.",
  "Certified specialists and technical experts.",
  "Experienced corporate trainers and facilitators.",
  "Academics and other subject-matter experts.",
];

const qualities = [
  "Strong subject-matter knowledge.",
  "Relevant professional qualifications and experience.",
  "Effective communication and presentation skills.",
  "Ability to engage different types of learners.",
  "A practical, results-oriented approach to training.",
  "Professionalism and reliability.",
];

const partnershipSteps = [
  {
    number: "01",
    title: "Express Your Interest",
    description:
      "Contact CertBridge and tell us about your expertise and professional background.",
  },
  {
    number: "02",
    title: "Share Your Credentials",
    description:
      "Provide relevant qualifications, experience and areas of specialisation.",
  },
  {
    number: "03",
    title: "Trainer Assessment",
    description:
      "We review your profile against our trainer requirements and programme needs.",
  },
  {
    number: "04",
    title: "Opportunity Matching",
    description:
      "Where suitable opportunities arise, your expertise may be matched with relevant training programmes.",
  },
  {
    number: "05",
    title: "Training Engagement",
    description:
      "Once an engagement is agreed, we coordinate the necessary arrangements and work with you towards successful delivery.",
  },
];

export default function BecomeATrainerPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-28">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Become a Trainer
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Share Your Expertise.{" "}
            <span className="text-primary">Shape Professional Growth.</span>
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            Are you an experienced professional or subject-matter expert
            passionate about sharing knowledge and developing others?
            Partner with CertBridge Global and bring your expertise to
            organisations looking to strengthen their teams through
            professional training.
          </p>

          <div className="mt-9">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Express Your Interest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why work with CertBridge */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              The Opportunity
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Turn Your Expertise Into Impact.
            </h2>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              We connect experienced trainers with organisations seeking
              practical, relevant and impactful professional development.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="border-t border-border pt-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who we're looking for */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Who We&apos;re Looking For
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Are You the Right Fit?
          </h2>

          <p className="mt-6 text-base leading-8 text-muted-foreground">
            We&apos;re interested in working with professionals who bring a
            combination of subject knowledge, practical experience and the
            ability to facilitate meaningful learning.
          </p>
        </div>

        <div className="space-y-5">
          {trainerProfiles.map((profile, index) => (
            <div key={profile} className="flex items-start gap-4 border-b border-border pb-5">
              <span className="text-sm font-semibold text-primary">
                0{index + 1}
              </span>
              <p className="text-base leading-7 text-foreground">{profile}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trainer qualities */}
      <section className="bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              What We Value
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Expertise Matters. So Does How You Share It.
            </h2>

            <p className="mt-6 text-base leading-8 text-muted-foreground">
              We value trainers who can combine professional knowledge with
              the ability to engage participants and make learning practical,
              relevant and meaningful.
            </p>

            <Link
              href="/trainer-requirements"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore Trainer Requirements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {qualities.map((quality) => (
              <div key={quality} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-7 text-foreground sm:text-base">
                  {quality}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership process */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            The Partnership Process
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Working Together, Step by Step.
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Becoming a CertBridge trainer starts with an introduction.
            Here&apos;s an overview of how the process works.
          </p>
        </div>

        <div className="mt-14 border-t border-border">
          {partnershipSteps.map((step, index) => {
            const reversed = index % 2 !== 0;

            return (
              <div
                key={step.number}
                className="grid grid-cols-1 items-center gap-6 border-b border-border py-10 sm:gap-10 sm:py-14 lg:grid-cols-2 lg:gap-16"
              >
                <div className={reversed ? "lg:order-2" : "lg:order-1"}>
                  <div className="flex items-center gap-5 sm:gap-7">
                    <span className="text-6xl font-bold leading-none tracking-tighter text-primary/20 sm:text-7xl lg:text-8xl">
                      {step.number}
                    </span>

                    <h3 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div className={reversed ? "lg:order-1" : "lg:order-2"}>
                  <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Join Our Network
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to Put Your Expertise to Work?
            </h2>

            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              Join a network of professionals committed to developing skills,
              sharing knowledge and supporting organisational growth.
            </p>

            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Express Your Interest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
