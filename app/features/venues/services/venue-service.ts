import { api, type ApiResponse } from "@/lib/api";

import type {
  AddBookingVenueInput,
  BookingVenue,
  CreateVenueInput,
  GetVenuesParams,
  UpdateBookingVenueInput,
  UpdateVenueInput,
  Venue,
  VenueBookingsResponseData,
  VenueDetail,
  VenuesResponse,
} from "../types/venue";

export const venueService = {
  /**
   * Get paginated venue directory.
   */
  async getVenues(
    params: GetVenuesParams = {}
  ): Promise<ApiResponse<VenuesResponse>> {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) {
      searchParams.set("page", String(params.page));
    }

    if (params.pageSize !== undefined) {
      searchParams.set("pageSize", String(params.pageSize));
    }

    if (params.search) {
      searchParams.set("search", params.search);
    }

    if (params.status) {
      searchParams.set("status", params.status);
    }

    if (params.country) {
      searchParams.set("country", params.country);
    }

    if (params.city) {
      searchParams.set("city", params.city);
    }

    const query = searchParams.toString();

    return api.get<VenuesResponse>(
      `/api/admin/venues${query ? `?${query}` : ""}`
    );
  },

  /**
   * Get a single venue.
   */
  async getVenue(
    id: string
  ): Promise<ApiResponse<VenueDetail>> {
    return api.get<VenueDetail>(`/api/admin/venues/${id}`);
  },

  /**
   * Create a venue.
   */
  async createVenue(
    data: CreateVenueInput
  ): Promise<ApiResponse<Venue>> {
    return api.post<Venue>("/api/admin/venues", data);
  },

  /**
   * Update a venue.
   */
  async updateVenue(
    id: string,
    data: UpdateVenueInput
  ): Promise<ApiResponse<Venue>> {
    return api.patch<Venue>(`/api/admin/venues/${id}`, data);
  },

  /**
   * Deactivate a venue.
   */
  async deleteVenue(
    id: string
  ): Promise<ApiResponse<Venue>> {
    return api.delete<Venue>(`/api/admin/venues/${id}`);
  },

  /**
   * Get venues associated with a booking.
   */
  async getBookingVenues(
    bookingId: string
  ): Promise<ApiResponse<BookingVenue[]>> {
    return api.get<BookingVenue[]>(
      `/api/admin/bookings/${bookingId}/venues`
    );
  },

  // get bookings for a venue
  async getVenueBookings(
    id: string
  ): Promise<ApiResponse<VenueBookingsResponseData>> {
    return api.get<VenueBookingsResponseData>(
      `/api/admin/venues/${id}/bookings`
    );
  },

  /**
   * Add a venue to a booking.
   */
  async addBookingVenue(
    bookingId: string,
    data: AddBookingVenueInput
  ): Promise<ApiResponse<BookingVenue>> {
    return api.post<BookingVenue>(
      `/api/admin/bookings/${bookingId}/venues`,
      data
    );
  },

  /**
   * Get venue candidates for a booking.
   */
  async getVenueCandidates(
    bookingId: string,
    params: {
      search?: string;
      country?: string;
      city?: string;
      minCapacity?: number;
    } = {}
  ): Promise<ApiResponse<Venue[]>> {
    const searchParams = new URLSearchParams();

    if (params.search) {
      searchParams.set("search", params.search);
    }

    if (params.country) {
      searchParams.set("country", params.country);
    }

    if (params.city) {
      searchParams.set("city", params.city);
    }

    if (params.minCapacity !== undefined) {
      searchParams.set(
        "minCapacity",
        String(params.minCapacity)
      );
    }

    const query = searchParams.toString();

    return api.get<Venue[]>(
      `/api/admin/bookings/${bookingId}/venues/candidates${
        query ? `?${query}` : ""
      }`
    );
  },

  /**
   * Update a venue associated with a booking.
   */
  async updateBookingVenue(
    bookingId: string,
    venueId: string,
    data: UpdateBookingVenueInput
  ): Promise<ApiResponse<BookingVenue>> {
    return api.patch<BookingVenue>(
      `/api/admin/bookings/${bookingId}/venues/${venueId}`,
      data
    );
  },
};