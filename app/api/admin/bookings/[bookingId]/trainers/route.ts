import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import {
  assignTrainerSchema,
} from "@/app/features/trainers/lib/trainer-schema";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { sendTrainerAssignmentEmail } from "@/app/features/emails/trainer-assignment";

interface RouteContext {
  params: Promise<{
    bookingId: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { bookingId } = await context.params;

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

    const assignments =
      await prisma.bookingTrainer.findMany({
        where: {
          bookingId,
        },
        include: {
          trainer: {
            include: {
              certifications: {
                where: {
                  status: "VALID",
                },
              },
              courses: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
                
                    if (authResponse) {
                      return authResponse;
                    }

    console.error(
      "GET booking trainers error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking trainers",
      },
      { status: 500 }
    );
  }
}

// assign trainer to booking
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { bookingId } = await context.params;

    const body = await request.json();

    const parsed = assignTrainerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid trainer assignment",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      trainerId,
      role,
      agreedAmount,
      currency,
      notes,
      status
    } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id:                  true,
        reference:           true,
        courseId:            true,
        deliveryMode:        true,
        participantCount:    true,
        contactName:         true,
        organizationName:    true,
        locationCity:        true,
        locationCountry:     true,
        preferredStartDate:  true,
        preferredEndDate:    true,
        scheduledStartDate:  true,
        scheduledEndDate:    true,
        course: {
          select: { title: true },
        },

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

    const trainer = await prisma.trainer.findUnique({
      where: {
        id: trainerId,
      },
      select: {
        id:        true,
        firstName: true,
        lastName:  true,
        email:     true,
        status:    true,
      },
    });

    if (!trainer) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer not found",
        },
        { status: 404 }
      );
    }

    if (trainer.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Only active trainers can be assigned",
        },
        { status: 400 }
      );
    }

    const canTrainCourse =
      await prisma.trainerCourse.findUnique({
        where: {
          trainerId_courseId: {
            trainerId,
            courseId: booking.courseId,
          },
        },
        select: {
          id: true,
        },
      });

    if (!canTrainCourse) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This trainer is not registered to deliver this course",
        },
        { status: 400 }
      );
    }

    const existingAssignment =
      await prisma.bookingTrainer.findUnique({
        where: {
          bookingId_trainerId: {
            bookingId,
            trainerId,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingAssignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer is already assigned to this booking",
        },
        { status: 409 }
      );
    }

    const assignment =
      await prisma.bookingTrainer.create({
        data: {
          bookingId,
          trainerId,
          role: role ?? "LEAD",
          status,
          agreedAmount:
            agreedAmount === null ||
            agreedAmount === undefined
              ? null
              : new Prisma.Decimal(agreedAmount),
          currency,
          notes,
          confirmedAt: status === "CONFIRMED" ? new Date() : null,
        },
        include: {
          trainer: true,
        },
      });

          // Send trainer notification only when when status is CONFIRMED— non-fatal, booking is already saved
          if (status === "CONFIRMED"){
            try {
              await sendTrainerAssignmentEmail({
                trainer: {
                  firstName: trainer.firstName,
                  lastName:  trainer.lastName,
                  email:     trainer.email,
                },
                booking: {
                  reference:          booking.reference,
                  deliveryMode:       booking.deliveryMode,
                  preferredStartDate: booking.preferredStartDate,
                  preferredEndDate:   booking.preferredEndDate,
                  scheduledStartDate: booking.scheduledStartDate,
                  scheduledEndDate:   booking.scheduledEndDate,
                  participantCount:   booking.participantCount,
                  contactName:        booking.contactName,
                  organizationName:   booking.organizationName,
                  locationCity:       booking.locationCity,
                  locationCountry:    booking.locationCountry,
                  course:             booking.course,
                },
                assignment: {
                  role:          role ?? "LEAD",
                  agreedAmount:  agreedAmount?.toString() ?? null,
                  currency,
                  notes,
                },
              });
            } catch (emailError) {
              // Log but don't fail the request — assignment is committed to DB
              console.error(
                "Trainer assigned successfully but email notification failed:",
                emailError
              );
            }
          }


    return NextResponse.json(
      {
        success: true,
        message: "Trainer assigned successfully",
        data: assignment,
      },
      { status: 201 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);
            
                if (authResponse) {
                  return authResponse;
                }

    console.error(
      "POST booking trainer error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to assign trainer",
      },
      { status: 500 }
    );
  }
}