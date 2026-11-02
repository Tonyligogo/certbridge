import "server-only";

import prisma from "@/lib/prisma";

import { COMPANY_CONFIG } from "../types/quote";
import { renderInvoicePdf } from "../../invoices/pdf/render-invoice-pdf";
import { mapQuoteToPdfData } from "../pdf/quote-pdf-mapper";
import { quoteStorageService } from "../services/quote-storage-service";

// Use your existing company configuration import.

export class QuoteIssueError extends Error {
  constructor(
    message: string,
    public statusCode = 400
  ) {
    super(message);
    this.name = "QuoteIssueError";
  }
}

interface IssueQuoteOptions {
  bookingId: string;
  quoteId: string;
  adminUserId: string;
}

export async function issueQuote({
  bookingId,
  quoteId,
  adminUserId,
}: IssueQuoteOptions) {
  const existing = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      bookingId,
    },
    include: {
      items: true,
      booking: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!existing) {
    throw new QuoteIssueError("Quote not found.", 404);
  }

  if (existing.status !== "DRAFT") {
    throw new QuoteIssueError(
      "Only draft quotes can be issued.",
      409
    );
  }

  if (existing.issueToken) {
    throw new QuoteIssueError(
      "This quote is already being issued.",
      409
    );
  }

  if (existing.items.length === 0) {
    throw new QuoteIssueError(
      "Add at least one quote item before issuing.",
      400
    );
  }

  if (existing.totalAmount.lte(0)) {
    throw new QuoteIssueError(
      "Quote total must be greater than zero.",
      400
    );
  }

  if (!existing.expiresAt) {
    throw new QuoteIssueError(
      "An expiry date is required to issue a quote.",
      400
    );
  }

  const issuedAt = new Date();

  // Compare calendar dates in Kenya, rather than timestamps.
  // A quote due today should still be valid.
  const dateInKenya = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Africa/Nairobi",
    }).format(date);

  if (dateInKenya(existing.expiresAt) < dateInKenya(issuedAt)) {
    throw new QuoteIssueError(
      "Quote due date cannot be in the past.",
      400
    );
  }

  const token = crypto.randomUUID();

  // Claim the quote so concurrent requests cannot issue it twice.
  const claim = await prisma.quote.updateMany({
    where: {
      id: quoteId,
      bookingId,
      status: "DRAFT",
      issueToken: null,
      updatedAt: existing.updatedAt,
    },
    data: {
      issueToken: token,
    },
  });

  if (claim.count !== 1) {
    throw new QuoteIssueError(
      "Quote has changed or is already being issued.",
      409
    );
  }

  let uploadedPath: string | null = null;

  const quoteData = {
    ...existing,
    dueAt:existing.expiresAt
  }

  try {
    const pdfData = mapQuoteToPdfData(quoteData, {
      issuedAt,
    });

    const pdf = await renderInvoicePdf(
      pdfData,
      COMPANY_CONFIG,
      "Quotation"
    );

    const uploaded = await quoteStorageService.upload(
      existing.id,
      existing.reference,
      pdf
    );

    // Your storage service returns { path, fullPath }.
    uploadedPath = uploaded.path;

    const quote = await prisma.$transaction(async (tx) => {
      const updatedCount = await tx.quote.updateMany({
        where: {
          id: quoteId,
          bookingId,
          status: "DRAFT",
          issueToken: token,
        },
        data: {
          issuedAt,
          pdfPath: uploadedPath,
          emailStatus: "NOT_SENT",
          issueToken: null,
        },
      });

      if (updatedCount.count !== 1) {
        throw new QuoteIssueError(
          "Invoice issuance could not be finalized.",
          409
        );
      }

      const updated = await tx.quote.findUniqueOrThrow({
        where: {
          id: quoteId,
        },
        include: {
          booking:{
            select:{
              contactEmail:true,
            }
          },
                items: {
                  orderBy: {
                    createdAt:
                      "asc",
                  },
                },
              },
      });

      await tx.bookingActivity.create({
        data: {
          bookingId,
          type: "QUOTE_SENT",
          description: `Quote ${updated.reference} sent to ${updated.booking.contactEmail}.`,
          createdBy: adminUserId,
          metadata: {
            quoteId: updated.id,
            quoteReference: updated.reference,
            totalAmount: updated.totalAmount.toString(),
            currency: updated.currency,
            pdfPath: uploadedPath,
          },
        },
      });

      return updated;
    });

    return quote;
  } catch (error) {
    // Release the claim only if this request still owns it.
    const release = await prisma.quote.updateMany({
      where: {
        id: quoteId,
        status: "DRAFT",
        issueToken: token,
      },
      data: {
        issueToken: null,
      },
    }).catch((releaseError) => {
      console.error(
        "Failed to release quote issuance claim:",
        releaseError
      );
      return null;
    });

    // Remove the uploaded file only when we confirmed the
    // invoice is still a draft and the claim was released.
    if (uploadedPath && release?.count === 1) {
      try {
        await quoteStorageService.remove(uploadedPath);
      } catch (cleanupError) {
        console.error(
          "Failed to remove quote PDF after issuance failure:",
          cleanupError
        );
      }
    }

    throw error;
  }
}
