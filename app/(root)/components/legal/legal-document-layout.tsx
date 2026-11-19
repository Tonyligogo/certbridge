
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface LegalSectionLink {
  id: string;
  title: string;
}

interface LegalDocumentLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSectionLink[];
  children: React.ReactNode;
}

export function LegalDocumentLayout({
  title,
  description,
  lastUpdated,
  sections,
  children,
}: LegalDocumentLayoutProps) {
  const isMobile = useIsMobile();

  const [activeSection, setActiveSection] = useState(
    sections[0]?.id ?? ""
  );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  const handleNavigation = (id: string) => {
    setActiveSection(id);
    setMobileNavOpen(false);
  };

  const navigation = () => (
    <nav
      aria-label="Privacy policy sections"
      className="space-y-1"
    >
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "location" : undefined}
            onClick={() => handleNavigation(section.id)}
            className={`
              group flex items-start gap-2.5 rounded-lg px-3 py-2.5
              text-[13px] leading-5 transition-colors
              ${
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <span
              className={`
                mt-0.5 shrink-0 font-mono text-[10px]
                ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/60"
                }
              `}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span>{section.title}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <header className="mb-12 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />

            <span className="text-xs font-medium text-muted-foreground">
              CertBridge Global / Legal
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>Last updated: {lastUpdated}</span>
            <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
            <span>CERTBRIDGE GLOBAL</span>
          </div>
        </header>

        {/* Mobile navigation */}
        {isMobile && (
          <div className="mb-8">
            <Sheet
              open={mobileNavOpen}
              onOpenChange={setMobileNavOpen}
            >
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                >
                  <Menu className="h-4 w-4" />
                  On this page
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex w-[320px] flex-col overflow-hidden p-0 sm:w-90"
              >
                <SheetHeader className="border-b px-5 py-5 text-left">
                  <SheetTitle className="text-base">
                    On this page
                  </SheetTitle>

                  <p className="text-xs text-muted-foreground">
                    Navigate to a section of our Privacy Policy.
                  </p>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                  {navigation()}
                </div>

                <div className="border-t px-5 py-4">
                  <p className="text-xs text-muted-foreground">
                    CERTBRIDGE GLOBAL
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_minmax(0,780px)] lg:gap-16 xl:grid-cols-[260px_minmax(0,820px)]">
          {/* Desktop sidebar */}
          {!isMobile && (
            <aside>
              <div className="sticky top-24">
                <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  On this page
                </p>

                <div className="max-h-[calc(100vh-130px)] overflow-y-auto pr-2">
                  {navigation()}
                </div>
              </div>
            </aside>
          )}

          {/* Document */}
          <main className="min-w-0">
            <article className="legal-document">
              {children}
            </article>

            <div className="mt-12 rounded-xl border bg-muted/30 p-6 sm:p-8">
              <h2 className="text-lg font-semibold">
                Have a privacy question?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                If you have questions about how we handle your
                personal information, our team is available to help.
              </p>

              <Link
                href="mailto:info@certbridgeglobal.com"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Contact us at info@certbridgeglobal.com
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
