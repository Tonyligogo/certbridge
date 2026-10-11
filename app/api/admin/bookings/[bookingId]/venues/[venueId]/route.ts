import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { updateBookingVenueSchema } from "@/app/features/venues/lib/venue-schema";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

interface RouteContext {
  params: Promise<{
    bookingId: string;
    venueId: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await requireAdmin();

    const { bookingId, venueId } = await params;

    const existing = await prisma.bookingVenue.findUnique({
      where: {
        bookingId_venueId: {
          bookingId,
          venueId,
        },
      },
      include: {
        venue: true,
        booking: {
          select: {
            id: true,
            reference: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking venue not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = updateBookingVenueSchema.safeParse(body);

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

    const data = result.data;

    const newStatus = data.status;
    const statusChanged =
      newStatus !== undefined &&
      newStatus !== existing.status;

    const updated = await prisma.$transaction(
      async (tx) => {
        const bookingVenue =
          await tx.bookingVenue.update({
            where: {
              id: existing.id,
            },
            data: {
              ...(data.status !== undefined && {
                status: data.status,
              }),

              ...(data.agreedAmount !== undefined && {
                agreedAmount: data.agreedAmount,
              }),

              ...(data.currency !== undefined && {
                currency: data.currency,
              }),

              ...(data.notes !== undefined && {
                notes: data.notes,
              }),

              ...(newStatus === "CONSIDERING" &&
                existing.status !== "CONSIDERING" && {
                  confirmedAt: null,
                }),

              ...(newStatus === "CONFIRMED" &&
                existing.status !== "CONFIRMED" && {
                  confirmedAt: new Date(),
                }),
            },

            include: {
              venue: true,
            },
          });

        if (statusChanged) {
          let activityType:
            | "VENUE_CONFIRMED"
            | "VENUE_REPLACED"
            | "STATUS_CHANGED";

          let description: string;

          if (newStatus === "CONFIRMED") {
            activityType = "VENUE_CONFIRMED";
            description = `Venue "${existing.venue.name}" was confirmed.`;
          } else if (newStatus === "REPLACED") {
            activityType = "VENUE_REPLACED";
            description = `Venue "${existing.venue.name}" was marked as replaced.`;
          } else {
            activityType = "STATUS_CHANGED";
            description = `Venue "${existing.venue.name}" status changed from ${existing.status} to ${newStatus}.`;
          }

          await tx.bookingActivity.create({
            data: {
              bookingId,
              type: activityType,
              description,
              createdBy: user.user.id,
            },
          });
        }

        return bookingVenue;
      }
    );

    return NextResponse.json({
      success: true,
      message: "Booking venue updated successfully",
      data: updated,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
            
                if (authResponse) {
                  return authResponse;
                }

    console.error(
      "PATCH /api/bookings/[bookingId]/venues/[venueId] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking venue",
      },
      { status: 500 }
    );
  }
}