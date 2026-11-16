import "server-only";

import { pdfStorageService } from "@/lib/storage/pdf-storage";
import prisma from "@/lib/prisma";

export class QuotePdfAccessError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function getEnquiryQuotePdfAccess(input: {
  enquiryId: string;
  quoteId: string;
  download: boolean;
}) {
  const quote = await prisma.quote.findFirst({
    where: { id: input.quoteId, enquiryId: input.enquiryId },
    select: { pdfPath: true },
  });
  if (!quote) throw new QuotePdfAccessError("Quotation not found", 404);
  if (!quote.pdfPath)
    throw new QuotePdfAccessError(
      "This quotation does not have an issued PDF yet",
      409,
    );
  return pdfStorageService.createSignedUrl(
    "quotations",
    quote.pdfPath,
    input.download,
  );
}
