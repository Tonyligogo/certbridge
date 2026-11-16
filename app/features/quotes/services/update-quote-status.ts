
import "server-only";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export class QuoteStatusError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "QuoteStatusError";
  }
}

interface UpdateQuoteStatusOptions {
  quoteId: string;
  adminUserId: string;
  status: "ACCEPTED" | "DECLINED";
  responseNotes?: string | null;
}

export async function updateQuoteStatus({
  quoteId,
  adminUserId,
  status,
  responseNotes,
}: UpdateQuoteStatusOptions) {
  return prisma.$transaction(async (tx) => {
    const quote = await tx.quote.findUnique({
      where: { id: quoteId },
      select: {
        id: true,
        reference: true,
        status: true,
        bookingId: true,
        enquiryId: true,
        expiresAt: true,
        pdfPath: true,
        issueToken: true,
        emailStatus: true,
    },
    });

    if (!quote) {
      throw new QuoteStatusError(
        "Quotation not found.",
        404,
      );
    }

    if (
      quote.status !== "SENT" ||
      quote.emailStatus !== "SENT"
    ) {
      throw new QuoteStatusError(
        "Only sent quotations can be accepted or declined.",
        409,
      );
    }

    if (!quote.pdfPath || quote.issueToken) {
      throw new QuoteStatusError(
        "Quotation is not ready for a response.",
        409,
      );
    }

    if (
      quote.expiresAt &&
      quote.expiresAt.getTime() < Date.now()
    ) {
      throw new QuoteStatusError(
        "This quotation has expired.",
        409,
      );
    }

    const now = new Date();

    const updated = await tx.quote.updateMany({
      where: {
        id: quoteId,
        status: "SENT",
        emailStatus: "SENT",
        issueToken: null,
        pdfPath: { not: null },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      data: {
        status,
        acceptedAt:
          status === "ACCEPTED" ? now : null,
        declinedAt:
          status === "DECLINED" ? now : null,
        ...(responseNotes !== undefined
          ? { responseNotes }
          : {}),
      },
    });

    if (updated.count !== 1) {
      throw new QuoteStatusError(
        "Quotation status changed. Refresh and try again.",
        409,
      );
    }

    // Confirm booking when quotation is accepted

      if (status === "ACCEPTED" && quote.bookingId) {
        const booking = await tx.booking.findUnique({
          where: {
            id: quote.bookingId,
          },
          select: {
            status: true,
          },
        });

        if (!booking) {
          throw new QuoteStatusError(
            "Associated booking not found.",
            404,
          );
        }

        if (booking.status !== "OPEN") {
          throw new QuoteStatusError(
            `Cannot confirm a booking with status ${booking.status}.`,
            409,
          );
        }

        const confirmed = await tx.booking.updateMany({
          where: {
            id: quote.bookingId,
            status: "OPEN",
          },
          data: {
            status: "CONFIRMED",
          },
        });

        if (confirmed.count !== 1) {
          throw new QuoteStatusError(
            "Booking status changed. Refresh and try again.",
            409,
          );
        }

        await tx.bookingActivity.create({
          data: {
            bookingId: quote.bookingId,
            type: "STATUS_CHANGED",
            description:
              `Booking confirmed following acceptance of quotation ${quote.reference}.`,
            createdBy: adminUserId,
            metadata: {
              previousStatus: booking.status,
              newStatus: "CONFIRMED",
              quoteId: quote.id,
              quoteReference: quote.reference
            },
          },
        });

      }

    const description =
      `Quotation ${quote.reference} ${status.toLowerCase()}.`;

    const activityType =
      status === "ACCEPTED"
        ? "QUOTE_ACCEPTED"
        : "QUOTE_DECLINED";

    if (quote.bookingId) {
      await tx.bookingActivity.create({
        data: {
          bookingId: quote.bookingId,
          type: activityType,
          description,
          createdBy: adminUserId,
          metadata: {
            quoteId,
            previousStatus: quote.status,
            newStatus: status,
          },
        },
      });
    }

    if (quote.enquiryId) {
      await tx.enquiryActivity.create({
        data: {
          enquiryId: quote.enquiryId,
          type: activityType,
          description,
          createdBy: adminUserId,
          metadata: {
            quoteId,
            previousQuoteStatus: quote.status,
            newQuoteStatus: status,
          },
        },
      });
    }

    return tx.quote.findUniqueOrThrow({
      where: { id: quoteId },
      select: {
        id: true,
        reference: true,
        status: true,
        issuedAt: true,
        acceptedAt: true,
        declinedAt: true,
        responseNotes: true,
      },
    });
  }, {
    isolationLevel:
      Prisma.TransactionIsolationLevel.Serializable,
  });
}
