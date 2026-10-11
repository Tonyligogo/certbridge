import type {
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/generated/prisma/browser";

/**
 * API/client representation of an invoice item.
 *
 * Decimal values are serialized as strings.
 * Dates are serialized as ISO strings.
 */
export interface InvoiceItem {
  id: string;
  name: string;

  quantity: string;
  unitPrice: string;
  amount: string;

  createdAt: string;
}

/**
 * API/client representation of a payment.
 */
export interface InvoicePayment {
  id: string;
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

/**
 * Full invoice returned by the API.
 */
export interface Invoice {
  id: string;
  bookingId: string;
  quoteId: string | null;

  reference: string;

  status: InvoiceStatus;
  currency: string;

  subtotal: string;
  taxAmount: string;
  totalAmount: string;

  issuedAt: string | null;
  dueAt: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;

  items: InvoiceItem[];
  payments: InvoicePayment[];
}

export interface CreateInvoiceItemInput {
  name: string;
  quantity: string;
  unitPrice: string;
}

export interface CreateInvoiceInput {
  quoteId?: string | null;

  currency: string;

  dueAt?: string | null;
  notes?: string | null;

  items: CreateInvoiceItemInput[];
}

export interface CreateInvoiceVariables {
  bookingId: string;
  data: CreateInvoiceInput;
}

export interface UpdateInvoiceInput {
  currency: string;

  dueAt?: string | null;
  notes?: string | null;

  items: CreateInvoiceItemInput[];
}

export interface UpdateInvoiceVariables {
  bookingId: string;
  invoiceId: string;
  data: UpdateInvoiceInput;
}