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

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
        category: true,
        audiences: true,
        modules: true,
        pricing: true,
      }
  });
}