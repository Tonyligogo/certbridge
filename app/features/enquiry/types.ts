import { CourseLevel, InvoiceEmailStatus, QuoteStatus, TaxType } from "@/generated/prisma/enums";

export type EnquiryType = "QUOTE" | "GENERAL";

export type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "CONVERTED"
  | "CLOSED";

export type EnquiryDeliveryMode =
  | "ONLINE"
  | "CLIENT_SITE"
  | "ARRANGED_VENUE";

export interface CreateEnquiryInput {
  type: EnquiryType;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  courseId?: string;
  courseName?: string;
  participantCount?: number;
  deliveryMode?: EnquiryDeliveryMode;
  preferredDate?: string;
  message?: string;
}

export interface CreatedEnquiry {
  id: string;
  reference: string;
  type: EnquiryType;
  status: EnquiryStatus;
  createdAt: string;
}

export type EnquiryStatusFilter =
  | "ALL"
  | "NEW"
  | "PENDING"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "CONVERTED"
  | "CLOSED";

export type EnquiryTypeFilter = "ALL" | "QUOTE" | "GENERAL";

export type EnquiryDatePreset =
  | "ALL"
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "CUSTOM";

export interface GetEnquiriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EnquiryStatusFilter;
  type?: EnquiryTypeFilter;
  dateFrom?: string;
  dateTo?: string;
}

export interface AdminEnquiry {
  id: string;
  reference: string;

  type: EnquiryType;
  status: EnquiryStatus;

  fullName: string;
  email: string;
  phone: string | null;
  organization: string | null;

  courseName: string | null;
  participantCount: number | null;
  deliveryMode: EnquiryDeliveryMode | null;
  preferredDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface EnquiryStatusCounts {
  ALL: number;
  NEW: number;
  PENDING: number;
  CONTACTED: number;
  IN_PROGRESS: number;
  CONVERTED: number;
  CLOSED: number;
}

export interface EnquiriesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminEnquiriesResponse {
  enquiries: AdminEnquiry[];
  counts: EnquiryStatusCounts;
  pagination: EnquiriesPagination;
}

export type EnquiryActivityType =
  | "CREATED"
  | "STATUS_CHANGED"
  | "NOTE_ADDED"
  | "CUSTOMER_CONTACTED"
  | "CONVERTED_TO_BOOKING";

export interface AdminEnquiryActivity {
  id: string;
  type: EnquiryActivityType;
  description: string;
  createdAt: string;
  createdBy: string | null;
}

export interface AdminEnquiryDetail extends AdminEnquiry {
  courseId: string | null;
  message: string | null;
  adminNotes: string | null;
  contactedAt: string | null;
  closedAt: string | null;
  bookingId: string | null;

  course: {
    id: string;
    title: string;
    slug: string;
    durationDays: number;
    level: CourseLevel;
    pricing: {
      amount: number;
      currency: string;
      deliveryMode: EnquiryDeliveryMode;
    }[];
  } | null;

  activities: AdminEnquiryActivity[];
}

export interface ConvertedEnquiryBooking {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  status: "OPEN" | "CONFIRMED";
}

export interface ConvertEnquiryResult {
  booking: ConvertedEnquiryBooking;

  enquiryId: string;
  enquiryReference: string;

  pricing: {
    participants: number;
    durationDays: number;
    totalPrice: number;
    currency: string;
    requiredTrainers: number;
  };
}

export interface UpdateEnquiryDetailsInput {
  fullName?: string;
  email?: string;
  phone?: string | null;
  organization?: string | null;
  courseId?: string | null;
  courseName?: string | null;
  participantCount?: number | null;
  deliveryMode?: EnquiryDeliveryMode | null;
  preferredDate?: string | null;
  message?: string | null;
  adminNotes?: string | null;
}

export type UpdateEnquiryStatusInput =
  | {
      action: "CHANGE_STATUS";
      status: "NEW" | "CONTACTED" | "IN_PROGRESS";
    }
  | {
      action: "CLOSE";
      reason: string;
    }
  | {
      action: "REOPEN";
    };

export type EnquiryQuoteStatus =
  | "DRAFT"
  | "ISSUED"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "VOIDED";

export type UpdatedEnquiryDetails = Pick<
  AdminEnquiryDetail,
  | "id"
  | "reference"
  | "type"
  | "status"
  | "fullName"
  | "email"
  | "phone"
  | "organization"
  | "courseId"
  | "courseName"
  | "participantCount"
  | "deliveryMode"
  | "preferredDate"
  | "message"
  | "adminNotes"
  | "updatedAt"
>;

export interface EnquiryQuoteItem {
  id: string;
  quoteId: string;

  name: string;
  quantity: string;
  unitPrice: string;
  amount: string;

  createdAt: string;
}

export interface EnquiryQuote {
  id: string;

  bookingId: string | null;
  enquiryId: string | null;

  reference: string;
  status: QuoteStatus;
  currency: string;

  taxType: TaxType;
  taxRate: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;

  issuedAt: string | null;
  expiresAt: string | null;

  issueToken: string | null;
  pdfPath: string | null;

  sentAt: string | null;
  sentTo: string | null;
  emailStatus: InvoiceEmailStatus;

  acceptedAt: string | null;
  declinedAt: string | null;

  responseNotes: string | null;

  createdAt: string;
  updatedAt: string;

  items: EnquiryQuoteItem[];
}

export type EnquiryQuoteSummary = Pick<
  EnquiryQuote,
  | "id"
  | "reference"
  | "status"
  | "currency"
  | "totalAmount"
  | "issuedAt"
  | "sentAt"
  | "acceptedAt"
  | "declinedAt"
  | "expiresAt"
  | "createdAt"
  | "updatedAt"
>;

export interface EnquiryQuoteItem {
  id: string;
  quoteId: string;
  name: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  createdAt: string;
}

export interface EnquiryQuote {
  id: string;
  bookingId: string | null;
  enquiryId: string | null;

  reference: string;
  status: QuoteStatus;
  currency: string;

  taxType: TaxType;
  taxRate: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;

  issuedAt: string | null;
  expiresAt: string | null;

  issueToken: string | null;
  pdfPath: string | null;

  sentAt: string | null;
  sentTo: string | null;
  emailStatus: InvoiceEmailStatus;

  acceptedAt: string | null;
  declinedAt: string | null;

  responseNotes: string | null;

  createdAt: string;
  updatedAt: string;

  items: EnquiryQuoteItem[];
}

export interface QuoteItemInput {
  name: string;
  quantity: string;
  unitPrice: string;
}

export interface CreateEnquiryQuoteInput {
  status: "DRAFT" | "ISSUED";
  taxType: TaxType;
  expiresAt?: Date | null;
  responseNotes?: string | null;
  items: QuoteItemInput[];
}

export interface UpdateEnquiryQuoteInput {
  taxType: TaxType;
  expiresAt?: Date | null;
  responseNotes?: string | null;
  items?: QuoteItemInput[];
}

export interface SendEnquiryQuoteInput {
  email?: string;
  resend?: boolean;
}

export interface UpdateEnquiryQuoteStatusInput {
  status: "ACCEPTED" | "DECLINED";
  responseNotes?: string | null;
}

export interface VoidEnquiryQuoteInput {
  reason: string;
}

export interface EnquiryQuoteMutationResult {
  id: string;
  reference: string;
  status: QuoteStatus;
}

export interface EnquiryQuoteStatusResult {
  id: string;
  reference: string;
  status: QuoteStatus;
  issuedAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
  responseNotes: string | null;
}

export interface EnquiryQuoteVoidResult {
  id: string;
  reference: string;
  status: QuoteStatus;
  pdfPath: string | null;
  issuedAt: string | null;
  updatedAt: string;
}

export interface EnquiryQuoteSendResult {
  data: {
    id: string;
  };
  email: {
    id: string;
    to: string;
    acceptedAt: string;
    status: "SENT";
  };
}


export interface QuoteIssuanceResult {
  requested: boolean;
  success: boolean;
  message: string | null;
}

export interface CreateEnquiryQuoteResult {
  quote: EnquiryQuote;
  issuance: QuoteIssuanceResult;
}


