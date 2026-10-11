import { AdminBookingDetails, AdminBookingDetailsResponse } from "../types/admin-booking";

export function nullable(value: string | undefined | null): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
  return `TRN-${new Date().getFullYear()}-${suffix}`;
}

export function isDuplicateReference(error: { code?: string; message?: string }): boolean {
  return error.code === "23505" || (error.message ?? "").includes("duplicate key");
}

export function serializeAdminBookingDetailsResponse(
  booking: AdminBookingDetails
): AdminBookingDetailsResponse {
  return {
    ...booking,

    preferredStartDate:
      booking.preferredStartDate?.toISOString() ?? null,

    preferredEndDate:
      booking.preferredEndDate?.toISOString() ?? null,

    scheduledStartDate:
      booking.scheduledStartDate?.toISOString() ?? null,

    scheduledEndDate:
      booking.scheduledEndDate?.toISOString() ?? null,

    createdAt:
      booking.createdAt.toISOString(),

    updatedAt:
      booking.updatedAt.toISOString(),

    trainers: booking.trainers.map(
      (assignment) => ({
        ...assignment,

        agreedAmount:
          assignment.agreedAmount?.toString() ??
          null,

        confirmedAt:
          assignment.confirmedAt?.toISOString() ??
          null,

        createdAt:
          assignment.createdAt.toISOString(),

        updatedAt:
          assignment.updatedAt.toISOString(),
      })
    ),

    venues: booking.venues.map(
      (assignment) => ({
        ...assignment,

        agreedAmount:
          assignment.agreedAmount?.toString() ??
          null,

        confirmedAt:
          assignment.confirmedAt?.toISOString() ??
          null,

        createdAt:
          assignment.createdAt.toISOString(),

        updatedAt:
          assignment.updatedAt.toISOString(),
      })
    ),

    quote: booking.quote
      ? {
          ...booking.quote,

          issuedAt:
            booking.quote.issuedAt?.toISOString() ??
            null,

          taxRate:
                booking.quote.taxRate.toString(),
          subtotal:
                booking.quote.subtotal.toString(),

              taxAmount:
                booking.quote.taxAmount.toString(),

              totalAmount:
                booking.quote.totalAmount.toString(),

          expiresAt:
            booking.quote.expiresAt?.toISOString() ??
            null,

          acceptedAt:
            booking.quote.acceptedAt?.toISOString() ??
            null,

          declinedAt:
            booking.quote.declinedAt?.toISOString() ??
            null,

          createdAt:
            booking.quote.createdAt.toISOString(),

          updatedAt:
            booking.quote.updatedAt.toISOString(),

          items: booking.quote.items.map(
            (item) => ({
              ...item,

              quantity:
                item.quantity.toString(),

              unitPrice:
                item.unitPrice.toString(),

              amount:
                item.amount.toString(),
            })
          ),
        }
      : null,

    invoices: booking.invoices.map(
      (invoice) => ({
        ...invoice,

        taxRate:
          invoice.taxRate.toString(),
        subtotal:
          invoice.subtotal.toString(),

        taxAmount:
          invoice.taxAmount.toString(),

        totalAmount:
          invoice.totalAmount.toString(),

        issuedAt:
          invoice.issuedAt?.toISOString() ??
          null,

        dueAt:
          invoice.dueAt?.toISOString() ??
          null,

        createdAt:
          invoice.createdAt.toISOString(),

        updatedAt:
          invoice.updatedAt.toISOString(),

        items: invoice.items.map(
          (item) => ({
            ...item,

            quantity:
              item.quantity.toString(),

            unitPrice:
              item.unitPrice.toString(),

            amount:
              item.amount.toString(),
            createdAt:
              item.createdAt.toISOString(),
          })
        ),

        payments: invoice.payments.map(
          (payment) => ({
            ...payment,

            amount:
              payment.amount.toString(),

            paidAt:
              payment.paidAt?.toISOString() ??
              null,

            createdAt:
              payment.createdAt.toISOString(),
            updatedAt:
              payment.updatedAt.toISOString(),
          })
        ),
      })
    ),

    activities: booking.activities.map(
      (activity) => ({
        ...activity,

        createdAt:
          activity.createdAt.toISOString(),
      })
    ),
  };
}