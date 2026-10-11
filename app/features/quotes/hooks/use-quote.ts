"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { quoteService } from "../services/quote-service";

import type {
  CreateQuoteInput,
  UpdateQuoteInput,
  UpdateQuoteStatusInput,
} from "../types/quote";
import { queryKeys } from "@/lib/react-query/query-keys";

/**
 * Get the quote for a booking.
 */
export function useQuote(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.quote(bookingId),
    queryFn: () => quoteService.getQuote(bookingId),
    enabled: Boolean(bookingId),
  });
}

/**
 * Create a quote for a booking.
 */
export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: CreateQuoteInput;
    }) => quoteService.createQuote(bookingId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.quote(
          variables.bookingId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}

/**
 * Update a quote.
 */
export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: UpdateQuoteInput;
    }) => quoteService.updateQuote(bookingId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.quote(
          variables.bookingId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: UpdateQuoteStatusInput;
    }) => quoteService.updateQuoteStatus(bookingId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.quote(
          variables.bookingId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}