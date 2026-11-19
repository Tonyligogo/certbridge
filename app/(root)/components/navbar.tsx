'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

/* ── Nav links ─────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Courses",      href: "/courses" },
  { label: "How It Works", href: "/how-it-works" },
  // { label: "About",        href: "/about" },
  { label: "Contact",      href: "/contact" },
] as const;

/* ── Helpers ───────────────────────────────────────────── */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function Navbar() {
     const pathname = usePathname();
     const [open, setOpen] = useState(false);
     const drawerRef  = useRef<HTMLDivElement>(null);
  return (
    <nav className="flex items-center justify-between gap-5 h-20 px-4 md:px-6">
        <Link href='/'>
          <Image
            src="/Logo.png"
            alt="CertBridge Global Logo"
            width={500}
            height={150}
            className="h-auto w-full max-w-55 object-contain"
          />
        </Link>
            <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <DesktopLink
                  href={link.href}
                  label={link.label}
                  active={isActive(pathname, link.href)}
                />
              </li>
            ))}
          </ul>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className={cn(
                "text-sm font-medium px-4 py-2 transition-all duration-200",
              )}
            >
              Log In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold px-5 py-2 rounded-lg bg-primary text-white transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          </div>
           {/* Mobile hamburger */}
          <Button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            size='icon'
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative"
          >
            {/* Animated icon swap */}
            <span
              className={cn(
                "absolute transition-all duration-100",
                open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
              )}
            >
              <X size={20} strokeWidth={2} />
            </span>
            <span
              className={cn(
                "absolute transition-all duration-100",
                open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
              )}
            >
              <Menu size={20} strokeWidth={2} />
            </span>
          </Button>
          {/* ── Mobile drawer ────────────────────────────── */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 border right-0 z-50 w-[min(320px,100vw)] md:hidden",
          "flex flex-col",
          "bg-white",
          "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer close button */}
        <div className="flex justify-end p-4 border-b">
          <Button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            size='icon'
          >
            <X size={18} strokeWidth={2} />
          </Button>
        </div>

        {/* Drawer links */}
        <ul className="flex-1 overflow-y-auto px-4 py-6 space-y-1" role="list">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} onClick={()=>setOpen(false)}>
              <MobileLink
                href={link.href}
                label={link.label}
                active={isActive(pathname, link.href)}
                index={i}
              />
            </li>
          ))}
        </ul>

        {/* Drawer CTAs */}
        <div className="px-4 pb-8 pt-4 border-t space-y-3">
          <Link
            href="/sign-in"
            className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium bg-primary text-white transition-all duration-200 hover:scale-105"
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary transition-all duration-200 hover:scale-105"
          >
            Get Started
            <ChevronRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

/* Desktop nav link */
function DesktopLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-lg",
        "transition-all",
        !active && [
          "hover:bg-secondary",
        ],
        active && [
          "text-white",
          "bg-primary",
        ]
      )}
    >
      {label}
    </Link>
  );
}

/* Mobile nav link */
function MobileLink({
  href,
  label,
  active,
  index,
}: {
  href: string;
  label: string;
  active: boolean;
  index: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between px-4 py-3.5 rounded-xl",
        "text-sm font-medium",
        active && "text-white bg-primary"
      )}
    >
      <span className="flex items-center gap-3">
        {label}
      </span>

      <ChevronRight
        size={15}
        strokeWidth={2}
        className="transition-all duration-200"
      />
    </Link>
  );
}