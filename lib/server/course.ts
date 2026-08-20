import { cache } from "react";
import { getAllCourses } from "../db/course";
import { getServerSession } from "../get-server-session";
import prisma from "../prisma";

export async function requireAdmin() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return session;
}

export async function getCoursesServerSide() {
  return getAllCourses();
}

export const courseInclude = {
  category: true,
  audiences: true,
  modules: true,
  pricing: true,
};

export const getCourseBySlug = cache(
  async (slug: string) => {
    const course =  await prisma.course.findUnique({
      where: {
        slug,
      },
      include: courseInclude,
    });
  //   return courses.map((course) => ({
  //   ...course,

  //   pricing: course.pricing
  //     ? {
  //         ...course.pricing,
  //         amount: course.pricing.amount.toNumber(),
  //       }
  //     : null,
  // }));
    const updatedCourse = course ? {
      ...course,
      pricing: course.pricing
        ? {
            ...course.pricing,
            amount: course.pricing.amount.toNumber(),
          }
        : null,
    } : null;

    return updatedCourse;  

  },
);