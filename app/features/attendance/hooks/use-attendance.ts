"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { attendanceService } from "../services/attendance-service";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { RecordAttendanceInput } from "../types/attendance";

export function useBookingAttendance(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.attendance(bookingId),
    queryFn: async () => {
      const response =
        await attendanceService.getAttendance(bookingId);

      if (!response.data) {
        throw new Error("Attendance data was not returned.");
      }

      return response.data;
    },
    enabled: Boolean(bookingId),
  });
}

interface RecordAttendanceVariables {
  bookingId: string;
  data: RecordAttendanceInput;
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, data }: RecordAttendanceVariables) =>
      attendanceService.recordAttendance(bookingId, data),

    onSuccess: async (_response, { bookingId }) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(bookingId),
      });
    },
  });
}