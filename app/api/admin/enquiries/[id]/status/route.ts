
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { updateEnquirySchema } from "@/app/features/enquiry/lib/validation/enquiry";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await requireAdmin();
    const { id: enquiryId } = await params;

    const body = await request.json().catch(() => null);
    const parsed = updateEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error,
        },
        { status: 400 },
      );
    }

    const input = parsed.data;

    const result = await prisma.$transaction(
      async (tx) => {
        const enquiry = await tx.enquiry.findUnique({
          where: { id: enquiryId },
          select: {
            id: true,
            status: true,
            bookingId: true,
            closedAt: true,
          },
        });

        if (!enquiry) {
          throw new EnquiryStatusError(
            "Enquiry not found.",
            404,
          );
        }

        if (
          enquiry.status === "CONVERTED" ||
          enquiry.bookingId
        ) {
          throw new EnquiryStatusError(
            "Converted enquiries cannot change status.",
            409,
          );
        }

        let newStatus:
          | "NEW"
          | "CONTACTED"
          | "IN_PROGRESS"
          | "CLOSED";

        let closedAt: Date | null = enquiry.closedAt;
        let description: string;
        let metadata: Prisma.InputJsonValue;

        switch (input.action) {
          case "CHANGE_STATUS": {
            if (enquiry.status === "CLOSED") {
              throw new EnquiryStatusError(
                "Reopen this enquiry before changing its status.",
                409,
              );
            }

            if (enquiry.status === input.status) {
              throw new EnquiryStatusError(
                "Enquiry already has this status.",
                409,
              );
            }

            newStatus = input.status;
            closedAt = null;

            description =
              `Enquiry status changed from ${enquiry.status} to ${newStatus}.`;

            metadata = {
              action: input.action,
              from: enquiry.status,
              to: newStatus,
            };

            break;
          }

          case "CLOSE": {
            if (enquiry.status === "CLOSED") {
              throw new EnquiryStatusError(
                "Enquiry is already closed.",
                409,
              );
            }

            const acceptedQuote = await tx.quote.findFirst({
              where: {
                enquiryId,
                status: "ACCEPTED",
              },
              select: { id: true },
            });

            if (acceptedQuote) {
              throw new EnquiryStatusError(
                "An enquiry with an accepted quotation cannot be closed.",
                409,
              );
            }

            const outstandingQuotes =
              await tx.quote.findMany({
                where: {
                  enquiryId,
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
              if (
                quote.issueToken ||
                quote.emailStatus === "PENDING"
              ) {
                throw new EnquiryStatusError(
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
                throw new EnquiryStatusError(
                  "Quotation changed during the operation. Refresh and try again.",
                  409,
                );
              }

              await tx.enquiryActivity.create({
                data: {
                  enquiryId,
                  type: "QUOTE_VOIDED",
                  description:
                    `Quotation ${quote.reference} voided because the enquiry was closed.`,
                  createdBy: session.user.id,
                  metadata: {
                    quoteId: quote.id,
                    quoteReference: quote.reference,
                    previousStatus: quote.status,
                    newStatus: "VOIDED",
                    reason: input.reason,
                  },
                },
              });
            }

            newStatus = "CLOSED";
            closedAt = new Date();

            description = `Enquiry closed: ${input.reason}`;

            metadata = {
              action: input.action,
              from: enquiry.status,
              to: "CLOSED",
              reason: input.reason,
              voidedQuoteCount: outstandingQuotes.length,
            };

            break;
          }

          case "REOPEN": {
            if (enquiry.status !== "CLOSED") {
              throw new EnquiryStatusError(
                "Only closed enquiries can be reopened.",
                409,
              );
            }

            newStatus = "NEW";
            closedAt = null;

            description = "Enquiry reopened.";

            metadata = {
              action: input.action,
              from: "CLOSED",
              to: "NEW",
            };

            break;
          }
        }

        const updated = await tx.enquiry.update({
          where: { id: enquiryId },
          data: {
            status: newStatus,
            closedAt,
          },
          select: {
            id: true,
            status: true,
            closedAt: true,
            updatedAt: true,
          },
        });

        await tx.enquiryActivity.create({
          data: {
            enquiryId,
            type: "STATUS_CHANGED",
            description,
            metadata,
            createdBy: session.user.id,
          },
        });

        return updated;
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof EnquiryStatusError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enquiry was modified by another request. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    console.error(
      "PATCH /api/admin/enquiries/[id]/status error:",
      error,
    );

    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update enquiry status.",
      },
      { status: 500 },
    );
  }
}

class EnquiryStatusError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "EnquiryStatusError";
  }
}
