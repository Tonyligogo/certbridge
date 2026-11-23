
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  MessageSquareText,
  UserRoundPlus,
} from "lucide-react";

const actions = [
  {
    number: "01",
    title: "Talk to Our Team",
    description:
      "Have a training need or need help finding the right programme? Speak with our team and let's explore the best solution for your organisation.",
    link: "/contact",
    linkText: "Contact our team",
    icon: MessageSquareText,
    featured: true,
  },
  {
    number: "02",
    title: "Explore Our Courses",
    description:
      "Browse our training catalogue, discover available programmes, and find learning opportunities that match your team's development goals.",
    link: "/courses",
    linkText: "Browse courses",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Create Your Account",
    description:
      "Get started with CertBridge Global. Create an account to manage your training bookings and keep track of your learning engagements.",
    link: "/sign-up",
    linkText: "Get started",
    icon: UserRoundPlus,
  },
];

const ActionCTA = () => {
  return (
    <section className="w-full bg-background px-4 pb-16 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-14 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-[#B9D7FF]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#0044B8] sm:text-sm">
              Get Started
            </span>

            <h2 className="mt-4 text-3xl leading-[1.15] font-bold tracking-tight text-[#071D49] sm:text-4xl lg:text-[42px]">
              Your Next Step Starts Here
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed font-medium text-[#16346E] sm:text-base lg:pb-1">
            Whether you&apos;re ready to book training or simply exploring your
            options, we&apos;re here to help you move forward.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <div
                key={action.number}
                className={`group relative flex min-h-[330px] flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                  action.featured
                    ? "border-primary bg-primary text-white"
                    : "border-slate-100 bg-[#F7FAFF] hover:border-primary/20"
                }`}
              >
                {/* Decorative background */}
                {action.featured && (
                  <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-white/[0.06]" />
                )}

                <div className="relative flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      action.featured
                        ? "bg-white/10 text-white"
                        : "bg-[#E5EFFF] text-primary"
                    }`}
                  >
                    <Icon size={26} strokeWidth={1.8} />
                  </div>

                  <span
                    className={`text-sm font-semibold tracking-wider ${
                      action.featured ? "text-blue-200" : "text-blue-300"
                    }`}
                  >
                    {action.number}
                  </span>
                </div>

                <div className="relative mt-10 flex-grow">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {action.title}
                  </h3>

                  <p
                    className="mt-4 text-sm leading-7 sm:text-base"
                  >
                    {action.description}
                  </p>
                </div>

                <div
                  className={`relative mt-8 border-t pt-5 ${
                    action.featured ? "border-white/15" : "border-blue-100"
                  }`}
                >
                  <Link
                    href={action.link}
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-all duration-200 ${
                      action.featured
                        ? "text-white hover:text-blue-200"
                        : "text-primary/80 hover:text-primary"
                    }`}
                  >
                    {action.linkText}
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActionCTA;
