import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { Prisma } from "@/generated/prisma/client";
import { updateTrainerAssignmentSchema } from "@/app/features/trainers/lib/trainer-schema";
import { sendTrainerAssignmentEmail } from "@/app/features/emails/trainer-assignment";

interface RouteContext {
  params: Promise<{
    bookingId: string;
    trainerId: string;
  }>;
}


export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { bookingId, trainerId } = await params;

    const body = await request.json();

    const parsed = updateTrainerAssignmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      agreedAmount,
      currency,
      status,
    } = parsed.data;

    /*
     * Find the existing assignment.
     */
    const existing =
      await prisma.bookingTrainer.findUnique({
        where: {
          bookingId_trainerId: {
            bookingId,
            trainerId,
          },
        },
        include: {
          trainer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email:true
            },
          },
          booking: {
            select: {
              id: true,
              reference: true,
              deliveryMode: true,
              participantCount: true,
              contactName: true,
              organizationName: true,
              locationCity: true,
              locationCountry: true,
              preferredStartDate: true,
              preferredEndDate: true,
              scheduledStartDate: true,
              scheduledEndDate: true,

              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Trainer assignment not found",
        },
        { status: 404 }
      );
    }

    const nextStatus = status ?? existing.status;

    const becameConfirmed = existing.status !== "CONFIRMED" && nextStatus === "CONFIRMED";

    /*
     * Update assignment.
     */
    const assignment =
      await prisma.bookingTrainer.update({
        where: {
          id: existing.id,
        },
        data: {
          ...(agreedAmount !== undefined && {
            agreedAmount:
              agreedAmount === null
                ? null
                : new Prisma.Decimal(
                    agreedAmount
                  ),
          }),

          ...(currency !== undefined && {
            currency,
          }),

          ...(status !== undefined && {
            status,
          }),

          /*
           * Preserve the original confirmation
           * timestamp if already confirmed.
           *
           * If moving away from CONFIRMED,
           * clear it.
           */
          confirmedAt:
            nextStatus === "CONFIRMED"
              ? existing.confirmedAt ??
                new Date()
              : null,
        },

        include: {
          trainer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              primaryCity: true,
              primaryCountry: true,
            },
          },
        },
      });

      /*
     * Send the assignment email ONLY when
     * transitioning into CONFIRMED.
     */
    if (becameConfirmed) {
      try {
        await sendTrainerAssignmentEmail({
                trainer: {
                  firstName: existing.trainer.firstName,
                  lastName:  existing.trainer.lastName,
                  email:     existing.trainer.email,
                },
                booking: {
                  reference:          existing.booking.reference,
                  deliveryMode:       existing.booking.deliveryMode,
                  preferredStartDate: existing.booking.preferredStartDate,
                  preferredEndDate:   existing.booking.preferredEndDate,
                  scheduledStartDate: existing.booking.scheduledStartDate,
                  scheduledEndDate:   existing.booking.scheduledEndDate,
                  participantCount:   existing.booking.participantCount,
                  contactName:        existing.booking.contactName,
                  organizationName:   existing.booking.organizationName,
                  locationCity:       existing.booking.locationCity,
                  locationCountry:    existing.booking.locationCountry,
                  course:             existing.booking.course,
                },
                assignment: {
                  role: assignment.role,
                  agreedAmount: assignment.agreedAmount ?.toString() ?? null,
                  currency: assignment.currency,
                  notes: assignment.notes,
                },
              });
      } catch (emailError) {
        console.error(
          "Trainer confirmed but email notification failed:",
          emailError
        );
      }
    }

    return NextResponse.json({
      message:
        "Trainer assignment updated successfully",
      data: {
        ...assignment,
        agreedAmount:
          assignment.agreedAmount
            ?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Failed to update trainer assignment:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update trainer assignment",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const {
      bookingId,
      trainerId,
    } = await context.params;

    const assignment =
      await prisma.bookingTrainer.findUnique({
        where: {
          bookingId_trainerId: {
            bookingId,
            trainerId,
          },
        },
      });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer assignment not found",
        },
        { status: 404 }
      );
    }

    const updatedAssignment =
      await prisma.bookingTrainer.delete({
        where: {
          id: assignment.id,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Trainer assignment removed",
      data: updatedAssignment,
    });
  } catch (error) {
   const authResponse = handleAuthError(error);
   
       if (authResponse) {
         return authResponse;
       }

    console.error(
      "DELETE booking trainer error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove trainer assignment",
      },
      { status: 500 }
    );
  }
}