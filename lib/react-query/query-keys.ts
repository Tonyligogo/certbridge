import { GetAdminBookingsParams } from "@/app/features/booking/types/admin-booking";
import { GetEnquiriesParams } from "@/app/features/enquiry/types";
import { GetTrainersParams } from "@/app/features/trainers/services/trainer-service";
import { GetVenuesParams } from "@/app/features/venues/types/venue";

export const queryKeys = {
  profile: ["profile"] as const,

  participants: ["participants"] as const,

  courses: ["courses"] as const,

  courseCategories: ["courseCategories"] as const,

  courseAudiences: ["courseAudiences"] as const,

  bookings: {
    all: () => ["bookings"] as const,

    admin: () => ["bookings", "admin"] as const,

    adminLists: () => ["bookings", "admin", "list"] as const,

    adminList: (params: GetAdminBookingsParams) =>
      ["bookings", "admin", "list", params] as const,

    adminDetail: (id: string) => ["bookings", "admin", "detail", id] as const,

    detail: (id: string) => ["bookings", "detail", id] as const,

    quote: (bookingId: string) => ["bookings", bookingId, "quote"] as const,

    trainers: (bookingId: string) =>
      ["bookings", bookingId, "trainers"] as const,

    trainerCandidates: (bookingId: string, search?: string) =>
      ["bookings", bookingId, "trainer-candidates", search ?? ""] as const,

    venues: (bookingId: string) => ["bookings", bookingId, "venues"] as const,

    venueCandidates: (
      bookingId: string,
      params?: {
        search?: string;
        country?: string;
        city?: string;
        minCapacity?: number;
      },
    ) => ["bookings", bookingId, "venue-candidates", params ?? {}] as const,
    invoices: (bookingId: string) =>
      ["bookings", "admin", "detail", bookingId, "invoices"] as const,

    invoice: (bookingId: string, invoiceId: string) =>
      [
        "bookings",
        "admin",
        "detail",
        bookingId,
        "invoices",
        invoiceId,
      ] as const,

    payments: (bookingId: string, invoiceId: string) =>
      [
        "bookings",
        "admin",
        "detail",
        bookingId,
        "invoices",
        invoiceId,
        "payments",
      ] as const,

    attendance: (bookingId: string) =>
      ["bookings", "admin", "detail", bookingId, "attendance"] as const,
  },

  courseOptions: {
    all: () => ["course-options"] as const,

    search: (search: string) => ["course-options", "search", search] as const,
  },

  trainers: {
    all: () => ["trainers"] as const,

    lists: () => ["trainers", "list"] as const,

    list: (params: GetTrainersParams) => ["trainers", "list", params] as const,

    details: () => ["trainers", "detail"] as const,

    detail: (id: string) => ["trainers", "detail", id] as const,

    certifications: (trainerId: string) =>
      ["trainers", "detail", trainerId, "certifications"] as const,
  },

  venues: {
    all: () => ["venues"] as const,

    lists: () => ["venues", "list"] as const,

    list: (params: GetVenuesParams) => ["venues", "list", params] as const,

    details: () => ["venues", "detail"] as const,

    detail: (id: string) => ["venues", "detail", id] as const,

    bookings: (id: string) => ["venues", id, "bookings"] as const,
  },

  enquiries: {
    all: () => ["enquiries"] as const,

    // Enquiry lists
    lists: () => ["enquiries", "list"] as const,

    list: (params: GetEnquiriesParams) =>
      ["enquiries", "list", params] as const,

    // Enquiry details
    details: () => ["enquiries", "detail"] as const,

    detail: (id: string) => ["enquiries", "detail", id] as const,

    // Activity history
    activities: (id: string) =>
      ["enquiries", "detail", id, "activities"] as const,

    // Quotations
    quotes: (id: string) => ["enquiries", "detail", id, "quotes"] as const,

    quote: (enquiryId: string, quoteId: string) =>
      ["enquiries", "detail", enquiryId, "quotes", quoteId] as const,
  },
};
