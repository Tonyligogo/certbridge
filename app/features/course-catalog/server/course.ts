import prisma from "@/lib/prisma";
import { CourseLevel } from "../types/catalogue";

interface GetCatalogueCoursesOptions {
  q?: string;
  categories?: string[];
  audiences?: string[];
  levels?: CourseLevel[];
  featured?: boolean;
  popular?: boolean;
}

export async function getCatalogueCourses({
  q,
  categories = [],
  audiences = [],
  levels = [],
  featured,
  popular,
}: GetCatalogueCoursesOptions = {}) {
  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",

      ...(q
        ? {
            title: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {}),

      ...(categories.length
        ? {
            categoryId: {
              in: categories,
            },
          }
        : {}),

      ...(audiences.length
        ? {
            audiences: {
              some: {
                id: {
                  in: audiences,
                },
              },
            },
          }
        : {}),

      ...(levels.length
        ? {
            level: {
                in: levels,
            },
            }
        : {}),

      ...(featured
        ? {
            featured:true,
          }
        : {}),

      ...(popular
        ? {
            isPopular: true,
          }
        : {}),
    },

    include: {
      category: true,
      audiences: true,
      modules: true,
      pricing: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return courses.map((course) => ({
    ...course,

    pricing: course.pricing
      ? {
          ...course.pricing,
          amount: course.pricing.amount.toNumber(),
        }
      : null,
  }));
}