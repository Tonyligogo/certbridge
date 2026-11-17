import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { Prisma } from "@/generated/prisma/client";

import { generateReference } from "@/lib/utils";
import { requireAdmin } from "@/lib/server/course";
import { convertEnquirySchema } from "@/app/features/enquiry/lib/validation/enquiry";
import { calculateBookingPrice, TRAINER_DAILY_RATES } from "@/lib/pricing-config";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const CONVERSION_ERRORS: Record<
  string,
  { message: string; status: number }
> = {
  ENQUIRY_NOT_FOUND: {
    message: "Enquiry not found.",
    status: 404,
  },

  ENQUIRY_ALREADY_CONVERTED: {
    message: "This enquiry has already been converted to a booking.",
    status: 409,
  },

  ENQUIRY_CLOSED: {
    message: "Reopen this enquiry before converting it.",
    status: 409,
  },

  ENQUIRY_COURSE_MISSING: {
    message: "This enquiry has no linked course.",
    status: 422,
  },
  
  COURSE_NOT_FOUND: {
    message: "The linked course could not be found.",
    status: 404,
  },

  COURSE_NOT_PUBLISHED: {
    message: "The linked course is not published.",
    status: 409,
  },

  COURSE_PRICING_NOT_FOUND: {
    message: "Pricing is not configured for the selected delivery mode.",
    status: 422,
  },

  PREFERRED_DATE_MISSING: {
    message: "The enquiry has no preferred training date.",
    status: 422,
  },
};

function conversionError(error: unknown) {
  if (!(error instanceof Error)) return null;

  const matched = CONVERSION_ERRORS[error.message];

  if (!matched) return null;

  return NextResponse.json(
    {
      success: false,
      message: matched.message,
    },
    { status: matched.status },
  );
}

function optionalText(value?: string) {
  return value?.trim() || null;
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await request.json();

    const validated = convertEnquirySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validated.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = validated.data;

    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Retrieve the enquiry
        const enquiry = await tx.enquiry.findUnique({
          where: { id },
          select: {
            id: true,
            reference: true,
            status: true,
            bookingId: true,
            courseId: true,
            preferredDate: true,
            message: true,
          },
        });

        if (!enquiry) {
          throw new Error("ENQUIRY_NOT_FOUND");
        }

        if (
          enquiry.status === "CONVERTED" ||
          enquiry.bookingId
        ) {
          throw new Error("ENQUIRY_ALREADY_CONVERTED");
        }

        if (enquiry.status === "CLOSED") {
          throw new Error("ENQUIRY_CLOSED");
        }

        if (!enquiry.courseId) {
          throw new Error("ENQUIRY_COURSE_MISSING");
        }

        if (!enquiry.preferredDate) {
          throw new Error("PREFERRED_DATE_MISSING");
        }

        // 2. Retrieve the linked course and its prices
        const course = await tx.course.findUnique({
          where: {
            id: enquiry.courseId,
          },
          select: {
            id: true,
            title: true,
            durationDays: true,
            level: true,
            status:true,
            pricing: {
              select: {
                amount: true,
                currency: true,
                deliveryMode: true,
              },
            },
          },
        });

        if (!course) {
          throw new Error("COURSE_NOT_FOUND");
        }
        if (course.status !== 'PUBLISHED') {
          throw new Error("COURSE_NOT_PUBLISHED");
        }

        // 3. Select pricing for the requested delivery mode
        const selectedPricing = course.pricing.find(
          (price) =>
            price.deliveryMode === data.deliveryMode,
        );

        if (!selectedPricing) {
          throw new Error("COURSE_PRICING_NOT_FOUND");
        }

        // 4. Calculate the booking amount
        const estimate = calculateBookingPrice({
          basePricePerParticipantPerDay: Number(
            selectedPricing.amount,
          ),
          participants: data.participantCount,
          durationDays: course.durationDays,
          deliveryMode: data.deliveryMode,
          currency: selectedPricing.currency,
          trainerDailyRate:
            TRAINER_DAILY_RATES[course.level],
        });

        // 5. Calculate preferred training dates
        // Treat the enquiry date as a calendar date.
        const startDateString =
          enquiry.preferredDate
            .toISOString()
            .slice(0, 10);

        const preferredStartDate = new Date(
          `${startDateString}T00:00:00.000Z`,
        );

        const preferredEndDate = new Date(
          preferredStartDate,
        );

        preferredEndDate.setUTCDate(
          preferredEndDate.getUTCDate() +
            course.durationDays -
            1,
        );

        // 6. Atomically claim the enquiry for conversion.
        // This prevents a second conversion from succeeding.
        const claimed = await tx.enquiry.updateMany({
          where: {
            id: enquiry.id,
            status: {
              in: ["NEW", "CONTACTED", "IN_PROGRESS"],
            },
            bookingId: null,
          },
          data: {
            status: "CONVERTED",
          },
        });

        if (claimed.count !== 1) {
          throw new Error("ENQUIRY_ALREADY_CONVERTED");
        }

        // 7. Create the booking
        const booking = await tx.booking.create({
          data: {
            reference: generateReference("BK"),

            profileId: null,

            courseId: course.id,

            deliveryMode: data.deliveryMode,

            preferredStartDate,
            preferredEndDate,

            contactName: data.contactName,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,

            organizationName: optionalText(
              data.organizationName,
            ),

            participantCount: data.participantCount,

            specialRequirements: optionalText(
              data.specialRequirements,
            ) ?? enquiry.message,

            amount: new Prisma.Decimal(
              estimate.totalPrice,
            ),

            currency: estimate.currency,

            status: "OPEN",

            locationAddress: optionalText(
              data.locationAddress,
            ),

            locationCity: optionalText(
              data.locationCity,
            ),

            locationCountry: optionalText(
              data.locationCountry,
            ),

            locationNotes: optionalText(
              data.locationNotes,
            ),
          },
          select: {
            id: true,
            reference: true,
            amount: true,
            currency: true,
            status: true,
          },
        });
        
        // 8. Link enquiry quotes with the booking
        await tx.quote.updateMany({
          where: {
            enquiryId: enquiry.id,
            bookingId: null,
          },
          data: {
            bookingId: booking.id,
          },
        });

        // 9. Link the booking to the enquiry
        await tx.enquiry.update({
          where: {
            id: enquiry.id,
          },
          data: {
            bookingId: booking.id,
          },
        });

        // 10. Record booking creation activity
        await tx.bookingActivity.create({
          data: {
            bookingId: booking.id,
            type: "CREATED",
            description:
              `Booking created from enquiry ${enquiry.reference}.`,
            createdBy: session.user.id,
            metadata: {
              source: "ENQUIRY",
              enquiryId: enquiry.id,
              enquiryReference: enquiry.reference,
            },
          },
        });

        // 11. Record enquiry conversion activity
        await tx.enquiryActivity.create({
          data: {
            enquiryId: enquiry.id,
            type: "CONVERTED_TO_BOOKING",
            description:
              `Enquiry converted to booking ${booking.reference}.`,
            createdBy: session.user.id,
            metadata: {
              bookingId: booking.id,
              bookingReference: booking.reference,
              courseId: course.id,
              courseTitle: course.title,
            },
          },
        });

        return {
          booking: {
            ...booking,
            amount: booking.amount.toString(),
          },

          enquiryId: enquiry.id,
          enquiryReference: enquiry.reference,

          pricing: {
            participants: estimate.participants,
            durationDays: estimate.durationDays,
            totalPrice: estimate.totalPrice,
            currency: estimate.currency,
            requiredTrainers: estimate.requiredTrainers,
          },
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry converted to booking successfully.",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    const authError = handleAuthError(error);

    if (authError) return authError;

    const knownError = conversionError(error);

    if (knownError) return knownError;

    // Concurrent conversions may produce a serialization
    // conflict or a unique-constraint violation.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2034" || error.code === "P2002")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This enquiry may have been modified or converted by another administrator. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    console.error("Convert enquiry error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while converting the enquiry.",
      },
      { status: 500 },
    );
  }
}