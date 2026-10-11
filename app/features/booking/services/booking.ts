import { BookingConfirmation, BookingRequestInput } from "@/app/features/booking/lib/booking-schema";
import { api, ApiResponse } from "@/lib/api";
import { AdminBookingDetailsResponse, AdminBookingsResponse, BookingDetails, GetAdminBookingsParams } from "../types/admin-booking";
import { ScheduleTrainingInput, ScheduleTrainingResponse } from "../types/schedule-training";

export interface ConfirmedBooking extends BookingConfirmation {
  course: {
    title: string;
  };
}

export const bookingService = {
  async createBooking(data: BookingRequestInput) {
    const response = await api.post<ConfirmedBooking>(
      "/api/bookings",
      data,
    );

    return response.data;
  },

  async getAdminBookings(
    params: GetAdminBookingsParams = {},
  ) {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) {
      searchParams.set("page", String(params.page));
    }

    if (params.limit !== undefined) {
      searchParams.set("limit", String(params.limit));
    }

    if (params.search) {
      searchParams.set("search", params.search);
    }

    if (params.status) {
      searchParams.set("status", params.status);
    }

    if (params.deliveryMode) {
      searchParams.set("deliveryMode", params.deliveryMode);
    }

    if (params.createdFrom) {
      searchParams.set("createdFrom", params.createdFrom);
    }

    if (params.createdTo) {
      searchParams.set("createdTo", params.createdTo);
    }

    const query = searchParams.toString();

    const response =  api.get<AdminBookingsResponse>(
      `/api/admin/bookings${query ? `?${query}` : ""}`,
    );
    return response
  },

  async getBooking(
    bookingId: string
  ): Promise<ApiResponse<BookingDetails>> {
    return api.get<BookingDetails>(
      `/api/admin/bookings/${bookingId}`
    );
  },

  async getBookingDetails(
    bookingId: string
  ): Promise<ApiResponse<AdminBookingDetailsResponse>> {
    return api.get<AdminBookingDetailsResponse>(
      `/api/admin/bookings/${bookingId}/details`
    );
  },

  async scheduleTraining(
  bookingId: string,
  data: ScheduleTrainingInput
): Promise<ApiResponse<ScheduleTrainingResponse>> {
  return api.patch<ScheduleTrainingResponse>(
    `/api/admin/bookings/${bookingId}/schedule`,
    data
  );
}
};