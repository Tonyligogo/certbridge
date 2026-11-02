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