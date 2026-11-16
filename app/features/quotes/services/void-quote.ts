
import "server-only";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export class QuoteVoidError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "QuoteVoidError";
  }
}

interface VoidQuoteOptions {
  quoteId: string;
  adminUserId: string;
  reason: string;
}

export async function voidQuote({
  quoteId,
  adminUserId,
  reason,
}: VoidQuoteOptions) {
  const trimmedReason = reason.trim();

  if (!trimmedReason) {
    throw new QuoteVoidError(
      "A reason is required to void a quotation.",
      400,
    );
  }

  return prisma.$transaction(async (tx) => {
    const quote = await tx.quote.findUnique({
      where: { id: quoteId },
      select: {
        id: true,
        reference: true,
        status: true,
        bookingId: true,
        enquiryId: true,
        issueToken: true,
        emailStatus: true,
      },
    });

    if (!quote) {
      throw new QuoteVoidError(
        "Quotation not found.",
        404,
      );
    }

    if (
      !["DRAFT", "ISSUED", "SENT"].includes(
        quote.status,
      )
    ) {
      throw new QuoteVoidError(
        `Cannot void a quotation with status ${quote.status}.`,
        409,
      );
    }

    if (
      quote.issueToken ||
      quote.emailStatus === "PENDING"
    ) {
      throw new QuoteVoidError(
        "Quotation has an operation in progress.",
        409,
      );
    }

    const updatedCount = await tx.quote.updateMany({
      where: {
        id: quoteId,
        status: quote.status,
        issueToken: null,
        emailStatus: {
          not: "PENDING",
        },
      },
      data: {
        status: "VOIDED",
      },
    });

    if (updatedCount.count !== 1) {
      throw new QuoteVoidError(
        "Quotation changed during voiding.",
        409,
      );
    }

    const description =
      `Quotation ${quote.reference} voided. Reason: ${trimmedReason}`;

    const metadata = {
      quoteId,
      previousStatus: quote.status,
      newStatus: "VOIDED",
      reason: trimmedReason,
    };

    if (quote.bookingId) {
      await tx.bookingActivity.create({
        data: {
          bookingId: quote.bookingId,
          type: "QUOTE_VOIDED",
          description,
          createdBy: adminUserId,
          metadata,
        },
      });
    }

    if (quote.enquiryId) {
      await tx.enquiryActivity.create({
        data: {
          enquiryId: quote.enquiryId,
          type: "QUOTE_VOIDED",
          description,
          createdBy: adminUserId,
          metadata,
        },
      });
    }

    return tx.quote.findUniqueOrThrow({
      where: { id: quoteId },
      select: {
        id: true,
        reference: true,
        status: true,
        pdfPath: true,
        issuedAt: true,
        updatedAt: true,
      },
    });
  }, {
    isolationLevel:
      Prisma.TransactionIsolationLevel.Serializable,
  });
}
