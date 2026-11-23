"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export interface DeliveryFormat {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  orientation: "horizontal" | "vertical";
}

const DELIVERY_FORMATS: DeliveryFormat[] = [
  {
    id: "online",
    title: "Online Training",
    subtitle:
      "Live, interactive training with our expert instructors, fully accessible from any location via a secure online platform.",
    imageUrl:
      "https://images.pexels.com/photos/8370484/pexels-photo-8370484.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt:
      "Online corporate training session with instructor presenting on a video call",
    orientation: "vertical",
  },
  {
    id: "client-site",
    title: "Client Site",
    subtitle:
      "Bring our trainers and content directly to your company's premises. Fully customized for your team and internal workspace.",
    imageUrl:
      "https://images.pexels.com/photos/9301900/pexels-photo-9301900.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt:
      "Instructor leading a corporate training presentation in a client boardroom",
    orientation: "vertical",
  },
  {
    id: "arranged-venue",
    title: "Arranged Venue",
    subtitle:
      "Host your training at a professional off-site location we arrange, complete with all technology and catering.",
    imageUrl:
      "https://images.pexels.com/photos/3906592/pexels-photo-3906592.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt:
      "Executive training seminar inside a luxury hotel conference room",
    orientation: "vertical",
  },
];

interface TrainingFormatsSectionProps {
  formats?: DeliveryFormat[];
}

export default function TrainingFormatsSection({
  formats = DELIVERY_FORMATS,
}: TrainingFormatsSectionProps) {
  // null means default state (first card expanded); number means hovered card index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const activeIndex = hoveredIndex !== null ? hoveredIndex : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/courses?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <section
      aria-labelledby="training-formats-heading"
      className="relative w-full overflow-hidden py-14 md:py-20"
    >
      {/* Decorative Background Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <svg
          width="1389"
          height="1479"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity=".3">
            <mask
              id="a"
              //   style="mask-type:alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1389"
              height="1479"
            >
              <path fill="#D9D9D9" d="M0 0h1389v1479H0z" />
            </mask>
            <g mask="url(#a)">
              <ellipse
                opacity=".5"
                cy="1007.5"
                rx="160"
                ry="160.5"
                fill="url(#b)"
              />
              <circle
                opacity=".5"
                cx="857.242"
                cy="375.085"
                r="91.111"
                fill="url(#c)"
              />
              <rect
                opacity=".5"
                x="-.664"
                y="273.555"
                width="386.866"
                height="386.866"
                rx="24"
                transform="rotate(-45 -.664 273.555)"
                fill="url(#d)"
              />
              <rect
                opacity=".5"
                x="288.662"
                y="1179.43"
                width="718.993"
                height="424.487"
                rx="32"
                transform="rotate(-45 288.662 1179.43)"
                fill="url(#e)"
              />
              <circle
                opacity=".5"
                cx="1389.13"
                cy="530.129"
                r="220.13"
                fill="url(#f)"
              />
              <circle
                opacity=".5"
                cx="1205.72"
                cy="1387.95"
                r="91.111"
                fill="url(#g)"
              />
            </g>
          </g>
          <defs>
            <linearGradient
              id="b"
              x1="-61.873"
              y1="861.062"
              x2=".372"
              y2="1167.92"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#86B3FE" />
              <stop offset=".993" stopColor="#F5F5FA" />
            </linearGradient>
            <linearGradient
              id="c"
              x1="766.131"
              y1="250.722"
              x2="857.242"
              y2="466.196"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#86B3FE" />
              <stop offset="1" stopColor="#F5F5FA" />
            </linearGradient>
            <linearGradient
              id="d"
              x1="117.967"
              y1="290.503"
              x2="192.769"
              y2="660.421"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#86B3FE" />
              <stop offset=".993" stopColor="#F5F5FA" />
            </linearGradient>
            <linearGradient
              id="e"
              x1="616.714"
              y1="1247.46"
              x2="920.97"
              y2="1639.19"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".091" stopColor="#F5F5FA" />
              <stop offset=".948" stopColor="#86B3FE" />
            </linearGradient>
            <linearGradient
              id="f"
              x1="1456.96"
              y1="604.614"
              x2="1389.13"
              y2="750.259"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#86B3FE" />
              <stop offset=".993" stopColor="#F5F5FA" />
            </linearGradient>
            <linearGradient
              id="g"
              x1="1242.3"
              y1="1427.85"
              x2="1140.55"
              y2="1333.41"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#86B3FE" />
              <stop offset="1" stopColor="#F5F5FA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-16 md:mb-32 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-[#B9D7FF]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#0044B8] sm:text-sm">
              Training Delivery Methods
            </span>

            <h2
              id="training-methods-heading"
              className="mt-4 text-3xl leading-[1.15] font-bold tracking-tight text-[#071D49] sm:text-4xl lg:text-[42px]"
            >
              Flexible Training,
               Designed Around Your
              Organisation
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed font-medium text-[#16346E] sm:text-base lg:pb-1">
            Whether online, at your workplace, or at an arranged venue, we make
            it easy to access professional training in the setting that works
            best for your team.
          </p>
        </div>

        <div className="flex flex-col gap-7 md:grid md:grid-cols-12 md:items-center md:gap-10 lg:gap-12">
          {/* 1. Headline (Shown first on mobile; top of left column on desktop) */}
          <div className="order-0 md:col-span-4 md:flex md:flex-col md:gap-8">
            <h2
              id="training-formats-heading"
              className="text-5xl font-medium lg:text-6xl leading-[1.2] tracking-[-0.03em]"
            >
              Learn.
              <br />
              Grow.
              <br />
              Lead.
            </h2>

            {/* Desktop Search CTA */}
            <form
              onSubmit={handleSubmit}
              className="hidden md:flex md:w-full md:max-w-md md:items-stretch md:overflow-hidden md:rounded-xl md:ring-1 md:ring-[#0F2C59]/10"
            >
              <label htmlFor="training-search-desktop" className="sr-only">
                Find your training
              </label>
              <input
                id="training-search-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your training..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-[#0B192C] placeholder-[#64748B] focus:outline-none lg:text-base"
              />

              <button
                type="submit"
                className="group flex shrink-0 items-center gap-2 border border-primary cursor-pointer bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary/90 lg:text-base"
              >
                Go
                <ArrowRight className="h-4 w-0 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:w-4 group-hover:opacity-100" />
              </button>
            </form>
          </div>

          {/* 2. Cards: Horizontal scroll on mobile (no scrollbar); Expandable flex row on desktop */}
          <div
            className="order-2 -mx-5 flex gap-3.5 overflow-x-auto px-5 pb-1 no-scrollbar md:order-none md:col-span-8 md:mx-0 md:flex-row md:gap-4 md:overflow-visible md:px-0 md:pb-0"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {formats.map((item, index) => {
              const isExpanded = index === activeIndex;

              return (
                <article
                  key={item.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  tabIndex={0}
                  className={[
                    "group relative h-[360px] w-[72vw] max-w-[300px] shrink-0 overflow-hidden rounded-[26px] bg-[#0B192C] transition-[flex-grow,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1453C6]",
                    "sm:h-[400px] sm:w-[270px]",
                    "md:h-[530px] md:w-auto md:max-w-none md:shrink",
                    isExpanded ? "md:flex-[2.4]" : "md:flex-[0.85]",
                  ].join(" ")}
                >
                  {/* Background Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Subtle gradient overlay for readable typography */}
                  <div
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute inset-0 transition-opacity duration-300",
                      isExpanded
                        ? "bg-gradient-to-t from-[#071324]/85 via-[#071324]/20 to-transparent"
                        : "bg-gradient-to-t from-[#071324]/80 via-[#071324]/30 to-transparent",
                    ].join(" ")}
                  />

                  {/* Expanded Card Bottom Overlay (Horizontal Text) */}
                  <div
                    className={[
                      "absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 sm:p-6 transition-all duration-300",
                      isExpanded
                        ? "md:translate-y-0 md:opacity-100"
                        : "md:pointer-events-none md:translate-y-3 md:opacity-0",
                    ].join(" ")}
                  >
                    <div>
                      <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs font-medium leading-snug text-white/90 sm:text-sm">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Collapsed Card Label (Desktop when shrunk) */}
                  <div
                    className={[
                      "hidden md:flex md:items-end md:justify-center md:transition-opacity md:duration-300",
                      item.orientation === "vertical" &&
                        "md:absolute md:inset-y-4 md:text-lg md:z-10 md:w-16 md:h-fit md:bg-primary md:py-4 md:backdrop-blur-xs",
                      isExpanded
                        ? "md:opacity-0 md:pointer-events-none"
                        : "md:opacity-100",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "whitespace-nowrap font-semibold tracking-wide text-white",
                        item.orientation === "vertical" &&
                          "[writing-mode:vertical-rl] rotate-180",
                      ].join(" ")}
                    >
                      {item.title}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 3. CTA (Shown last on mobile; already inside left column on desktop) */}
          <div className="order-3 md:hidden">
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-stretch overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(15,44,89,0.08)] ring-1 ring-[#0F2C59]/10"
            >
              <label htmlFor="training-search-mobile" className="sr-only">
                Find your training
              </label>
              <input
                id="training-search-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your training..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-[#0B192C] placeholder-[#64748B] focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#1453C6] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0E3E99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1453C6] focus-visible:ring-offset-2"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
