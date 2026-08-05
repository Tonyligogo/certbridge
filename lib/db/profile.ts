import prisma from "../prisma";

export async function getProfileByUserId(userId: string) {
  return prisma.profile.findUnique({
    where: {
      userId,
    },
  });
}