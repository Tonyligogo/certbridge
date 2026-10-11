import {
  after,
  NextRequest,
  NextResponse,
} from "next/server";

import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { updateQuoteStatusSchema } from "@/app/features/quotes/lib/quote-schema";
import { sendQuotationEmail } from "@/app/features/emails/send-quotation-email";

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { bookingId } = await params;
    const authResult = await requireAdmin();

    const body = await request.json();

    const parsed = updateQuoteStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors:
            parsed.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      status,
      responseNotes,
    } = parsed.data;

    const quote =
      await prisma.quote.findUnique({
        where: {
          bookingId,
        },
        select: {
          id: true,
          bookingId: true,
          reference: true,
          status: true,

          expiresAt: true,
          issuedAt: true,
          acceptedAt: true,
          declinedAt: true,

          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
              unitPrice: true,
              amount: true,
            },
          },

          booking: {
            select: {
              id: true,
              reference: true,

              organizationName: true,

              contactName: true,
              contactEmail: true,
              contactPhone: true,

              deliveryMode: true,
              participantCount: true,
              currency: true,

              preferredStartDate: true,
              preferredEndDate: true,

              scheduledStartDate: true,
              scheduledEndDate: true,

              locationAddress: true,
              locationCity: true,
              locationCountry: true,
              locationNotes: true,

              specialRequirements: true,

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
      });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Quote not found for this booking",
        },
        { status: 404 }
      );
    }

    /*
     * Nothing changed.
     */
    if (
      status === quote.status &&
      responseNotes === undefined
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Quote status is already up to date",
        data: {
          id: quote.id,
          status: quote.status,
          issuedAt: quote.issuedAt,
          acceptedAt:
            quote.acceptedAt,
          declinedAt:
            quote.declinedAt,
        },
      });
    }

    /*
     * Allowed lifecycle transitions.
     */
    const allowedTransitions: Record<
      string,
      string[]
    > = {
      DRAFT: [
        "SENT",
        "CANCELLED",
      ],

      SENT: [
        "ACCEPTED",
        "DECLINED",
        "EXPIRED",
        "CANCELLED",
      ],

      DECLINED: ["DRAFT"],
      EXPIRED: ["DRAFT"],
      ACCEPTED: [],
      CANCELLED: [],
    };

    const allowed =
      allowedTransitions[
        quote.status
      ] ?? [];

    if (!allowed.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Cannot change quote status from ${quote.status} to ${status}`,
        },
        { status: 400 }
      );
    }

    /*
     * Sending-specific validation.
     */
    if (status === "SENT") {
      if (quote.items.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Cannot send a quote with no line items",
          },
          { status: 400 }
        );
      }

      if (
        quote.expiresAt &&
        quote.expiresAt <= new Date()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The quote expiry date has already passed",
          },
          { status: 400 }
        );
      }

      if (
        !quote.booking.contactEmail
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The booking does not have a client email address",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Server-controlled status timestamps.
     */
    const updateData:
      Prisma.QuoteUpdateInput = {
        status,
      };

    if (status === "SENT") {
      updateData.issuedAt =
        new Date();
    }

    if (status === "ACCEPTED") {
      updateData.acceptedAt =
        new Date();
    }

    if (status === "DECLINED") {
      updateData.declinedAt =
        new Date();
    }

    /*
     * Reopening a quote.
     */
    if (
      status === "DRAFT" &&
      quote.status === "DECLINED"
    ) {
      updateData.declinedAt =
        null;
    }

    if (
      responseNotes !== undefined
    ) {
      updateData.responseNotes =
        responseNotes;
    }

    /*
     * Persist first.
     */
    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedQuote =
            await tx.quote.update({
              where: {
                id: quote.id,
              },
              data: updateData,
              select: {
                id: true,
                reference: true,
                status: true,

                issuedAt: true,
                expiresAt: true,
                acceptedAt: true,
                declinedAt: true,

                responseNotes: true,
              },
            });

          /*
           * Use the more specific activity
           * type when actually sending.
           */
          await tx.bookingActivity.create({
            data: {
              bookingId,

              type:
                status === "SENT"
                  ? "QUOTE_SENT"
                  : "QUOTE_UPDATED",

              description:
                status === "SENT"
                  ? `Quote ${quote.reference} sent to ${quote.booking.contactEmail}.`
                  : `Quote ${quote.reference} status changed from ${quote.status} to ${status}.`,

              createdBy:
                authResult.user.id,

              metadata: {
                quoteId: quote.id,
                quoteReference:
                  quote.reference,

                previousStatus:
                  quote.status,

                newStatus: status,
              },
            },
          });

          return updatedQuote;
        }
      );

    /*
     * Send email only after the database
     * transaction succeeds.
     *
     * Email failure must not roll back the
     * quote status change.
     */
    if (status === "SENT") {
      after(async () => {
      try {
        await sendQuotationEmail({
          quote: {
            id: quote.id,
            reference:
              quote.reference,

            issuedAt:
              result.issuedAt,

            expiresAt:
              quote.expiresAt,

            items:
              quote.items.map(
                (item) => ({
                  id: item.id,
                  name: item.name,

                  quantity:
                    item.quantity.toString(),

                  unitPrice:
                    item.unitPrice.toString(),

                  amount:
                    item.amount.toString(),
                })
              ),
          },

          booking: {
            id:
              quote.booking.id,

            reference:
              quote.booking.reference,

            organizationName:
              quote.booking
                .organizationName,

            contactName:
              quote.booking
                .contactName,

            contactEmail:
              quote.booking
                .contactEmail,

            contactPhone:
              quote.booking
                .contactPhone,

            deliveryMode:
              quote.booking
                .deliveryMode,

            participantCount:
              quote.booking
                .participantCount,

            currency:
              quote.booking.currency,

            preferredStartDate:
              quote.booking
                .preferredStartDate,

            preferredEndDate:
              quote.booking
                .preferredEndDate,

            scheduledStartDate:
              quote.booking
                .scheduledStartDate,

            scheduledEndDate:
              quote.booking
                .scheduledEndDate,

            locationAddress:
              quote.booking
                .locationAddress,

            locationCity:
              quote.booking
                .locationCity,

            locationCountry:
              quote.booking
                .locationCountry,

            locationNotes:
              quote.booking
                .locationNotes,

            specialRequirements:
              quote.booking
                .specialRequirements,

            course:
              quote.booking.course,
          },
        });
      } catch (emailError) {
        console.error(
          `Quote ${quote.reference} was marked as sent, but the email failed:`,
          emailError
        );
      }
    })
    }

    return NextResponse.json({
      success: true,

      message:
        status === "SENT"
          ? "Quote sent successfully"
          : "Quote status updated successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "PATCH /api/bookings/[bookingId]/quote/status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update quote status",
      },
      { status: 500 }
    );
  }
}