
import "server-only";

import prisma from "@/lib/prisma";

import { COMPANY_CONFIG } from "../types/quote";
import { renderInvoicePdf } from "../../invoices/pdf/render-invoice-pdf";
import { mapQuoteToPdfData } from "../pdf/quote-pdf-mapper";
import { quoteStorageService } from "../services/quote-storage-service";

export class QuoteIssueError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "QuoteIssueError";
  }
}

interface IssueQuoteOptions {
  quoteId: string;
  adminUserId: string;
}

export async function issueQuote({
  quoteId,
  adminUserId,
}: IssueQuoteOptions) {
  const existing = await prisma.quote.findUnique({
    where: {
      id: quoteId,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
      booking: {
        include: {
          course: true,
        },
      },
      enquiry: {
        include: {
          course: true,
        },
      },
    },
  });

  // ---------------------------------------------
  // 1. Validate quotation
  // ---------------------------------------------

  if (!existing) {
    throw new QuoteIssueError(
      "Quotation not found.",
      404,
    );
  }

  if (!existing.booking && !existing.enquiry) {
    throw new QuoteIssueError(
      "Quotation has no associated booking or enquiry.",
      409,
    );
  }

  if (existing.status !== "DRAFT") {
    throw new QuoteIssueError(
      "Only draft quotations can be issued.",
      409,
    );
  }

  if (existing.issueToken) {
    throw new QuoteIssueError(
      "This quotation is already being issued.",
      409,
    );
  }

  if (existing.items.length === 0) {
    throw new QuoteIssueError(
      "Add at least one quotation item before issuing.",
      400,
    );
  }

  if (existing.totalAmount.lte(0)) {
    throw new QuoteIssueError(
      "Quotation total must be greater than zero.",
      400,
    );
  }

  if (!existing.expiresAt) {
    throw new QuoteIssueError(
      "An expiry date is required to issue a quotation.",
      400,
    );
  }

  // A quotation originating from an enquiry
  // cannot be issued after the enquiry is closed.
  if (
    !existing.bookingId &&
    existing.enquiry &&
    ["CLOSED", "CONVERTED"].includes(
      existing.enquiry.status,
    )
  ) {
    throw new QuoteIssueError(
      "Cannot issue a quotation for a closed or converted enquiry.",
      409,
    );
  }

  const issuedAt = new Date();

  // Compare calendar dates in Kenya.
  // A quotation expiring today is still valid.
  const dateInKenya = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Africa/Nairobi",
    }).format(date);

  if (
    dateInKenya(existing.expiresAt) <
    dateInKenya(issuedAt)
  ) {
    throw new QuoteIssueError(
      "Quotation expiry date cannot be in the past.",
      400,
    );
  }

  // ---------------------------------------------
  // 2. Claim quotation
  // ---------------------------------------------

  const token = crypto.randomUUID();

  const claim = await prisma.quote.updateMany({
    where: {
      id: quoteId,
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
      "Quotation has changed or is already being issued.",
      409,
    );
  }

  let uploadedPath: string | null = null;

  try {
    // ---------------------------------------------
    // 3. Generate PDF
    // ---------------------------------------------

    const pdfData = mapQuoteToPdfData(existing, {
      issuedAt,
    });

    const documentTitle = existing.bookingId
  ? "Booking Quotation"
  : "Enquiry Quotation";

const pdf = await renderInvoicePdf(
  pdfData,
  COMPANY_CONFIG,
  documentTitle,
);

    // ---------------------------------------------
    // 4. Upload PDF
    // ---------------------------------------------

    const uploaded = await quoteStorageService.upload(
      existing.id,
      existing.reference,
      pdf,
    );

    uploadedPath = uploaded.path;

    // ---------------------------------------------
    // 5. Finalize issuance
    // ---------------------------------------------

    const quote = await prisma.$transaction(
      async (tx) => {
        const updatedCount =
          await tx.quote.updateMany({
            where: {
              id: quoteId,
              status: "DRAFT",
              issueToken: token,
            },
            data: {
              status: "ISSUED",
              issuedAt,
              pdfPath: uploadedPath,
              emailStatus: "NOT_SENT",
              issueToken: null,
            },
          });

        if (updatedCount.count !== 1) {
          throw new QuoteIssueError(
            "Quotation issuance could not be finalized.",
            409,
          );
        }

        const updated =
          await tx.quote.findUniqueOrThrow({
            where: {
              id: quoteId,
            },
            include: {
              items: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          });

        const metadata = {
          quoteId: updated.id,
          quoteReference: updated.reference,
          totalAmount:
            updated.totalAmount.toString(),
          currency: updated.currency,
          pdfPath: uploadedPath,
        };

        // -----------------------------------------
        // 6. Booking activity
        // -----------------------------------------

        if (updated.bookingId) {
          await tx.bookingActivity.create({
            data: {
              bookingId: updated.bookingId,
              type: "QUOTE_ISSUED",
              description:
                `Quotation ${updated.reference} issued ` +
                `for ${updated.currency} ` +
                `${updated.totalAmount.toFixed(2)}.`,
              createdBy: adminUserId,
              metadata,
            },
          });
        }

        // -----------------------------------------
        // 7. Enquiry activity
        // -----------------------------------------

        if (updated.enquiryId) {
          await tx.enquiryActivity.create({
            data: {
              enquiryId: updated.enquiryId,
              type: "QUOTE_ISSUED",
              description:
                `Quotation ${updated.reference} issued ` +
                `for ${updated.currency} ` +
                `${updated.totalAmount.toFixed(2)}.`,
              createdBy: adminUserId,
              metadata,
            },
          });
        }

        return updated;
      },
    );

    return quote;
  } catch (error) {
    // ---------------------------------------------
    // 8. Release claim on failure
    // ---------------------------------------------

    const release = await prisma.quote
      .updateMany({
        where: {
          id: quoteId,
          status: "DRAFT",
          issueToken: token,
        },
        data: {
          issueToken: null,
        },
      })
      .catch((releaseError) => {
        console.error(
          "Failed to release quotation issuance claim:",
          releaseError,
        );

        return null;
      });

    // Remove the uploaded PDF only if we
    // successfully released our draft claim.
    if (uploadedPath && release?.count === 1) {
      try {
        await quoteStorageService.remove(
          uploadedPath,
        );
      } catch (cleanupError) {
        console.error(
          "Failed to remove quotation PDF after issuance failure:",
          cleanupError,
        );
      }
    }

    throw error;
  }
}
