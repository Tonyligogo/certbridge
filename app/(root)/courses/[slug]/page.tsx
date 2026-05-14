// app/courses/[slug]/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { courses } from "@/lib/courses";
import CourseDetail from "./CourseDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// Next.js calls this at build/request time to get the metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the course — from your DB, CMS, or static data
//   const course = await getCourseBySlug(params.slug);
const { slug } = await params;
const course =
    courses.find((c) => c.slug === slug) ?? {
      slug: slug,
      title: "Leadership & Management Fundamentals",
      category: "Leadership",
      duration: "2 days",
      format: "Online, On-Site or Venue",
      level: "Beginner" as const,
      description:
        "Build the core skills every modern leader needs — from team dynamics to strategic decision making.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    };

  if (!course) {
    return generatePageMetadata({
      title: "Course Not Found",
      description: "This course could not be found.",
      path: `/courses/${slug}`,
      noIndex: true,
    });
  }

  return generatePageMetadata({
    title: course.title,
    description: course.description,
    path: `/courses/${slug}`,
  });
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}