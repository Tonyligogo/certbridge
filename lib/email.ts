
import "server-only";

import type { ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDERS = {
  default:
    process.env.EMAIL_FROM_DEFAULT ??
    "CertbridgeGlobal <info@certbridgeglobal.com>",

  bookings:
    process.env.EMAIL_FROM_BOOKINGS ??
    "CertbridgeGlobal Bookings <info@certbridgeglobal.com>",

  support:
    process.env.EMAIL_FROM_SUPPORT ??
    "CertbridgeGlobal Support <info@certbridgeglobal.com>",
} as const;

export type EmailSender = keyof typeof SENDERS;

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: EmailSender;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  id: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  from = "bookings",
  replyTo,
  attachments,
}: SendEmailOptions): Promise<SendEmailResult> {
  const { data, error } = await resend.emails.send({
    from: SENDERS[from],
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
    ...(replyTo ? { replyTo } : {}),
    ...(attachments?.length ? { attachments } : {}),
  });

  if (error) {
    console.error("Resend email error:", error);

    throw new Error(
      `Failed to send email: ${error.message}`
    );
  }

  if (!data?.id) {
    throw new Error(
      "Resend did not return an email message ID."
    );
  }

  return {
    id: data.id,
  };
}
