import prisma from "../prisma";

const courseInclude = {
  category: true,
  audiences: true,
  modules: true,
  pricing: true,
};

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: courseInclude,
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: courseInclude,
  });
}

export async function getAllCourses() {
  return prisma.course.findMany({
    include: courseInclude,
  });
}

export async function getCourseByCategory(categoryId: string) {
  return prisma.course.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
    },
    include: courseInclude,
  });
}

export async function getFeaturedCourses() {
  return prisma.course.findMany({
    where: {
      featured: true,
      status: "PUBLISHED",
    },
    include: courseInclude,
  });
}

export async function getPopularCourses() {
  return prisma.course.findMany({
    where: {
      isPopular: true,
      status: "PUBLISHED",
    },
    include: courseInclude,
  });
}