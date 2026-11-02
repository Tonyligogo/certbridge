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
  } | null;

  activities: AdminEnquiryActivity[];
}