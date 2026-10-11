import prisma from "@/lib/prisma";
import { CourseLevel } from "../types/catalogue";
import { getServerSession } from "@/lib/get-server-session";
import { CourseStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

interface GetCatalogueCoursesOptions {
  q?: string;
  categories?: string[];
  audiences?: string[];
  levels?: CourseLevel[];
  featured?: boolean;
  popular?: boolean;
  page?: number;
  limit?: number;
}

export async function getCatalogueCourses({
  q,
  categories = [],
  audiences = [],
  levels = [],
  featured,
  popular,
  page = 1,
  limit = 12,
}: GetCatalogueCoursesOptions = {}) {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === "admin";
  const safePage = Number.isFinite(page)
    ? Math.max(1, Math.floor(page))
    : 1;

  const safeLimit = Number.isFinite(limit)
    ? Math.min(48, Math.max(1, Math.floor(limit)))
    : 12;
  const statusFilter = isAdmin ? {} : { status: CourseStatus.PUBLISHED };

  const where: Prisma.CourseWhereInput = {
      ...statusFilter,

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
    }

  const total = await prisma.course.count({ where });

  const totalPages = Math.max(
    1,
    Math.ceil(total / safeLimit)
  );

  // Handles a page number greater than the last page.
  const currentPage = Math.min(safePage, totalPages);
  const courses = await prisma.course.findMany({
    where,

    include: {
      category: true,
      audiences: true,
      modules: true,
      pricing: true,
    },

    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * safeLimit,
    take: safeLimit,
  });

  return {
    courses: courses.map((course) => ({
      ...course,
      pricing: course.pricing.map((p) => ({
        ...p,
        amount: p.amount.toNumber(),
      })),
    })),

    pagination: {
      page: currentPage,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}