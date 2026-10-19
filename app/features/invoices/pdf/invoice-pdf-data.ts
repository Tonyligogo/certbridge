
export interface InvoicePdfItem {
  name: string;
  quantity: string;
  unitPrice: string;
  amount: string;
}

export interface InvoicePdfData {
  reference: string;
  status: "DRAFT" | "ISSUED" | "PAID" | "VOID";

  bookingReference: string;

  client: {
    organizationName?: string | null;
    contactName: string;
    email: string;
    phone?: string | null;
  };

  courseTitle: string;

  currency: string;
  taxType: string;
  taxRate: string;

  subtotal: string;
  taxAmount: string;
  totalAmount: string;

  issuedAt: string | null;
  dueAt: string | null;

  notes: string | null;

  items: InvoicePdfItem[];
}

export interface InvoiceCompanyDetails {
  name: string;
  tagline?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  taxPin?: string;
  logoUrl?: string;

  paymentInstructions?: string;
}
