import "server-only";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { UpdateEnquiryDetailsInput } from "../lib/validation/enquiry";

export class EnquiryDetailsError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "EnquiryDetailsError";
  }
}

interface UpdateEnquiryDetailsOptions {
  enquiryId: string;
  adminUserId: string;
  input: UpdateEnquiryDetailsInput;
}

const commercialFields = [
  "courseId",
  "courseName",
  "participantCount",
  "deliveryMode",
  "preferredDate",
] as const;

export async function updateEnquiryDetails({
  enquiryId,
  adminUserId,
  input,
}: UpdateEnquiryDetailsOptions) {
  return prisma.$transaction(
    async (tx) => {
      const enquiry = await tx.enquiry.findUnique({
        where: { id: enquiryId },
        select: {
          id: true,
          status: true,
          bookingId: true,

          fullName: true,
          email: true,
          phone: true,
          organization: true,

          courseId: true,
          courseName: true,
          participantCount: true,
          deliveryMode: true,
          preferredDate: true,

          message: true,
          adminNotes: true,
        },
      });

      if (!enquiry) {
        throw new EnquiryDetailsError("Enquiry not found.", 404);
      }

      if (enquiry.status === "CONVERTED" || enquiry.bookingId) {
        throw new EnquiryDetailsError(
          "Converted enquiries cannot be edited.",
          409,
        );
      }

      if (enquiry.status === "CLOSED") {
        throw new EnquiryDetailsError(
          "Reopen this enquiry before editing it.",
          409,
        );
      }

      // Identify fields whose values actually changed.
      const changedFields = (
        Object.keys(input) as Array<keyof UpdateEnquiryDetailsInput>
      ).filter((key) => {
        const nextValue = input[key];

        if (nextValue === undefined) {
          return false;
        }

        const previousValue = enquiry[key];

        if (key === "preferredDate") {
          const previousTime =
            previousValue instanceof Date ? previousValue.getTime() : null;

          const nextTime =
            nextValue instanceof Date ? nextValue.getTime() : null;

          return previousTime !== nextTime;
        }

        return previousValue !== nextValue;
      });

      if (changedFields.length === 0) {
        return enquiry;
      }

      const commercialChanged = changedFields.some((field) =>
        commercialFields.includes(field as (typeof commercialFields)[number]),
      );

      if (commercialChanged) {
        const acceptedQuote = await tx.quote.findFirst({
          where: {
            enquiryId,
            status: "ACCEPTED",
          },
          select: {
            id: true,
          },
        });

        if (acceptedQuote) {
          throw new EnquiryDetailsError(
            "Commercial details cannot be changed after a quotation has been accepted.",
            409,
          );
        }

        const outstandingQuotes = await tx.quote.findMany({
          where: {
            enquiryId,
            bookingId: null,
            status: {
              in: ["DRAFT", "ISSUED", "SENT"],
            },
          },
          select: {
            id: true,
            reference: true,
            status: true,
            issueToken: true,
            emailStatus: true,
          },
        });

        for (const quote of outstandingQuotes) {
          if (quote.issueToken || quote.emailStatus === "PENDING") {
            throw new EnquiryDetailsError(
              "A quotation is currently being issued or emailed. Try again shortly.",
              409,
            );
          }

          const voided = await tx.quote.updateMany({
            where: {
              id: quote.id,
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

          if (voided.count !== 1) {
            throw new EnquiryDetailsError(
              "Quotation changed during the update. Refresh and try again.",
              409,
            );
          }

          await tx.enquiryActivity.create({
            data: {
              enquiryId,
              type: "QUOTE_VOIDED",
              description: `Quotation ${quote.reference} voided because the enquiry's training requirements changed.`,
              createdBy: adminUserId,
              metadata: {
                quoteId: quote.id,
                quoteReference: quote.reference,
                previousStatus: quote.status,
                newStatus: "VOIDED",
                reason: "ENQUIRY_REQUIREMENTS_CHANGED",
                changedFields,
              },
            },
          });
        }
      }

      // Update only the supplied, changed fields.
      const updateData = Object.fromEntries(
        changedFields.map((key) => [key, input[key]]),
      ) as Prisma.EnquiryUpdateInput;

      const updated = await tx.enquiry.update({
        where: { id: enquiryId },
        data: updateData,
        select: {
          id: true,
          reference: true,
          type: true,
          status: true,
          fullName: true,
          email: true,
          phone: true,
          organization: true,
          courseId: true,
          courseName: true,
          participantCount: true,
          deliveryMode: true,
          preferredDate: true,
          message: true,
          adminNotes: true,
          updatedAt: true,
        },
      });

      await tx.enquiryActivity.create({
        data: {
          enquiryId,
          type: "DETAILS_UPDATED",
          description: `Enquiry details updated: ${changedFields.join(", ")}.`,
          createdBy: adminUserId,
          metadata: {
            action: "DETAILS_UPDATED",
            changedFields,
            commercialChanged,
          },
        },
      });

      return updated;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}
