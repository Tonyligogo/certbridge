import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Course slugs — replace with a real DB/CMS fetch when ready
const courseSlugs = [
  "leadership-management-fundamentals",
  "data-analysis-excel",
  "health-safety-workplace",
  "customer-service-excellence",
  "financial-management-non-finance",
  "project-management-fundamentals",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /* ── Static pages ── */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: now,
      changeFrequency: "daily",    // new courses added regularly
      priority: 0.9,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  /* ── Dynamic course pages ── */
  const coursePages: MetadataRoute.Sitemap = courseSlugs.map((slug) => ({
    url: `${siteUrl}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...coursePages];
}