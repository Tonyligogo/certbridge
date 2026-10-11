import type { ReactElement } from 'react';
import {Resend} from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender addresses — configure in your .env
const SENDERS = {
  default:  process.env.EMAIL_FROM_DEFAULT  ?? "CertbridgeGlobal <info@certbridgeglobal.com>",
  bookings: process.env.EMAIL_FROM_BOOKINGS ?? "CertbridgeGlobal Bookings <info@certbridgeglobal.com>",
  support:  process.env.EMAIL_FROM_SUPPORT  ?? "CertbridgeGlobal Support <info@certbridgeglobal.com>",
} as const;
 
export type EmailSender = keyof typeof SENDERS;

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;         
  from?: EmailSender;         
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  from = "bookings",
  replyTo,
}: SendEmailOptions): Promise<void> {
  const { error } = await resend.emails.send({
    from: SENDERS[from],
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
    ...(replyTo ? { replyTo } : {}),
  });
 
  if (error) {
    // Surface the error so the caller can decide whether to throw or swallow
    console.error(error)
    console.log(error)
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
