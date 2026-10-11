import prisma from "@/lib/prisma";
import { landingCourseSelect, serializeLandingCourse } from "../db/LandingCourseSelect";

export async function getLandingPageData() {
  const [
    featuredCourses,
    popularCourses,
    categories,
    audiences,
    courseCount,
    categoryCount,
  ] = await Promise.all([
    // Featured courses
    prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
        category: {
          isActive: true,
        },
      },
      select: landingCourseSelect,
      take: 6,
      orderBy: {
        updatedAt: "asc",
      },
    }),

    // Popular courses
    prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        isPopular: true,
        category: {
          isActive: true,
        },
      },
      select: landingCourseSelect,
      take: 6,
      orderBy: {
        updatedAt: "asc",
      },
    }),

    // Categories with published courses
    prisma.courseCategory.findMany({
      where: {
        isActive: true,
        courses: {
          some: {
            status: "PUBLISHED",
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,

        _count: {
          select: {
            courses: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      take: 8,
      orderBy: {
        name: "asc",
      },
    }),

    // Audiences with published courses
    prisma.courseAudience.findMany({
      where: {
        courses: {
          some: {
            status: "PUBLISHED",
            category: {
              isActive: true,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,

        _count: {
          select: {
            courses: {
              where: {
                status: "PUBLISHED",
                category: {
                  isActive: true,
                },
              },
            },
          },
        },
      },
      take: 8,
      orderBy: {
        name: "asc",
      },
    }),

    // Total published courses
    prisma.course.count({
      where: {
        status: "PUBLISHED",
        category: {
          isActive: true,
        },
      },
    }),

    // Total active categories with published courses
    prisma.courseCategory.count({
      where: {
        isActive: true,
        courses: {
          some: {
            status: "PUBLISHED",
          },
        },
      },
    }),
  ]);

  return {
    featuredCourses: featuredCourses.map(serializeLandingCourse),
  popularCourses: popularCourses.map(serializeLandingCourse),
    categories: categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    courseCount: category._count.courses,
  })),

  audiences: audiences.map((audience) => ({
    id: audience.id,
    name: audience.name,
    slug: audience.slug,
    courseCount: audience._count.courses,
  })),

  stats: {
    courses: courseCount,
    categories: categoryCount,
  },
  };
}