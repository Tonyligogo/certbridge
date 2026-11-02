
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { validateBookingCompletion } from "@/app/features/booking/lib/server/booking";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const authResult = await requireAdmin();
    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        status: true,
        scheduledEndDate: true,
        participants: {
          select: {
            id: true,
            attendanceMarkedAt: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.status !== "CONFIRMED") {
      return NextResponse.json(
        {
          success: false,
          message: "Only confirmed bookings can be completed.",
        },
        { status: 409 }
      );
    }

    const validation = validateBookingCompletion(booking);

    if (!validation.canComplete) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking cannot be completed yet.",
          errors: {
            completion: validation.reasons,
          },
        },
        { status: 409 }
      );
    }

    const completed = await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.updateMany({
        where: {
          id: bookingId,
          status: "CONFIRMED",
        },
        data: {
          status: "COMPLETED",
        },
      });

      if (updated.count !== 1) {
        throw new Error(
          "Booking status changed while completing the booking."
        );
      }

      await tx.bookingActivity.create({
        data: {
          bookingId,
          type: "COMPLETED",
          description:
            `Booking ${booking.reference} marked as completed.`,
          createdBy: authResult.user.id,
        },
      });

      return tx.booking.findUniqueOrThrow({
        where: { id: bookingId },
        select: {
          id: true,
          reference: true,
          status: true,
          scheduledStartDate: true,
          scheduledEndDate: true,
          updatedAt: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Booking marked as completed successfully.",
      data: completed,
    });
  } catch (error) {
    console.error("Complete booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to complete booking.",
      },
      { status: 500 }
    );
  }
}
