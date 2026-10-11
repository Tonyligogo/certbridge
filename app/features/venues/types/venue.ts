export type VenueStatus = "ACTIVE" | "INACTIVE";

export type BookingVenueStatus =
  | "CONSIDERING"
  | "CONTACTED"
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "CONFIRMED"
  | "REPLACED"
  | "CANCELLED";

export interface Venue {
  id: string;
  name: string;
  description: string | null;

  country: string;
  city: string;
  address: string | null;

  phone: string | null;
  email: string | null;
  website: string | null;

  capacity: number | null;
  notes: string | null;

  status: VenueStatus;

  createdAt: Date;
  updatedAt: Date;

  _count?: {
    bookings: number;
  };
}

export interface BookingVenue {
  id: string;

  bookingId: string;
  venueId: string;

  status: BookingVenueStatus;

  agreedAmount: string | null;
  currency: string;

  notes: string | null;

  assignedAt: string | null;
  confirmedAt: string | null;

  createdAt: Date;
  updatedAt: Date;

  venue: Venue;
}

export interface BookingVenueBooking {
  id: string;
  reference: string;
  status: string;
  participantCount: number;

  course: {
    id: string;
    title: string;
  };
}

export interface VenueBookingHistory extends BookingVenue {
  booking: BookingVenueBooking;
}

export interface VenueDetail extends Venue {
  bookings: VenueBookingHistory[];
}

export interface VenueBookings extends BookingVenue {
  id: string;
  booking: {
    id: string;
    reference: string;
    status: string;
    participantCount: number;
    course: {
      id: string;
      title: string;
    };
  };
}

export interface VenueBookingsResponseData {
  id: string;
  bookings: VenueBookings[];
}

export interface VenuePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GetVenuesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: VenueStatus;
  country?: string;
  city?: string;
}

export interface VenuesResponse {
  venues: Venue[];
  pagination: VenuePagination;
}

export interface CreateVenueInput {
  name: string;
  description?: string;
  country: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number | null;
  notes?: string;
  status?: VenueStatus;
}

export type UpdateVenueInput = Partial<CreateVenueInput>;

export interface AddBookingVenueInput {
  venueId: string;
  status?: BookingVenueStatus;
  agreedAmount?: string | null;
  currency?: string;
  notes?: string | null;
}

export interface UpdateBookingVenueInput {
  status?: BookingVenueStatus;
  agreedAmount?: string | null;
  currency?: string;
  notes?: string | null;
}