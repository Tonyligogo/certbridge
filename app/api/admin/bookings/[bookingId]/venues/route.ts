import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { addBookingVenueSchema } from "@/app/features/venues/lib/venue-schema";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function GET(
  _request: Request,
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

    const bookingVenues = await prisma.bookingVenue.findMany({
      where: {
        bookingId,
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        venue: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: bookingVenues,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }

    console.error(
      "GET /api/bookings/[bookingId]/venues error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking venues",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await requireAdmin();

    const { bookingId } = await params;

    const body = await request.json();

    const result = addBookingVenueSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { venueId, notes, status, agreedAmount, currency } = result.data;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        reference: true,
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

    const venue = await prisma.venue.findUnique({
      where: {
        id: venueId,
      },
    });

    if (!venue) {
      return NextResponse.json(
        {
          success: false,
          message: "Venue not found",
        },
        { status: 404 }
      );
    }

    if (venue.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "This venue is inactive",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.bookingVenue.findUnique({
      where: {
        bookingId_venueId: {
          bookingId,
          venueId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "This venue has already been added to the booking",
        },
        { status: 409 }
      );
    }

    const bookingVenue = await prisma.$transaction(
      async (tx) => {
        const created = await tx.bookingVenue.create({
          data: {
            bookingId,
            venueId,
            status,
            agreedAmount,
            currency,
            notes: notes || undefined,
            ...(status === "CONFIRMED" &&
                {
                  confirmedAt: new Date(),
                }),
          },
          include: {
            venue: true,
          },
        });

        await tx.bookingActivity.create({
          data: {
            bookingId,
            type: "VENUE_ADDED",
            description: `Venue "${venue.name}" was added for consideration.`,
            createdBy: user.user.id,
          },
        });

        return created;
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Venue added to booking successfully",
        data: bookingVenue,
      },
      { status: 201 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }

    console.error(
      "POST /api/bookings/[bookingId]/venues error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add venue to booking",
      },
      { status: 500 }
    );
  }
}