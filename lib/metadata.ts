import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Certbridge Global";

interface PageMetadataOptions {
  title: string;
  description: string;
  /** Path relative to root, e.g. "/courses" or "/courses/leadership-fundamentals" */
  path: string;
  /** Optional override image. Defaults to /og-image.png */
  image?: string;
  /** Set true for pages that should NOT be indexed (e.g. booking confirmation) */
  noIndex?: boolean;
}

/**
 * Call this in each page.tsx to generate consistent, SEO-complete metadata.
 *
 * @example
 * // app/courses/page.tsx
 * export const metadata = generatePageMetadata({
 *   title: "Browse Courses",
 *   description: "Explore 200+ professional training courses...",
 *   path: "/courses",
 * });
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image = "/og-image.png",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url,
      siteName,
      title: `${title} | ${siteName}`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteName}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@trainhubke",
      title: `${title} | ${siteName}`,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}