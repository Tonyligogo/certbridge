import { queryKeys } from "@/lib/react-query/query-keys";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateBookingPayload } from "../lib/booking-schema";
import { bookingService } from "../services/booking";
import type { GetAdminBookingsParams } from "../types/admin-booking";
import { ScheduleTrainingVariables } from "../types/schedule-training";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingPayload) =>
      bookingService.createBooking(data),

    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.bookings.all(), response);
    },
  });
}

export function useAdminBookings(
  params: GetAdminBookingsParams = {},
) {
  return useQuery({
    queryKey: queryKeys.bookings.adminList(params),

    queryFn: () =>
      bookingService.getAdminBookings(params),

    placeholderData: keepPreviousData,
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(bookingId),
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useAdminBookingDetailsResponse(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.adminDetail(bookingId),
    queryFn: () => bookingService.getBookingDetails(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useScheduleTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: ScheduleTrainingVariables) => {
      return bookingService.scheduleTraining(
        bookingId,
        data
      );
    },

    onSuccess: async (_, {bookingId}) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(bookingId)
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminLists(),
      });
    },
  });
}