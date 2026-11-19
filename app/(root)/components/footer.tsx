import Link from "next/link";
import { ArrowUpRight, Mail, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";

const footerSections = [
  {
    title: "Explore Training",
    links: [
      { label: "Browse Courses", href: "/courses" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Delivery Options", href: "/delivery-options" },
      { label: "Frequently Asked Questions", href: "/faqs" },
    ],
  },
  {
    title: "For Organisations",
    links: [
      { label: "Browse Training Programmes", href: "/courses" },
      { label: "Request an Enquiry", href: "/contact" },
      { label: "Contact Our Team", href: "/contact" },
    ],
  },
  {
    title: "Our Partners",
    links: [
      { label: "Become a Trainer", href: "/become-a-trainer" },
      { label: "Trainer Requirements", href: "/trainer-requirements" },
      { label: "Become a Venue Partner", href: "/become-a-venue-partner" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About CertBridge", href: "/about" },
      { label: "Quality Assurance", href: "/quality-assurance" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative isolate w-full overflow-hidden rounded-t-[40px] bg-primary text-white md:rounded-t-[56px]">
      <div className=" z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-10 md:pt-20 lg:px-12">
        {/* Brand and contact section */}
        <div className="flex flex-col justify-between gap-10 border-b border-white/20 pb-12 md:flex-row md:items-start md:pb-16">
          <div className="max-w-md">
            <Image
              src="/Logo.png"
              alt="CertBridge Global Logo"
              width={500}
              height={150}
              className="h-auto w-full max-w-[320px] object-contain"
            />

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">
              Connecting organisations with relevant training programmes and
              professional expertise to support meaningful learning and
              development.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:min-w-[260px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Get in touch
            </p>

            <a
              href="mailto:info@certbridgeglobal.com"
              className="group flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-white/60" />
              info@certbridgeglobal.com
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>

            <a
              href="tel:+254710507872"
              className="group flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 text-white/60" />
              +254 710 507 872
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>

            <Link
              href="/contact"
              className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Contact our team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Navigation links */}
        <div className="relative z-50 grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8 lg:py-16">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                {section.title}
              </h4>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-[13px] font-medium leading-5 text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-4 border-t border-white/20 pt-7 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CertBridge Global. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Oversized brand wordmark */}
        <div
          className="absolute bottom-0 z-0 w-full left-0 right-0 whitespace-nowrap text-center text-[18vw] tracking-[-0.05em] text-white/5"
          style={{
            fontWeight: 900,
          }}
        >
          CERTBRIDGE
        </div>
      </div>
    </footer>
  );
};

export default Footer;
