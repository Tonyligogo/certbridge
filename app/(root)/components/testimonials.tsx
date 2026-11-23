interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const LEFT_TESTIMONIALS: Testimonial[] = [
  {
    id: "alice",
    quote:
      "The training programmes are excellent, and the delivery was seamless. Our team came away more confident and better equipped to lead.",
    name: "Alice Wanjiku",
    role: "HR Manager",
    avatar: "/testimonials/alice.png",
  },
  {
    id: "james",
    quote:
      "From course selection to support, CertBridge Global made the whole process easy. The content is practical and highly relevant.",
    name: "James Ochieng",
    role: "Operations Director",
    avatar: "/testimonials/james.png",
  },
];

const RIGHT_TESTIMONIALS: Testimonial[] = [
  {
    id: "sophie",
    quote:
      "The platform is easy to use, and the trainers are top-notch. We've seen real improvement in our team's performance.",
    name: "Sophie Njoroge",
    role: "Learning Lead",
    avatar: "/testimonials/sophie.png",
  },
  {
    id: "peter",
    quote:
      "Reliable, professional, and results-driven. CertBridge Global is our trusted partner for corporate training.",
    name: "Peter Kimani",
    role: "Training Coordinator",
    avatar: "/testimonials/peter.png",
  },
];

const FEATURED_TESTIMONIAL = {
  quote:
    "CertBridge Global helped us build stronger capabilities across our team. The training was practical, engaging, and delivered with professionalism.",
  name: "Mary Akinyi",
  role: "Head of Learning & Development",
  avatar: "/testimonials/mary-avatar.png",
  heroImage: "/testimonials/mary.png",
};

function QuoteMark() {
  return (
    <svg
      className="h-6 w-7 text-[#0078d4]"
      viewBox="0 0 32 26"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.2 0v5.4c-3.1.8-5.1 3.1-5.4 6.6h5.4V26H0V14.3C0 5.7 4.7 1.1 13.2 0zm18.8 0v5.4c-3.1.8-5.1 3.1-5.4 6.6H32V26H18.8V14.3C18.8 5.7 23.5 1.1 32 0z" />
    </svg>
  );
}

function StandardTestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_12px_36px_-10px_rgba(15,42,92,0.07)] ring-1 ring-slate-100 sm:p-7">
      <div>
        <QuoteMark />
        <p className="mt-5 text-[15px] leading-relaxed font-normal text-[#0B1F44] sm:text-base">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      <div className="mt-6">
        <hr className="mb-4 border-slate-100" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={item.avatar}
              alt={item.name}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <h3 className="text-sm font-bold">{item.name}</h3>
              <p className="text-xs font-medium text-primary">
                {item.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative isolate w-full overflow-hidden bg-gradient-to-b from-[#F5F9FF] via-[#F2F7FF] to-[#EBF3FF] py-16 sm:py-20 lg:py-28"
    >
      {/* Decorative Background Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      >
        {/* Top-Left Sweeping Wave */}
        <svg
          viewBox="0 0 1440 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute -top-12 -left-16 h-[240px] w-[130%] sm:top-0 sm:left-0 sm:h-[340px] sm:w-full lg:h-[440px]"
        >
          <path
            d="M-100 0H720C520 45 260 115 -100 265V0Z"
            fill="url(#topLeftOuter)"
          />
          <path
            d="M-100 0H360C215 35 75 80 -100 165V0Z"
            fill="url(#topLeftInner)"
          />
          <defs>
            <linearGradient
              id="topLeftOuter"
              x1="0"
              y1="0"
              x2="450"
              y2="250"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DCEBFF" stopOpacity="0.85" />
              <stop offset="1" stopColor="#DCEBFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="topLeftInner"
              x1="-50"
              y1="0"
              x2="240"
              y2="160"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8BB9FF" stopOpacity="0.55" />
              <stop offset="1" stopColor="#B8D6FF" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bottom-Right Sweeping Wave */}
        <svg
          viewBox="0 0 1440 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute -right-16 -bottom-12 h-[260px] w-[130%] sm:right-0 sm:bottom-0 sm:h-[360px] sm:w-full lg:h-[460px]"
        >
          <path
            d="M1540 500H780C1020 445 1270 340 1540 130V500Z"
            fill="url(#bottomRightOuter)"
          />
          <path
            d="M1540 500H1080C1230 445 1385 375 1540 270V500Z"
            fill="url(#bottomRightInner)"
          />
          <defs>
            <linearGradient
              id="bottomRightOuter"
              x1="1440"
              y1="500"
              x2="960"
              y2="220"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D4E6FF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#D4E6FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="bottomRightInner"
              x1="1460"
              y1="500"
              x2="1150"
              y2="320"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#63A0FF" stopOpacity="0.65" />
              <stop offset="1" stopColor="#9EC5FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 md:mb-32 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-[#B9D7FF]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#0044B8] sm:text-sm">
              Client Testimonials
            </span>
            <h2
              id="testimonials-heading"
              className="mt-4 text-3xl leading-[1.15] font-bold tracking-tight text-[#071D49] sm:text-4xl lg:text-[42px]"
            >
              Trusted by Thousands of
              <br className="hidden sm:inline" /> Professionals and
              Organisations
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed font-medium text-[#16346E] sm:text-base lg:pb-1">
            See how businesses and professionals are achieving more with
            CertBridge Global.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-3 lg:items-stretch">
          {/* Left Column (2 Stacked Cards) */}
          <div className="flex flex-col gap-6">
            {LEFT_TESTIMONIALS.map((item) => (
              <StandardTestimonialCard key={item.id} item={item} />
            ))}
          </div>

          {/* Center Featured Card */}
          <article className="relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-b from-[#0A66E6] via-[#0645B5] to-[#03256C] p-6 text-white shadow-[0_20px_50px_-12px_rgba(3,37,108,0.35)] sm:min-h-[580px] sm:p-8">
            {/* Subtle Blue Geometric Curves Inside Card */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 600"
              fill="none"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
            >
              <circle cx="340" cy="110" r="240" fill="#3B82F6" />
              <circle cx="40" cy="480" r="260" fill="#021D54" />
            </svg>

            {/* Portrait Image */}
            <img
              src={FEATURED_TESTIMONIAL.heroImage}
              loading="lazy"
              alt="CertBridge Global Corporate Leader"
              className="absolute inset-x-0 top-4 mx-auto h-[78%] w-full object-cover object-top select-none"
            />

            {/* Bottom Navy Gradient Fade for Legibility */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#021C54] via-[#03246A]/95 to-transparent"
            />

            {/* Foreground Quote & Author */}
            <div className="relative z-10">
              <p className="text-base leading-relaxed font-medium text-white sm:text-[17px]">
                &ldquo;{FEATURED_TESTIMONIAL.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={FEATURED_TESTIMONIAL.avatar}
                    alt={FEATURED_TESTIMONIAL.name}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {FEATURED_TESTIMONIAL.name}
                    </h3>
                    <p className="text-xs leading-snug whitespace-pre-line text-white/60">
                      {FEATURED_TESTIMONIAL.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Right Column (2 Stacked Cards) */}
          <div className="flex flex-col gap-6">
            {RIGHT_TESTIMONIALS.map((item) => (
              <StandardTestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}