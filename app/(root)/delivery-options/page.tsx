
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const deliveryOptions = [
  {
    number: "01",
    title: "Online Training",
    tagline: "Professional training, wherever your team is.",
    description:
      "Our online training option allows participants to access professional training remotely, without the need to travel to a physical training venue.",
    details:
      "It's a convenient option for organisations with distributed teams, participants in different locations, or those looking to minimise travel and venue arrangements.",
    benefits: [
      "Attend training remotely.",
      "Convenient for geographically distributed teams.",
      "No physical training venue required.",
    ],
  },
  {
    number: "02",
    title: "Client-Site Training",
    tagline: "Bring the training directly to your workplace.",
    description:
      "With client-site training, the training takes place at your organisation's premises. We select a trainer with the expertise and experience to deliver your chosen programme effectively.",
    details:
      "This option allows your team to learn together in a familiar environment while avoiding the need to travel to an external venue. We coordinate the training arrangements around your organisation's preferred schedule.",
    benefits: [
      "Training conducted at your premises.",
      "Convenient for teams training together.",
      "Arrangements coordinated around your organisation's needs.",
    ],
  },
  {
    number: "03",
    title: "Arranged-Venue Training",
    tagline: "A suitable training space, arranged for you.",
    description:
      "If your organisation would prefer to hold training away from its own premises, CertBridge can arrange a suitable training venue.",
    details:
      "We select a trainer with the relevant expertise for your programme and coordinate the venue and training arrangements, giving your participants a dedicated environment for learning.",
    benefits: [
      "A suitable training venue arranged for you.",
      "Ideal when your organisation doesn't have an appropriate training space.",
      "Training arrangements coordinated by CertBridge.",
    ],
  },
];

export default function DeliveryOptionsPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Training delivered your way.
          </h1>

          <p className="mt-6 max-w-2xl leading-8">
            Every organisation has different training needs, schedules and
            working environments. At CertBridge Global, we offer flexible
            delivery options to make it easier for your team to access the
            training they need.
          </p>
        </div>
      </section>

      {/* Delivery options */}
      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="space-y-20 sm:space-y-28">
          {deliveryOptions.map((option) => {
            return (
              <article
                key={option.number}
                className="bg-white border border-blue-100 rounded-2xl p-8"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {option.title}
                  </h2>
                  <p className="mt-5 leading-7 sm:leading-8">
                    {option.description}
                  </p>

                  <p className="mt-4 leading-7 sm:leading-8">
                    {option.details}
                  </p>

                  <ul className="mt-7 space-y-4">
                    {option.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-3 text-sm text-foreground sm:text-base"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Choosing a delivery option */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Let&apos;s find the right arrangement for your team.
            </h2>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              You can indicate your preferred delivery mode when booking a
              course. If you&apos;re unsure, include your requirements in the
              booking form and our team will help coordinate the arrangements.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Make an Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
