
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";

const requirementSections = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Professional Qualifications",
    subtitle: "Relevant knowledge. Recognised expertise.",
    description:
      "We value trainers with an educational and professional foundation relevant to the subjects they deliver.",
    items: [
      "Academic qualifications relevant to the training subject.",
      "Professional certifications and industry credentials.",
      "Specialist qualifications in technical or professional disciplines.",
      "Relevant licences or registrations, where applicable.",
    ],
  },
  {
    number: "02",
    icon: BriefcaseBusiness,
    title: "Professional Experience",
    subtitle: "Experience that goes beyond theory.",
    description:
      "Effective training connects knowledge with the realities of the workplace. We look for professionals who can bring practical insight into the learning experience.",
    items: [
      "Relevant industry or professional experience.",
      "Experience applying subject knowledge in real-world environments.",
      "Demonstrated expertise in a professional discipline.",
      "Previous corporate or professional training experience, where available.",
    ],
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Training & Facilitation Skills",
    subtitle: "Knowledge is important. Communication makes it effective.",
    description:
      "A strong trainer can make complex ideas easier to understand and create an environment where participants can actively engage with what they are learning.",
    items: [
      "Effective communication and presentation skills.",
      "Ability to explain complex concepts clearly.",
      "Confidence facilitating group discussions and activities.",
      "Ability to engage participants with different experience levels.",
      "Ability to connect theory with practical applications.",
    ],
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Professional Attributes",
    subtitle: "The qualities behind great training.",
    description:
      "We value professionals who approach their work with integrity, responsibility and a genuine commitment to delivering quality learning experiences.",
    items: [
      "Professionalism and integrity.",
      "Reliability and commitment to agreed engagements.",
      "Strong interpersonal and relationship-building skills.",
      "Adaptability to different learning environments.",
      "Willingness to prepare, receive feedback and continuously improve.",
    ],
  },
];

const documentsToPrepare = [
  "A professional profile or updated CV.",
  "Copies or details of relevant academic qualifications.",
  "Professional certifications and industry credentials.",
  "A summary of your areas of expertise and specialisation.",
  "Details of relevant professional experience.",
  "Previous training or facilitation experience, where available.",
];

const assessmentFactors = [
  {
    icon: Award,
    title: "Qualifications",
    description:
      "The academic, technical and professional credentials relevant to the subject.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Practical Experience",
    description:
      "Your professional background and ability to apply knowledge in real working environments.",
  },
  {
    icon: Lightbulb,
    title: "Subject Expertise",
    description:
      "The depth and relevance of your knowledge in the specific training area.",
  },
  {
    icon: Users,
    title: "Training Capability",
    description:
      "Your ability to communicate knowledge and facilitate meaningful learning.",
  },
];

export default function TrainerRequirementsPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Bring Your Expertise.
              <span className="mt-2 block text-primary">
                Deliver Meaningful Learning.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
              We work with professionals who combine relevant qualifications,
              practical experience and the ability to engage and develop
              others. Explore the qualities and credentials we look for in
              trainers partnering with CertBridge Global.
            </p>

            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Express Your Interest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Our Standards
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What We Look for in Our Trainers
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              The quality of a training programme depends greatly on the
              person delivering it. At CertBridge Global, we aim to work with
              trainers who understand their subjects and can translate that
              knowledge into practical, valuable learning experiences.
            </p>
            <p>
              Our assessment considers a combination of qualifications,
              professional experience, subject expertise and facilitation
              ability. The specific requirements may vary depending on the
              training programme and the needs of the organisation.
            </p>
          </div>
        </div>
      </section>

      {/* Core requirements */}
      <section className="bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Key Requirements
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              The Foundations of Effective Training
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              These are the key areas we consider when assessing trainer
              suitability. Not every programme requires the same combination
              of qualifications and experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {requirementSections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.number}
                  className="rounded-xl border border-border bg-background p-7 md:p-9"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold tracking-widest text-muted-foreground/60">
                      {section.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {section.title}
                  </h3>
                  <p className="mt-2 font-medium text-primary">
                    {section.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {section.description}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documents to prepare */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-6 w-6" />
            </div>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Before Getting in Touch
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What You Should Be Prepared to Share
            </h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              If you are interested in working with CertBridge Global, having
              the following information ready will help us understand your
              professional background and areas of expertise.
            </p>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              This is a guide to the information that may be useful when
              contacting our team. It is not a formal application process.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-7 md:p-9">
            <h3 className="text-lg font-semibold">
              Information to have ready
            </h3>

            <ul className="mt-7 space-y-5">
              {documentsToPrepare.map((item) => (
                <li key={item} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Assessment process */}
      <section className="bg-muted/30 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Trainer Assessment
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Understanding Your Suitability
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              We consider your overall professional profile and how well it
              aligns with the requirements of specific training programmes.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {assessmentFactors.map((factor) => {
              const Icon = factor.icon;

              return (
                <div
                  key={factor.title}
                  className="rounded-xl border border-border bg-background p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-semibold">{factor.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-7 text-muted-foreground">
            Requirements may differ depending on the subject area, programme
            level and organisation&apos;s training needs. Previous formal training
            experience can be valuable, but practical expertise and the
            ability to facilitate learning are also important considerations.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="rounded-2xl bg-primary px-7 py-14 text-center text-primary-foreground md:px-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            Partner With CertBridge
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Have the Expertise We&apos;re Looking For?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-primary-foreground/80">
            We&apos;d be glad to learn more about your professional background and
            areas of expertise. Get in touch with our team to explore the
            possibility of working together.
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
