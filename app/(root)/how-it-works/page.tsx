import { generatePageMetadata } from "@/lib/metadata";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = generatePageMetadata({
  title: "How It Works",
  description: "Browse, book, and let CertBridge source a vetted trainer and handle all logistics. See our 4-step process for delivering corporate training in Kenya.",
  path: "/how-it-works",
});

const steps = [
  {
    number: "01",
    title: "Find a training programme",
    description:
      "Browse our course catalogue and explore the training programmes available for your organisation. Once you find a programme that meets your needs, you can proceed to book it directly.\n\nCan't find exactly what you're looking for? Submit an enquiry describing the training programme you need. We'll work with you to explore the options and make it happen.",
  },
  {
    number: "02",
    title: "Complete the booking",
    description:
      "Book your chosen programme directly through our booking form. Tell us how you'd like the training delivered, your preferred start and end dates, the number of participants, and your organisation and contact details. You can also include any additional requirements or special instructions.",
  },
  {
    number: "03",
    title: "We coordinate the resources",
    description:
      "Once we receive your booking, our team gets to work sourcing a suitable trainer and, where necessary, arranging a training venue. We coordinate the schedule and other delivery arrangements to ensure everything is in place for your training.",
  },
  {
    number: "04",
    title: "Receive your quotation",
    description:
      "After the necessary resources have been sourced and arrangements made, we'll prepare and send you a quotation for your review.",
  },
  {
    number: "05",
    title: "Confirm your booking",
    description:
      "Review your quotation and make the required advance payment. Once payment and the necessary arrangements are confirmed, your training booking is officially confirmed.",
  },
  {
    number: "06",
    title: "Attend your training",
    description:
      "Your training takes place according to the agreed schedule and delivery mode. Whether online, at your organisation's premises, or at an arranged venue, we'll coordinate the arrangements to ensure a smooth training experience.",
  },
  {
    number: "07",
    title: "Receive your certificates",
    description:
      "Upon successful completion of the programme requirements, participants receive certificates of participation. Awarding-body certificates may also be issued where applicable, subject to the relevant programme requirements.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-background">
      {/* Page heading */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            The CertBridge Process
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            How it Works
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Getting the right training for your organisation doesn&apos;t have to
            be complicated. Here&apos;s how we take you from choosing a programme
            to completing your training.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="border-t border-border">
          {steps.map((step, index) => {
            const isReversed = index % 2 !== 0;

            const heading = (
              <div className={`${isReversed ? 'md:text-right' : 'text-left'}`}>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-6xl font-bold leading-none text-gray-200 sm:text-7xl lg:text-[140px] ${isReversed ? 'text-right' : 'text-left'}`}
                >
                  {step.number}
                </span>
              </div>
            );

            const description = (
              <div className="max-w-xl">
                <h2 className="max-w-xs text-xl font-semibold leading-snug mb-2 text-foreground sm:text-2xl">
                  {step.title}
                </h2>
                {step.description.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="mb-4 last:mb-0 text-sm leading-7 sm:text-base sm:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            );

            return (
              <div
                key={step.number}
                className="grid grid-cols-1 items-center gap-6 border-b border-border py-12 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20"
              >
                {/* Desktop: alternate the actual column positions.
                    Mobile: heading always appears before description. */}
                <div className={isReversed ? "lg:order-2" : "lg:order-1"}>
                  {heading}
                </div>

                <div className={isReversed ? "lg:order-1" : "lg:order-2"}>
                  {description}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Need something different?
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Let&apos;s find the right training for you.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              If you can&apos;t find the programme you&apos;re looking for, or have a
              question about our training services, get in touch. We&apos;d be
              happy to explore how we can help.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Make an Inquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
