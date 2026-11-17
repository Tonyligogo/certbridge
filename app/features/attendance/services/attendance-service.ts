import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";

import type {
  BookingAttendance,
  RecordAttendanceInput,
} from "../types/attendance";

export const attendanceService = {
  async getAttendance(
    bookingId: string
  ): Promise<ApiResponse<BookingAttendance>> {
    return api.get<BookingAttendance>(
      `/api/admin/bookings/${bookingId}/attendance`
    );
  },

  async recordAttendance(
    bookingId: string,
    data: RecordAttendanceInput
  ): Promise<ApiResponse<BookingAttendance>> {
    return api.patch<BookingAttendance>(
      `/api/admin/bookings/${bookingId}/attendance`,
      data
    );
  },
};