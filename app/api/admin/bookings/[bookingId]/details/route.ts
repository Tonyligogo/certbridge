import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { AdminBookingDetailsResponseSelect } from "@/app/features/booking/types/admin-booking";
import { serializeAdminBookingDetailsResponse } from "@/app/features/booking/lib/booking-helpers";

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
      select: AdminBookingDetailsResponseSelect,
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

    const serializedBooking = serializeAdminBookingDetailsResponse(booking);

    return NextResponse.json({
      success: true,
      data: serializedBooking,
    });
  } catch (error) {
    console.error(
      "GET /api/bookings/[bookingId]/details error:",
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