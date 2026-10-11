import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  BookingStatus,
  DeliveryMode,
  Prisma,
} from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/server/course";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = Math.max(
      1,
      Number.parseInt(pageParam || "1", 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(limitParam || "20", 10) || 20
      )
    );

    const skip = (page - 1) * limit;

    // --------------------------------------------------
    // Filters
    // --------------------------------------------------

    const search =
      searchParams.get("search")?.trim() || undefined;

    const statusParam =
      searchParams.get("status");

    const deliveryModeParam =
      searchParams.get("deliveryMode");

    const status =
      statusParam &&
      Object.values(BookingStatus).includes(
        statusParam as BookingStatus
      )
        ? (statusParam as BookingStatus)
        : undefined;

    const deliveryMode =
      deliveryModeParam &&
      Object.values(DeliveryMode).includes(
        deliveryModeParam as DeliveryMode
      )
        ? (deliveryModeParam as DeliveryMode)
        : undefined;

    const createdFrom =
      searchParams.get("createdFrom");

    const createdTo =
      searchParams.get("createdTo");

    // --------------------------------------------------
    // Where
    // --------------------------------------------------

    const where: Prisma.BookingWhereInput = {
      ...(status ? { status } : {}),

      ...(deliveryMode
        ? { deliveryMode }
        : {}),

      ...(createdFrom || createdTo
        ? {
            createdAt: {
              ...(createdFrom
                ? {
                    gte: new Date(createdFrom),
                  }
                : {}),

              ...(createdTo
                ? {
                    lte: new Date(createdTo),
                  }
                : {}),
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                reference: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                contactName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                contactEmail: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                organizationName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                course: {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };

    // --------------------------------------------------
    // Query
    // --------------------------------------------------

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          reference: true,

          organizationName: true,
          contactName: true,

          status: true,
          deliveryMode: true,

          participantCount: true,

          preferredStartDate: true,
          preferredEndDate: true,

          course: {
            select: {
              title: true,
            },
          },

          trainers: {
            where: {
              status: "CONFIRMED",
            },
            select: {
              id: true,
            },
            take: 1,
          },

          venues: {
            where: {
              status: "CONFIRMED",
            },
            select: {
              id: true,
            },
            take: 1,
          },
        },
      }),

      prisma.booking.count({
        where,
      }),
    ]);

    // --------------------------------------------------
    // Format operational list state
    // --------------------------------------------------

    const formattedBookings = bookings.map(
      ({
        trainers,
        venues,
        ...booking
      }) => {
        const venueRequired =
          booking.deliveryMode ===
          DeliveryMode.ARRANGED_VENUE;

        return {
          ...booking,

          trainerConfirmed:
            trainers.length > 0,

          venueRequired,

          venueConfirmed:
            !venueRequired ||
            venues.length > 0,
        };
      }
    );

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const totalPages =
      Math.ceil(total / limit);

    return NextResponse.json({
      success: true,

      data: {
        bookings: formattedBookings,

        pagination: {
          page,
          limit,
          total,
          totalPages,

          hasNextPage:
            page < totalPages,

          hasPreviousPage:
            page > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get admin bookings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch bookings.",
      },
      {
        status: 500,
      }
    );
  }
}