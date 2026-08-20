import type { Metadata } from "next";

import { generatePageMetadata } from "@/lib/metadata";
import CourseDetail from "./CourseDetail";
import { getCourseBySlug } from "@/lib/server/course";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

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
    description: course.shortDescription,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);
  if (!course){
     return <div className="flex flex-col gap-3 text-center justify-center py-16">
    <p>It appears the course you are looking for is no longer offered!</p>
    <p>Please select another course <Link href="/courses" className="text-blue-500">here</Link>.</p>
  </div>
  }

  return <CourseDetail course={course} />;
}