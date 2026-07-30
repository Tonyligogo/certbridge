'use client';
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

type Slide = {
  eyebrow: string;
  title: string;
  subtext: string;
  cta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  bg:
    | { type: "video"; src: string }
    | { type: "image"; src: string };
};

const slides: Slide[] = [
  {
    eyebrow: "Kenya's Leading Training Platform",
    title: "Professional Training, Arranged For You",
    subtext:
      "We source expert trainers, arrange the logistics, and deliver results — so you can focus on growing your team.",
    cta: { label: "Book a Training", to: "/contact" },
    secondaryCta: { label: "Browse Courses", to: "/courses" },
    bg: {
      type: "video",
      src: "https://www.pexels.com/download/video/8716579/",
    },
  },
  {
    eyebrow: "Online, On-Site, or At a Venue",
    title: "Training That Comes To You",
    subtext: "Choose the format that works for your team — we handle the rest.",
    cta: { label: "Explore Courses", to: "/courses" },
    bg: {
      type: "image",
      src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    },
  },
  {
    eyebrow: "For Teams of All Sizes",
    title: "From One Person to a Full Department",
    subtext:
      "Individual coaching or group workshops — we scale training to your exact needs.",
    cta: { label: "Get a Quote", to: "/contact" },
    bg: {
      type: "image",
      src: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
    },
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);

  const go = useCallback(
    (n: number) => setActive((n + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[calc(100vh-5rem)] min-h-150 w-full overflow-hidden bg-slate-50">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== active}
        >
          {s.bg.type === "video" ? (
            <video
              src={s.bg.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={s.bg.src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-xs font-semibold tracking-wider text-white mb-6">
                {s.eyebrow}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
                {s.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/85 max-w-xl mb-10 leading-relaxed">
                {s.subtext}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={s.cta.to}
                  className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-xl font-semibold"
                >
                  {s.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {s.secondaryCta && (
                  <Link
                    href={s.secondaryCta.to}
                    className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-xl font-semibold "
                  >
                    {s.secondaryCta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={() => go(active - 1)}
        aria-label="Previous slide"
        className="hidden md:absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 md:grid place-items-center text-white hover:bg-white/20 transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => go(active + 1)}
        aria-label="Next slide"
        className="hidden md:absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 md:grid place-items-center text-white hover:bg-white/20 transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-10 bg-white" : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}