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

export interface DashboardData {
  stats: DashboardStats;
  attentionCount: number;
  awaitingResponseCount: number;
  attention: DashboardAttentionItem[];
  awaitingResponse: DashboardAttentionItem[];
  recentBookings: DashboardRecentBooking[];
  upcomingTrainings: DashboardUpcomingTraining[];
  revenue: DashboardRevenuePoint[];
  topCourses: DashboardTopCourse[];
}