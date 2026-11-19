import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "CertBridge Global";
const siteDescription =
  "Discover professional training programmes for individuals and organisations. CertBridge Global connects businesses with relevant training expertise and coordinated learning experiences.";

/* ── Root Metadata ──────────────────────────────────────── */
export const metadata: Metadata = {
  /* ── Basic ── */
  metadataBase: new URL(siteUrl),

  title: {
    default: `${siteName} | Corporate Training Solutions`,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,
  applicationName: siteName,

  keywords: [
    "corporate training Kenya",
    "professional development Nairobi",
    "leadership training Kenya",
    "employee training courses",
    "online training Kenya",
    "on-site training Nairobi",
    "compliance training Kenya",
    "IT training courses Kenya",
    "group training Kenya",
    "CertBridge Global",
  ],

  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,

  /* ── Canonical & alternates ── */
  alternates: {
    canonical: "/",
  },

  /* ── Open Graph ── */
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName,
    title: `${siteName} | Corporate Training Solutions`,
    description: siteDescription,
    images: [
      {
        url: "/images/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "CertBridge Global - Corporate Training Solutions",
        type: "image/png",
      },
    ],
  },

  /* ── Twitter / X ── */
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Corporate Training Solutions`,
    description: siteDescription,
    images: ["/images/brand/og-image.png"],
    // Add site and creator only when the handles are verified.
    // site: "@certbridgeglobal",
    // creator: "@certbridgeglobal",
  },

  /* ── Robots ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Icons ── */
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      // { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  /* ── Web app manifest ── */
  manifest: "/site.webmanifest",

  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
