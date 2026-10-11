import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/server/profile";
import { bookingRequestSchema } from "@/app/features/booking/lib/booking-schema";
import { sendBookingEmails } from "@/app/features/emails/booking-emails";
import { generateReference } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = bookingRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validated.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const data = validated.data;

    // Confirm that the course exists.
    const course = await prisma.course.findUnique({
      where: {
        id: data.courseId,
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        {
          status: 404,
        },
      );
    }

    // Returns null for guests.
    const profile = await getCurrentProfile();

    const booking = await prisma.booking.create({
      data: {
        reference: generateReference('BK'),

        profileId: profile?.id ?? null,

        courseId: data.courseId,

        deliveryMode: data.deliveryMode,

        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,

        organizationName: data.organizationName ?? null,

        participantCount: data.participants.length,

        preferredStartDate: new Date(data.preferredStartDate),

        preferredEndDate: new Date(data.preferredEndDate),

        locationCountry: data.locationCountry ?? null,

        locationCity: data.locationCity ?? null,

        locationAddress: data.locationAddress ?? null,

        locationNotes: data.locationNotes ?? null,

        specialRequirements: data.specialRequirements ?? null,

        participants: {
          create: data.participants.map((participant) => ({
            firstName: participant.firstName,
            lastName: participant.lastName,
            email: participant.email,
            phone: participant.phone,
          })),
        },
      },

      include: {
        course: {
          select: {
            title: true,
          },
        },

        participants: {
          include: {
            participant: {
              select:{
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              }
            },
          },
        },
      },
    });
      
      const { errors: emailErrors } = await sendBookingEmails(booking);
   
      if (emailErrors.length > 0) {
        // Log for monitoring — consider sending to Sentry or similar
        console.warn("Booking created but some emails failed:", emailErrors);
      }


    return NextResponse.json(
      {
        success: true,
        message: "Your booking request has been submitted successfully.",
        data: booking
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your booking.",
      },
      {
        status: 500,
      },
    );
  }
}