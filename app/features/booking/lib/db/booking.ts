import prisma from "../../../../../lib/prisma";

export const bookingInclude = {
  course: {
    include: {
      category: true,
      audiences: true,
      modules: true,
      pricing: true,
    },
  },

  profile: true,

  participants: {
    include: {
      participant: true,
    },
  },
};

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
    include: bookingInclude,
  });
}

export async function getBookingByReference(reference: string) {
  return prisma.booking.findUnique({
    where: {
      reference,
    },
    include: bookingInclude,
  });
}