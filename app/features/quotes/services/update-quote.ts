import "server-only";

import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import type { UpdateQuoteInput } from "../lib/quote-schema";
import { getTaxRate } from "../../booking/lib/tax";

export class QuoteUpdateError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "QuoteUpdateError";
  }
}

interface UpdateQuoteOptions {
  quoteId: string;
  adminUserId: string;
  input: UpdateQuoteInput;
  source:
    | { bookingId: string; enquiryId?: never }
    | { enquiryId: string; bookingId?: never };
}

export async function updateQuote({
  quoteId,
  adminUserId,
  input,
  source,
}: UpdateQuoteOptions) {
  return prisma.$transaction(
    async (tx) => {
      // Lock the quotation row so editing and issuance
      // cannot change the same quotation concurrently.
      //
      // Prisma does not expose SELECT FOR UPDATE
      // through findUnique, so use a conditional
      // update to acquire a row-level write lock.

      const claim = await tx.quote.updateMany({
        where: {
          id: quoteId,
          ...source,
          status: "DRAFT",
          issueToken: null,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      if (claim.count !== 1) {
        throw new QuoteUpdateError(
          "Quotation not found, already issued, or currently being issued.",
          409,
        );
      }

      const existing = await tx.quote.findUniqueOrThrow({
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

      if(existing.status !== "DRAFT") {
        throw new QuoteUpdateError(
          "Quotation is not in DRAFT status and cannot be updated.",
          409,
        );
      }

      if ("enquiryId" in source) {
        const enquiry = await tx.enquiry.findUnique({
          where: {
            id: source.enquiryId,
          },
          select: {
            status: true,
          },
        });

        if (!enquiry) {
          throw new QuoteUpdateError("Enquiry not found.", 404);
        }

        if (enquiry.status === "CONVERTED") {
          throw new QuoteUpdateError(
            "This enquiry has been converted into a booking. Manage its quotations from the booking instead.",
            409,
          );
        }

        if (enquiry.status === "CLOSED") {
          throw new QuoteUpdateError(
            "Cannot edit quotations for a closed enquiry.",
            409,
          );
        }
      }

      const taxType = input.taxType ?? existing.taxType;

      const calculatedItems =
        input.items !== undefined
          ? input.items.map((item) => {
              const quantity = new Prisma.Decimal(item.quantity);

              const unitPrice = new Prisma.Decimal(item.unitPrice);

              return {
                name: item.name,
                quantity,
                unitPrice,
                amount: quantity.mul(unitPrice),
              };
            })
          : existing.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.amount,
            }));

      const financialsChanged =
        input.items !== undefined || input.taxType !== undefined;

      let subtotal = existing.subtotal;
      let taxRate = existing.taxRate;
      let taxAmount = existing.taxAmount;
      let totalAmount = existing.totalAmount;

      if (financialsChanged) {
        subtotal = calculatedItems.reduce(
          (sum, item) => sum.add(item.amount),
          new Prisma.Decimal(0),
        );

        taxRate = getTaxRate(taxType);

        taxAmount = subtotal.mul(taxRate).div(100);
        totalAmount = subtotal.add(taxAmount);
      }

      const updateData: Prisma.QuoteUpdateInput = {};

      if (input.expiresAt !== undefined) {
        updateData.expiresAt = input.expiresAt
          ? new Date(input.expiresAt)
          : null;
      }

      if (input.responseNotes !== undefined) {
        updateData.responseNotes = input.responseNotes;
      }

      if (financialsChanged) {
        updateData.taxType = taxType;
        updateData.taxRate = taxRate;
        updateData.subtotal = subtotal;
        updateData.taxAmount = taxAmount;
        updateData.totalAmount = totalAmount;
      }

      // Replace items only when explicitly provided.
      if (input.items !== undefined) {
        await tx.quoteItem.deleteMany({
          where: {
            quoteId,
          },
        });

        await tx.quoteItem.createMany({
          data: calculatedItems.map((item) => ({
            quoteId,
            ...item,
          })),
        });
      }

      const updated = await tx.quote.update({
        where: {
          id: quoteId,
        },
        data: updateData,
        include: {
          items: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      const activityParts: string[] = [];

      if (input.items !== undefined) {
        activityParts.push(
          `total changed from ${existing.totalAmount.toFixed(2)} ` +
            `to ${updated.totalAmount.toFixed(2)}`,
        );
      }

      if (input.taxType !== undefined && input.taxType !== existing.taxType) {
        activityParts.push(
          `tax treatment changed from ${existing.taxType} ` +
            `to ${updated.taxType}`,
        );
      }

      if (input.expiresAt !== undefined) {
        activityParts.push("expiry date updated");
      }

      if (input.responseNotes !== undefined) {
        activityParts.push("response notes updated");
      }

      if (activityParts.length > 0) {
        const description =
          `Quotation ${updated.reference} updated: ` +
          activityParts.join("; ") +
          ".";

        const metadata = {
          quoteId: updated.id,
          quoteReference: updated.reference,
        };

        if (source.bookingId) {
          await tx.bookingActivity.create({
            data: {
              bookingId: source.bookingId,
              type: "QUOTE_UPDATED",
              description,
              createdBy: adminUserId,
              metadata,
            },
          });
        }

        if (source.enquiryId) {
          await tx.enquiryActivity.create({
            data: {
              enquiryId: source.enquiryId,
              type: "QUOTE_UPDATED",
              description,
              createdBy: adminUserId,
              metadata,
            },
          });
        }
      }

      return updated;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}
