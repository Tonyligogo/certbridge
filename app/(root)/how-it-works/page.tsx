import { generatePageMetadata } from "@/lib/metadata";
import { Search, CalendarCheck, UserCheck, Award, ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";
import Link from "next/link";

export const metadata = generatePageMetadata({
  title: "How It Works",
  description: "Browse, book, and let CertBridge source a vetted trainer and handle all logistics. See our 4-step process for delivering corporate training in Kenya.",
  path: "/how-it-works",
});

const steps = [
  {
    Icon: Search,
    title: "Browse our catalogue",
    desc: "Explore 200+ courses across leadership, sales, technology, HR and more. Or tell us what you need and we'll design a custom programme.",
  },
  {
    Icon: CalendarCheck,
    title: "Submit a booking request",
    desc: "Choose your preferred format (online, on-site, or at a venue we arrange), group size, and ideal dates.",
  },
  {
    Icon: UserCheck,
    title: "We assign a vetted trainer",
    desc: "Within 24 hours, we match you with a qualified expert from our network and send you a tailored proposal.",
  },
  {
    Icon: Award,
    title: "Training is delivered",
    desc: "We coordinate logistics, materials and venue. Your team learns, gets certified, and you get a post-training report.",
  },
];

const benefits = [
  { Icon: ShieldCheck, title: "Vetted Trainers", desc: "Every trainer is interviewed, credentialed, and rated after each engagement." },
  { Icon: Clock, title: "24-Hour Response", desc: "We send a tailored proposal within one business day of your request." },
  { Icon: Users, title: "Any Group Size", desc: "From 1-on-1 executive coaching to 100+ person workshops." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-primary text-white py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            How It Works
          </span>
          <h1 className="mt-3 font-display text-5xl lg:text-6xl font-bold max-w-3xl">
            Training, end-to-end. Without the headache.
          </h1>
          <p className="mt-5 text-lg text-white/75 max-w-2xl">
            You tell us what your team needs. We do the rest — sourcing trainers,
            coordinating logistics, and delivering measurable outcomes.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 lg:px-10">
          <ol className="space-y-8">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="card-hover flex flex-col sm:flex-row gap-6 bg-white border border-blue-100 rounded-2xl p-8 shadow-sm"
              >
                <div className="shrink-0 flex sm:flex-col gap-4 items-center">
                  <div className="h-14 w-14 rounded-xl bg-primary text-white grid place-items-center">
                    <s.Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center font-display text-sm font-bold text-primary">
                    Step {i + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                    {s.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-4xl font-bold text-center text-text-primary mb-14">
            Why companies choose CertBridge Global
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 p-8 card-hover">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-primary grid place-items-center mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
                <p className="text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold">
            Let&apos;s plan your next training
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 px-7 py-4 bg-white text-primary rounded-xl font-semibold shadow-xl shadow-accent-green/25"
          >
            Submit a Request <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}