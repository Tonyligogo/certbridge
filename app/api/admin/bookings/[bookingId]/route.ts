import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { bookingId } = await params;

    await requireAdmin();

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        reference: true,

        course: {
          select: {
            id: true,
            title: true,
          },
        },

        deliveryMode: true,

        contactName: true,
        contactEmail: true,
        contactPhone: true,
        organizationName: true,

        participantCount: true,

        preferredStartDate: true,
        preferredEndDate: true,

        scheduledStartDate: true,
        scheduledEndDate: true,

        locationCountry: true,
        locationCity: true,
        locationAddress: true,
        locationNotes: true,

        specialRequirements: true,

        currency: true,

        status: true,
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

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(
      "GET /api/bookings/[bookingId] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking",
      },
      { status: 500 }
    );
  }
}