import type {
  BookingStatus,
  DeliveryMode,
} from "@/generated/prisma/enums";
import type { BookingWorkflowAction } from "../../booking/types";


export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  revenueCollected: number;
  outstandingBalance: number;
  currency: string;
  totalEnquiries: number;
newEnquiries: number;
convertedEnquiries: number;
pendingEnquiries: number;
}

export interface DashboardAttentionItem {
  bookingId: string;
  reference: string;
  organizationName: string | null;
  courseTitle: string;
  action: BookingWorkflowAction;
  createdAt: string;
}

export interface DashboardRecentBooking {
  id: string;
  reference: string;
  organizationName: string | null;
  contactName: string;
  courseTitle: string;
  status: BookingStatus;
  deliveryMode: DeliveryMode;
  createdAt: string;
  primaryAction: BookingWorkflowAction | null;
}

export interface DashboardUpcomingTraining {
  id: string;
  reference: string;
  organizationName: string | null;
  courseTitle: string;
  scheduledStartDate: string;
  scheduledEndDate: string | null;
  trainerReady: boolean;
  venueReady: boolean;
}

export interface DashboardRevenuePoint {
  month: string;
  amount: number;
}

export interface DashboardTopCourse {
  courseId: string;
  title: string;
  bookings: number;
}

export interface DashboardRecentEnquiries{
  id: string;
  reference: string;

  type: "QUOTE" | "GENERAL";

  status:
    | "NEW"
    | "CONTACTED"
    | "IN_PROGRESS"
    | "CONVERTED"
    | "CLOSED";

  fullName: string;
  organization: string | null;
  courseName: string | null;

  participantCount: number | null;

  deliveryMode:
    | "ONLINE"
    | "CLIENT_SITE"
    | "ARRANGED_VENUE"
    | null;

  preferredDate: string | null;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentEnquiries: DashboardRecentEnquiries[];
  attentionCount: number;
  awaitingResponseCount: number;
  attention: DashboardAttentionItem[];
  awaitingResponse: DashboardAttentionItem[];
  recentBookings: DashboardRecentBooking[];
  upcomingTrainings: DashboardUpcomingTraining[];
  revenue: DashboardRevenuePoint[];
  topCourses: DashboardTopCourse[];
}