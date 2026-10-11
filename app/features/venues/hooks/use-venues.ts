"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


import { venueService } from "../services/venue-service";

import type {
  AddBookingVenueInput,
  CreateVenueInput,
  GetVenuesParams,
  UpdateBookingVenueInput,
  UpdateVenueInput,
} from "../types/venue";
import { queryKeys } from "@/lib/react-query/query-keys";

// get venues
export function useVenues(
  params: GetVenuesParams = {}
) {
  return useQuery({
    queryKey: queryKeys.venues.list(params),

    queryFn: () =>
      venueService.getVenues(params),

    placeholderData: (previousData) =>
      previousData,
  });
}

// get single venue
export function useVenue(id: string) {
  return useQuery({
    queryKey: queryKeys.venues.detail(id),

    queryFn: () =>
      venueService.getVenue(id),

    enabled: Boolean(id),
  });
}

// create venue
export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVenueInput) =>
      venueService.createVenue(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.lists(),
      });
    },
  });
}

// update venue
export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateVenueInput;
    }) =>
      venueService.updateVenue(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.detail(
          variables.id
        ),
      });
    },
  });
}

// deactivate venue
export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      venueService.deleteVenue(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.detail(id),
      });
    },
  });
}

// get booking venues
export function useBookingVenues(
  bookingId: string
) {
  return useQuery({
    queryKey: queryKeys.bookings.venues(bookingId),

    queryFn: () =>
      venueService.getBookingVenues(bookingId),

    enabled: Boolean(bookingId),
  });
}

// get venue bookings
export function useVenueBookings(
  id: string
) {
  return useQuery({
    queryKey: queryKeys.venues.bookings(id),

    queryFn: () =>
      venueService.getVenueBookings(id),

    enabled: Boolean(id),
  });
}

// add venue to booking
export function useAddBookingVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: AddBookingVenueInput;
    }) =>
      venueService.addBookingVenue(
        bookingId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });
    },
  });
}

// get venue candidates
export function useVenueCandidates(
  bookingId: string,
  params: {
    search?: string;
    country?: string;
    city?: string;
    minCapacity?: number;
  } = {}
) {
  return useQuery({
    queryKey: queryKeys.bookings.venueCandidates(
      bookingId,
      params
    ),

    queryFn: () =>
      venueService.getVenueCandidates(
        bookingId,
        params
      ),

    enabled: Boolean(bookingId),
  });
}

// update booking venue
export function useUpdateBookingVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      venueId,
      data,
    }: {
      bookingId: string;
      venueId: string;
      data: UpdateBookingVenueInput;
    }) =>
      venueService.updateBookingVenue(
        bookingId,
        venueId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.venues(
          variables.bookingId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.venueCandidates(
          variables.bookingId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.adminDetail(
          variables.bookingId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.detail(
          variables.venueId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.venues.lists(),
      });
    },
  });
}