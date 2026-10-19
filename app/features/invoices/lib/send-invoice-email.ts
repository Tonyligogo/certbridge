import "server-only";
import { Resend } from "resend";

interface SendInvoiceEmailInput {
  to: string;
  contactName: string;
  invoiceReference: string;
  bookingReference: string;
  amount: string;
  dueDate: string;
  pdf: Buffer;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail({
  to,
  contactName,
  invoiceReference,
  bookingReference,
  amount,
  dueDate,
  pdf,
}: SendInvoiceEmailInput) {
  const from = process.env.INVOICE_FROM_EMAIL;

  if (!from) {
    throw new Error("INVOICE_FROM_EMAIL is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Invoice ${invoiceReference} — ${bookingReference}`,
    text: [
      `Dear ${contactName},`,
      "",
      "Please find attached the invoice for your corporate training booking.",
      "",
      `Invoice reference: ${invoiceReference}`,
      `Booking reference: ${bookingReference}`,
      `Amount due: ${amount}`,
      `Payment due: ${dueDate}`,
      "",
      "Please refer to the attached PDF for invoice details and payment instructions.",
      "",
      "Thank you for choosing us.",
      "",
      "Accounts Team",
    ].join("\n"),
    attachments: [
      {
        filename: `${invoiceReference}.pdf`,
        content: pdf,
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error("Email provider did not return a message ID.");
  }

  return data;
}
