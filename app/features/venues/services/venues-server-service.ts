import prisma from "@/lib/prisma";

import type {
  GetVenuesParams,
  Venue,
  VenuesResponse,
} from "../types/venue";

export async function getVenues(
  params: GetVenuesParams = {}
): Promise<VenuesResponse> {
  const {
    page = 1,
    pageSize = 20,
    search,
    status,
    country,
    city,
  } = params;

  const skip = (page - 1) * pageSize;

  const where = {
    ...(status ? { status } : {}),
    ...(country
      ? {
          country: {
            equals: country,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(city
      ? {
          city: {
            equals: city,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              city: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              country: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [venues, total] = await prisma.$transaction([
    prisma.venue.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    }),
    prisma.venue.count({
      where,
    }),
  ]);

  return {
    venues: venues as Venue[],
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}