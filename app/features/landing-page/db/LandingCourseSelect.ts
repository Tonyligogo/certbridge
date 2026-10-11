import { Prisma } from "@/generated/prisma/client";
import { LandingCourse } from "../types";

export const landingCourseSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  durationDays: true,
  certificateProvided: true,

  category: {
    select: {
      name: true,
      slug: true,
    },
  },

  pricing: {
    select: {
      amount: true,
      currency: true,
      deliveryMode: true,
    },
    orderBy: {
      amount: "asc",
    },
  },
} satisfies Prisma.CourseSelect;

export function serializeLandingCourse(
  course: Prisma.CourseGetPayload<{
    select: typeof landingCourseSelect;
  }>
): LandingCourse {
  const startingPrice = course.pricing[0] ?? null;

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription,
    durationDays: course.durationDays,
    certificateProvided: course.certificateProvided,

    category: course.category,

    startingPrice: startingPrice
      ? {
          amount: startingPrice.amount.toString(),
          currency: startingPrice.currency,
        }
      : null,
  };
}