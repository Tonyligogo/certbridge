
import "server-only";

import prisma from "@/lib/prisma";

import { invoiceSelect } from "../lib/invoice-select";
import { renderInvoicePdf } from "../pdf/render-invoice-pdf";
import { mapInvoiceToPdfData } from "../pdf/invoice-pdf-mapper";
import { COMPANY_CONFIG } from "../../quotes/types/quote";
import { invoiceStorageService } from "../services/invoice-storage-service";

// Use your existing company configuration import.

export class InvoiceIssueError extends Error {
  constructor(
    message: string,
    public statusCode = 400
  ) {
    super(message);
    this.name = "InvoiceIssueError";
  }
}

interface IssueInvoiceOptions {
  bookingId: string;
  invoiceId: string;
  adminUserId: string;
}

export async function issueInvoice({
  bookingId,
  invoiceId,
  adminUserId,
}: IssueInvoiceOptions) {
  const existing = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
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
    throw new InvoiceIssueError("Invoice not found.", 404);
  }

  if (existing.status !== "DRAFT") {
    throw new InvoiceIssueError(
      "Only draft invoices can be issued.",
      409
    );
  }

  if (existing.issueToken) {
    throw new InvoiceIssueError(
      "This invoice is already being issued.",
      409
    );
  }

  if (existing.items.length === 0) {
    throw new InvoiceIssueError(
      "Add at least one invoice item before issuing.",
      400
    );
  }

  if (existing.totalAmount.lte(0)) {
    throw new InvoiceIssueError(
      "Invoice total must be greater than zero.",
      400
    );
  }

  if (!existing.dueAt) {
    throw new InvoiceIssueError(
      "A due date is required to issue an invoice.",
      400
    );
  }

  const issuedAt = new Date();

  // Compare calendar dates in Kenya, rather than timestamps.
  // An invoice due today should still be valid.
  const dateInKenya = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Africa/Nairobi",
    }).format(date);

  if (dateInKenya(existing.dueAt) < dateInKenya(issuedAt)) {
    throw new InvoiceIssueError(
      "Invoice due date cannot be in the past.",
      400
    );
  }

  const token = crypto.randomUUID();

  // Claim the invoice so concurrent requests cannot issue it twice.
  const claim = await prisma.invoice.updateMany({
    where: {
      id: invoiceId,
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
    throw new InvoiceIssueError(
      "Invoice has changed or is already being issued.",
      409
    );
  }

  let uploadedPath: string | null = null;

  try {
    const pdfData = mapInvoiceToPdfData(existing, {
      status: "ISSUED",
      issuedAt,
    });

    const pdf = await renderInvoicePdf(
      pdfData,
      COMPANY_CONFIG
    );

    const uploaded = await invoiceStorageService.upload(
      existing.id,
      existing.reference,
      pdf
    );

    // Your storage service returns { path, fullPath }.
    uploadedPath = uploaded.path;

    const invoice = await prisma.$transaction(async (tx) => {
      const updatedCount = await tx.invoice.updateMany({
        where: {
          id: invoiceId,
          bookingId,
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
        throw new InvoiceIssueError(
          "Invoice issuance could not be finalized.",
          409
        );
      }

      const updated = await tx.invoice.findUniqueOrThrow({
        where: {
          id: invoiceId,
        },
        select: invoiceSelect,
      });

      await tx.bookingActivity.create({
        data: {
          bookingId,
          type: "INVOICE_ISSUED",
          description: `Invoice ${updated.reference} issued.`,
          createdBy: adminUserId,
          metadata: {
            invoiceId: updated.id,
            invoiceReference: updated.reference,
            totalAmount: updated.totalAmount.toString(),
            currency: updated.currency,
            pdfPath: uploadedPath,
          },
        },
      });

      return updated;
    });

    return invoice;
  } catch (error) {
    // Release the claim only if this request still owns it.
    const release = await prisma.invoice.updateMany({
      where: {
        id: invoiceId,
        status: "DRAFT",
        issueToken: token,
      },
      data: {
        issueToken: null,
      },
    }).catch((releaseError) => {
      console.error(
        "Failed to release invoice issuance claim:",
        releaseError
      );
      return null;
    });

    // Remove the uploaded file only when we confirmed the
    // invoice is still a draft and the claim was released.
    if (uploadedPath && release?.count === 1) {
      try {
        await invoiceStorageService.remove(uploadedPath);
      } catch (cleanupError) {
        console.error(
          "Failed to remove invoice PDF after issuance failure:",
          cleanupError
        );
      }
    }

    throw error;
  }
}
