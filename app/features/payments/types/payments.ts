import { PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import { RecordPaymentInput } from "../schema/schemas";

export interface RecordPaymentVariables {
  bookingId: string;
  invoiceId: string;
  data: RecordPaymentInput;
}

export interface RecordPaymentResponse {
  payment: Payment;

  paidAmount: string;
  balance: string;

  fullyPaid: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  reference: string;

  amount: string;
  currency: string;

  method: PaymentMethod;
  status: PaymentStatus;

  transactionReference: string | null;
  paidAt: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}