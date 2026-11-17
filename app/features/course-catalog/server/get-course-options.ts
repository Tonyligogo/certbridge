
import prisma from "@/lib/prisma";

interface GetCourseOptionsParams {
  search?: string;
  limit?: number;
}

export async function getCourseOptions({
  search = "",
  limit = 20,
}: GetCourseOptionsParams = {}) {
  const safeLimit = Math.min(
    30,
    Math.max(1, Math.floor(limit)),
  );

  const courses = await prisma.course.findMany({
    where: {

      ...(search.trim()
        ? {
            title: {
              contains: search.trim(),
              mode: "insensitive" as const,
            },
          }
        : {}),
    },

    select: {
      id: true,
      title: true,
      level: true,
      durationDays: true,
    },

    orderBy: {
      title: "asc",
    },

    take: safeLimit,
  });

  return courses;
}
