
export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED";

export type TaxType = 
|"STANDARD"
|"ZERO_RATED"
|"EXEMPT"
|"NONE"

export interface QuoteItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  amount: string;
}

export interface Quote {
  id: string;
  bookingId: string;
  reference: string;
  status: QuoteStatus;

  taxRate: string;
  taxType:TaxType;

  currency:string;

  subtotal: string;
  taxAmount: string;
  totalAmount: string;

  issuedAt: string | null;
  expiresAt: string | null;

  acceptedAt: string | null;
  declinedAt: string | null;

  responseNotes: string | null;

  createdAt: string;
  updatedAt: string;

  items: QuoteItem[];
}

export interface CreateQuoteItemInput {
  name: string;
  quantity: string;
  unitPrice: string;
}

export interface CreateQuoteInput {
  expiresAt?: Date | null;
  responseNotes?: string | null;
  taxType:TaxType;
  items: CreateQuoteItemInput[];
}

export interface UpdateQuoteInput {
  expiresAt?: Date | null;
  responseNotes?: string | null;
  taxType:TaxType;
  items?: CreateQuoteItemInput[];
}

export interface UpdateQuoteStatusInput {
  status: QuoteStatus;
  responseNotes?: string | null;
}

export interface QuoteStatusResponse {
  id: string;
  status: QuoteStatus;
  issuedAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
}

export interface CompanyConfig {
  name:         string;
  email:        string;
  phone:        string;
  website:      string;
  paybill:      string;
  bankName:     string;
  accountName:  string;
  accountNo:    string;
  branch:       string;
  paymentTerms: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  name:         "CertBridge Global",
  email:        "info@certbridgeglobal.com",
  phone:        "+254 700 000 000",
  website:      "certbridgeglobal.com",
  paybill:      "123456",
  bankName:     "Equity Bank Kenya",
  accountName:  "CertBridge Global Ltd",
  accountNo:    "0123456789",
  branch:       "Upper Hill, Nairobi",
  paymentTerms: "Full pyament is due 7 days before the training start date. Cancellations within 7 days of training forfeit the deposit. Rescheduling permitted with 14 days' notice at no charge.",
};
