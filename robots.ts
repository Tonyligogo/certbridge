import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers on public pages
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",      // client portal — private
          "/admin/",          // admin panel — private
          "/book/confirm",    // booking confirmation — no value to index
          "/api/",            // API routes
          "/_next/",          // Next.js internals
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}