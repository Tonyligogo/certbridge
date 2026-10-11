import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        locationCountry: true,
        locationCity: true,
        participantCount: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || undefined;

    const country =
      searchParams.get("country")?.trim() ||
      booking.locationCountry ||
      undefined;

    const city =
      searchParams.get("city")?.trim() ||
      booking.locationCity ||
      undefined;
    
    const where = {
      status: "ACTIVE" as const,

      ...(country
        ? {
            country: {
              contains: country,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(city
        ? {
            city: {
              contains: city,
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
                address: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const venues = await prisma.venue.findMany({
      where,

      orderBy: {
        name: "asc",
      },

      take: 50,

      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: venues,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error(
      "GET /api/bookings/[bookingId]/venues/candidates error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch venue candidates",
      },
      { status: 500 }
    );
  }
}