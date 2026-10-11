import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { scheduleTrainingSchema } from "@/app/features/booking/lib/schedule-training-schema";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authResult = await requireAdmin();

    const { bookingId } = await params;

    const body = await request.json();

    const parsed = scheduleTrainingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid schedule details.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      scheduledStartDate,
      scheduledEndDate,
    } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        reference: true,
        status: true,
        deliveryMode: true,
        scheduledStartDate: true,
        scheduledEndDate: true,

        trainers: {
          select: {
            status: true,
          },
        },

        venues: {
          select: {
            status: true,
          },
        },

        quote: {
          select: {
            status: true,
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

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message: "A cancelled booking cannot be scheduled.",
        },
        { status: 400 }
      );
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          message: "A completed booking cannot be rescheduled.",
        },
        { status: 400 }
      );
    }

    /*
     * Resource validation
     *
     * Every booking requires a confirmed trainer.
     */
    const hasConfirmedTrainer = booking.trainers.some(
      (trainer) => trainer.status === "CONFIRMED"
    );

    if (!hasConfirmedTrainer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A confirmed trainer is required before scheduling training.",
        },
        { status: 400 }
      );
    }

    /*
     * Only ARRANGED_VENUE requires a confirmed venue.
     *
     * ONLINE       -> no venue required
     * CLIENT_SITE  -> client's location
     * ARRANGED_VENUE -> confirmed BookingVenue required
     */
    if (booking.deliveryMode === "ARRANGED_VENUE") {
      const hasConfirmedVenue = booking.venues.some(
        (venue) => venue.status === "CONFIRMED"
      );

      if (!hasConfirmedVenue) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A confirmed venue is required before scheduling training.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Commercial validation
     *
     * Scheduling should happen after the client accepts the quotation.
     */
    if (!booking.quote || booking.quote.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "The quotation must be accepted before scheduling training.",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(scheduledStartDate);
    const endDate = new Date(scheduledEndDate);

    /*
     * If either date already exists, treat this as a reschedule.
     */
    const isReschedule =
      booking.scheduledStartDate !== null ||
      booking.scheduledEndDate !== null;

    const previousStartDate = booking.scheduledStartDate;
    const previousEndDate = booking.scheduledEndDate;

    const updatedBooking = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.booking.update({
          where: {
            id: booking.id,
          },
          data: {
            scheduledStartDate: startDate,
            scheduledEndDate: endDate,
          },
          select: {
            id: true,
            reference: true,
            status: true,
            scheduledStartDate: true,
            scheduledEndDate: true,
            updatedAt: true,
          },
        });

        await tx.bookingActivity.create({
          data: {
            bookingId: booking.id,
            type: isReschedule
              ? "RESCHEDULED"
              : "SCHEDULED",

            description: isReschedule
              ? `Training rescheduled from ${formatDateRange(
                  previousStartDate,
                  previousEndDate
                )} to ${formatDateRange(
                  startDate,
                  endDate
                )}.`
              : `Training scheduled for ${formatDateRange(
                  startDate,
                  endDate
                )}.`,

            metadata: isReschedule
              ? {
                  previousStartDate:
                    previousStartDate?.toISOString() ??
                    null,

                  previousEndDate:
                    previousEndDate?.toISOString() ??
                    null,

                  scheduledStartDate:
                    startDate.toISOString(),

                  scheduledEndDate:
                    endDate.toISOString(),
                }
              : {
                  scheduledStartDate:
                    startDate.toISOString(),

                  scheduledEndDate:
                    endDate.toISOString(),
                },

            createdBy: authResult.user.id,
          },
        });

        return updated;
      }
    );

    return NextResponse.json({
      success: true,

      message: isReschedule
        ? "Training rescheduled successfully."
        : "Training scheduled successfully.",

      data: {
        ...updatedBooking,

        scheduledStartDate:
          updatedBooking.scheduledStartDate!.toString(),

        scheduledEndDate:
          updatedBooking.scheduledEndDate!.toString(),

        updatedAt:
          updatedBooking.updatedAt.toString(),
      },
    });
  } catch (error) {
    console.error(
      "Failed to schedule training:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to schedule training. Please try again.",
      },
      { status: 500 }
    );
  }
}

function formatDateRange(
  start: Date | null,
  end: Date | null
) {
  if (!start || !end) {
    return "the previous schedule";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const formattedStart = formatter.format(start);
  const formattedEnd = formatter.format(end);

  if (formattedStart === formattedEnd) {
    return formattedStart;
  }

  return `${formattedStart} – ${formattedEnd}`;
}