import prisma from "@/lib/prisma";
import { landingCourseSelect } from "./LandingCourseSelect";

export const getLandingFeaturedCourses = await prisma.course.findMany({
  where: {
    status: "PUBLISHED",
    featured: true,
  },
  select: landingCourseSelect,
  take: 6,
});

export const getLandingPopularCourses = await prisma.course.findMany({
  where: {
    status: "PUBLISHED",
    isPopular: true,
  },
  select: landingCourseSelect,
  take: 6,
});