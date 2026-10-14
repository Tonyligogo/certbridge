import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { createQuoteSchema, updateQuoteSchema } from "@/app/features/quotes/lib/quote-schema";
import { getTaxRate } from "@/app/features/booking/lib/tax";

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

/**
 * Serialize Decimal values before returning JSON.
 */
type QuoteWithItems = Prisma.QuoteGetPayload<{
  include: {
    items: {
      orderBy: {
        createdAt: "asc";
      };
    };
  };
}>;

function serializeQuote(quote: QuoteWithItems) {
  const total = quote.items.reduce(
    (sum, item) => sum.add(item.amount),
    new Prisma.Decimal(0)
  );

  return {
    ...quote,
    total: total.toFixed(2),
    items: quote.items.map((item) => ({
      ...item,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
  };
}


//  Get the current quote for a booking.
 
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { bookingId } = await params;

    await requireAdmin();

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        reference: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    const quote = await prisma.quote.findUnique({
      where: {
        bookingId,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: true,
          message: "No quote exists for this booking",
          data: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeQuote(quote),
    });
  } catch (error) {
    console.error("GET /api/bookings/[bookingId]/quote error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quote",
      },
      { status: 500 }
    );
  }
}

// Create the one quote belonging to a booking.

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { bookingId } = await params;

    const authResult = await requireAdmin();

    const body = await request.json();

    const parsed = createQuoteSchema.safeParse(body);

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
      items,
      expiresAt,
      taxType,
      status,
      responseNotes,
    } = parsed.data;

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        select: {
          id: true,
          reference: true,
          currency: true,
          quote: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking not found",
        },
        { status: 404 }
      );
    }

    if (booking.quote) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A quote already exists for this booking",
        },
        { status: 409 }
      );
    }

    const reference = `QT-${booking.reference}`;

    /*
     * Calculate all financial values
     * on the server.
     */
    const calculatedItems =
      items.map((item) => {
        const quantity =
          new Prisma.Decimal(
            item.quantity
          );

        const unitPrice =
          new Prisma.Decimal(
            item.unitPrice
          );

        const amount =
          quantity.mul(unitPrice);

        return {
          name: item.name,
          quantity,
          unitPrice,
          amount,
        };
      });

    const subtotal =
      calculatedItems.reduce(
        (sum, item) =>
          sum.add(item.amount),
        new Prisma.Decimal(0)
      );

    const taxRate = getTaxRate(taxType);

    const taxAmount =
      subtotal
        .mul(taxRate)
        .div(100);

    const totalAmount =
      subtotal.add(taxAmount);

    const quote =
      await prisma.$transaction(
        async (tx) => {
          const createdQuote =
            await tx.quote.create({
              data: {
                bookingId,
                reference,
                status,
                currency:booking.currency,
                issuedAt: status === 'SENT' ? new Date() : null,

                expiresAt: expiresAt
                  ? new Date(expiresAt)
                  : null,

                responseNotes:
                  responseNotes ??
                  null,

                taxType,
                taxRate,
                subtotal,
                taxAmount,
                totalAmount,

                items: {
                  create:
                    calculatedItems,
                },
              },

              include: {
                items: {
                  orderBy: {
                    createdAt:
                      "asc",
                  },
                },
              },
            });

          await tx.bookingActivity.create(
            {
              data: {
                bookingId,
                type: "QUOTE_CREATED",

                description:
                  `Quote ${createdQuote.reference} created for ` +
                  `${booking.currency ?? "KES"} ${totalAmount.toFixed(2)}.`,

                createdBy:
                  authResult.user.id,
              },
            }
          );

          return createdQuote;
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Quote created successfully",
        data: serializeQuote(quote),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/bookings/[bookingId]/quote error:",
      error
    );

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A quote already exists for this booking",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create quote",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[bookingId]/quote
 *
 * Update the existing quote.
 *
 * Can update:
 * - expiresAt
 * - responseNotes
 * - items
 * - status
 *
 * Server controls:
 * - issuedAt
 * - acceptedAt
 * - declinedAt
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { bookingId } = await params;

    const authResult = await requireAdmin();

    const body = await request.json();

    const parsed = updateQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existingQuote = await prisma.quote.findUnique({
      where: {
        bookingId,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!existingQuote) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote not found for this booking",
        },
        { status: 404 }
      );
    }

    /*
     * Only draft quotes may be edited.
     *
     * Once a quote has been sent, its commercial contents
     * should not be silently changed.
     */
    if (existingQuote.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          message: "Only draft quotes can be edited",
        },
        { status: 409 }
      );
    }

    /*
     * Determine the values that should be used for the
     * recalculation.
     *
     * If items/taxType were not supplied, keep the existing ones.
     */
    const taxType = data.taxType ?? existingQuote.taxType;

    const calculatedItems =
      data.items !== undefined
        ? data.items.map((item) => {
            const quantity = new Prisma.Decimal(item.quantity);
            const unitPrice = new Prisma.Decimal(item.unitPrice);

            return {
              name: item.name,
              quantity,
              unitPrice,
              amount: quantity.mul(unitPrice),
            };
          })
        : existingQuote.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
          }));

    /*
     * Recalculate financial values whenever the items
     * or tax treatment changes.
     */
    const financialsChanged =
      data.items !== undefined ||
      data.taxType !== undefined;

    let subtotal = existingQuote.subtotal;
    let taxRate = existingQuote.taxRate;
    let taxAmount = existingQuote.taxAmount;
    let totalAmount = existingQuote.totalAmount;

    if (financialsChanged) {
      subtotal = calculatedItems.reduce(
        (sum, item) => sum.add(item.amount),
        new Prisma.Decimal(0)
      );

      taxRate = getTaxRate(taxType);

      taxAmount = subtotal
        .mul(taxRate)
        .div(100);

      totalAmount = subtotal.add(taxAmount);
    }

    const updateData: Prisma.QuoteUpdateInput = {};

    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt
        ? new Date(data.expiresAt)
        : null;
    }

    if(data.status === 'SENT'){
      updateData.status = data.status
      updateData.issuedAt = new Date()
    }

    if (data.responseNotes !== undefined) {
      updateData.responseNotes = data.responseNotes;
    }

    if (financialsChanged) {
      updateData.taxType = taxType;
      updateData.taxRate = taxRate;
      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.totalAmount = totalAmount;
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Replace quote items only when new items
       * were actually supplied.
       */
      if (data.items !== undefined) {
        await tx.quoteItem.deleteMany({
          where: {
            quoteId: existingQuote.id,
          },
        });

        await tx.quoteItem.createMany({
          data: calculatedItems.map((item) => ({
            quoteId: existingQuote.id,
            ...item,
          })),
        });
      }

      const updatedQuote = await tx.quote.update({
        where: {
          id: existingQuote.id,
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

      /*
       * Financial changes
       */
      if (data.items !== undefined) {
        activityParts.push(
          `total changed from ${existingQuote.totalAmount.toFixed(
            2
          )} to ${updatedQuote.totalAmount.toFixed(2)}`
        );
      }

      if (
        data.taxType !== undefined &&
        data.taxType !== existingQuote.taxType
      ) {
        activityParts.push(
          `tax treatment changed from ${existingQuote.taxType} to ${updatedQuote.taxType}`
        );
      }

      /*
       * Other quote changes
       */
      if (data.expiresAt !== undefined) {
        activityParts.push("expiry date updated");
      }

      if (data.responseNotes !== undefined) {
        activityParts.push("response notes updated");
      }

      if (activityParts.length > 0) {
        await tx.bookingActivity.create({
          data: {
            bookingId,
            type: "QUOTE_UPDATED",
            description: `Quote ${
              updatedQuote.reference
            } updated: ${activityParts.join("; ")}.`,
            createdBy: authResult.user.id,
          },
        });
      }

      return updatedQuote;
    });

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully",
      data: serializeQuote(result),
    });
  } catch (error) {
    console.error(
      "PATCH /api/bookings/[bookingId]/quote error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quote",
      },
      { status: 500 }
    );
  }
}