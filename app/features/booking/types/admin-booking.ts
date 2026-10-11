import { Prisma } from "@/generated/prisma/client";
import { BookingActivityType, BookingStatus, DeliveryMode, InvoiceStatus, PaymentMethod, PaymentStatus, QuoteStatus, ResourceSourcingStatus, TaxType, TrainerAssignmentRole, TrainerStatus, VenueStatus } from "@/generated/prisma/enums";
import { BookingFinancialInvoice } from "../lib/get-booking-financial-state";

export interface GetAdminBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus;
  deliveryMode?: DeliveryMode;
  createdFrom?: string;
  createdTo?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type AdminBookingListItem = {
  id: string;
  reference: string;
  organizationName: string | null;
  contactName: string;
  status: BookingStatus;
  deliveryMode: DeliveryMode;
  preferredStartDate: string | null;
  preferredEndDate: string | null;
  course: {
    title: string;
  };
  participantCount: number;
  trainerConfirmed: boolean;
  venueRequired: boolean;
  venueConfirmed: boolean;
};

export interface AdminBookingsResponse {
  bookings: AdminBookingListItem[];

  pagination: Pagination;
}

export interface BookingDetails {
  id: string;
  reference: string;
  deliveryMode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organizationName: string | null;

  participantCount: number;

  preferredStartDate: string | null;
  preferredEndDate: string | null;

  scheduledStartDate: string | null;
  scheduledEndDate: string | null;

  locationCountry: string | null;
  locationCity: string | null;
  locationAddress: string | null;
  locationNotes: string | null;

  specialRequirements: string | null;

  quotedAmount: string | null;
  finalAmount: string | null;
  currency: string;

  status: string;
}

export const AdminBookingDetailsResponseSelect = {
  // --------------------------------------------------
  // Booking
  // --------------------------------------------------

  id: true,
  reference: true,

  status: true,
  deliveryMode: true,

  organizationName: true,

  contactName: true,
  contactEmail: true,
  contactPhone: true,

  participantCount: true,

  preferredStartDate: true,
  preferredEndDate: true,

  scheduledStartDate: true,
  scheduledEndDate: true,

  locationAddress: true,
  locationCity: true,
  locationCountry: true,
  locationNotes: true,

  specialRequirements: true,
  adminNotes: true,

  currency: true,

  createdAt: true,
  updatedAt: true,

  // --------------------------------------------------
  // Course
  // --------------------------------------------------

  course: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },

  // --------------------------------------------------
  // Participants
  // --------------------------------------------------

  participants: {
    select: {
      id: true,

      firstName: true,
      lastName: true,
      email: true,
      phone: true,

      attended: true,
      certificateIssued: true,
      feedbackSubmitted: true,
    },

    orderBy: [
      {
        lastName: "asc",
      },
      {
        firstName: "asc",
      },
    ],
  },

  // --------------------------------------------------
  // Trainer sourcing
  // --------------------------------------------------

  trainers: {
    select: {
      id: true,

      status: true,
      role: true,

      agreedAmount: true,
      currency: true,

      notes: true,
      confirmedAt: true,

      createdAt: true,
      updatedAt: true,

      trainer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,

          email: true,
          phone: true,

          primaryCountry: true,
          primaryCity: true,

          expertise: true,
          yearsOfExperience: true,

          status: true,
          certified: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  },

  // --------------------------------------------------
  // Venue sourcing
  // --------------------------------------------------

  venues: {
    select: {
      id: true,

      status: true,

      agreedAmount: true,
      currency: true,

      notes: true,
      confirmedAt: true,

      createdAt: true,
      updatedAt: true,

      venue: {
        select: {
          id: true,

          name: true,
          description: true,

          country: true,
          city: true,
          address: true,

          phone: true,
          email: true,
          website: true,

          capacity: true,
          status: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  },

  // --------------------------------------------------
  // Quote
  // --------------------------------------------------

  quote: {
    select: {
      id: true,
      bookingId:true,
      reference: true,
      status: true,
      currency:true,

      taxRate:true,
      taxType:true,
      subtotal: true,
      taxAmount: true,
      totalAmount: true,

      issuedAt: true,
      expiresAt: true,

      acceptedAt: true,
      declinedAt: true,
      responseNotes: true,

      createdAt: true,
      updatedAt: true,

      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          unitPrice: true,
          amount: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  },

  // --------------------------------------------------
  // Invoices
  // --------------------------------------------------

  invoices: {
    select: {
      id: true,
      reference: true,
      bookingId: true,
      quoteId: true,

      status: true,
      currency: true,
      taxRate:true,
      taxType:true,
      subtotal: true,
      taxAmount: true,
      totalAmount: true,

      issuedAt: true,
      dueAt: true,
      notes: true,

      createdAt: true,
      updatedAt: true,

      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          unitPrice: true,
          amount: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },

      payments: {
        select: {
          id: true,
          reference: true,

          amount: true,
          currency: true,

          method: true,
          status: true,

          transactionReference: true,
          paidAt: true,
          notes: true,

          createdAt: true,
          updatedAt: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  },

  // --------------------------------------------------
  // Activity
  // --------------------------------------------------

  activities: {
    select: {
      id: true,
      type: true,
      description: true,

      createdBy: true,

      // if you add the metadata field we discussed:
      // metadata: true,

      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    // Plenty for the initial page.
    take: 50,
  },
} satisfies Prisma.BookingSelect;

export type AdminBookingDetails=
  Prisma.BookingGetPayload<{
    select: typeof AdminBookingDetailsResponseSelect;
  }>;

export type BookingWorkflowInput = {
  status: BookingStatus;
  deliveryMode: DeliveryMode;

  preferredStartDate: string | null;
  preferredEndDate: string | null;

  scheduledStartDate: string | null;
  scheduledEndDate: string | null;

  trainers: Array<{
    status: ResourceSourcingStatus;
  }>;

  venues: Array<{
    status: ResourceSourcingStatus;
  }>;

  quote: {
    status: QuoteStatus;
  } | null;

  invoices: BookingFinancialInvoice[];

  participants: Array<{
    attended: boolean | null;
    certificateIssued: boolean;
    feedbackSubmitted: boolean;
  }>;
};

export interface AdminBookingDetailsResponse {
  id: string;
  reference: string;

  status: BookingStatus;
  deliveryMode: DeliveryMode;

  organizationName: string | null;

  contactName: string;
  contactEmail: string;
  contactPhone: string;

  participantCount: number;

  preferredStartDate: string | null;
  preferredEndDate: string | null;

  scheduledStartDate: string | null;
  scheduledEndDate: string | null;

  locationAddress: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  locationNotes: string | null;

  specialRequirements: string | null;
  adminNotes: string | null;

  currency: string;

  createdAt: string;
  updatedAt: string;

  course: {
    id: string;
    title: string;
    slug: string;
  };

  participants: {
    id: string;

    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    attended: boolean | null;
    certificateIssued: boolean;
    feedbackSubmitted: boolean;
  }[];

  trainers: {
    id: string;

    status: ResourceSourcingStatus;
    role: TrainerAssignmentRole;

    agreedAmount: string | null;
    currency: string;

    notes: string | null;
    confirmedAt: string | null;

    createdAt: string;
    updatedAt: string;

    trainer: {
      id: string;

      firstName: string;
      lastName: string;

      email: string;
      phone: string;

      primaryCountry: string | null;
      primaryCity: string | null;

      expertise: string | null;
      yearsOfExperience: number | null;

      status: TrainerStatus;
      certified: boolean;
    };
  }[];

  venues: {
    id: string;

    status: ResourceSourcingStatus;

    agreedAmount: string | null;
    currency: string;

    notes: string | null;
    confirmedAt: string | null;

    createdAt: string;
    updatedAt: string;

    venue: {
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
      status: VenueStatus;
    };
  }[];

  quote: {
    id: string;
    bookingId: string;
    reference: string;

    status: QuoteStatus;

    taxRate:string,
    taxType:TaxType,
    currency:string,
    subtotal: string;
    taxAmount: string;
    totalAmount: string;

    issuedAt: string | null;
    expiresAt: string | null;

    acceptedAt: string | null;
    declinedAt: string | null;
    responseNotes: string | null;

    createdAt: string;
    updatedAt: string;

    items: {
      id: string;
      name: string;

      quantity: string;
      unitPrice: string;
      amount: string;
    }[];
  } | null;

  invoices: {
    id: string;
    reference: string;
    bookingId: string;
    quoteId: string | null;

    status: InvoiceStatus;
    currency: string;
    taxRate:string,
    taxType:TaxType,
    subtotal: string;
    taxAmount: string;
    totalAmount: string;

    issuedAt: string | null;
    dueAt: string | null;
    notes: string | null;

    createdAt: string;
    updatedAt: string;

    items: {
      id: string;
      name: string;

      quantity: string;
      unitPrice: string;
      amount: string;
      createdAt: string;
      
    }[];

    payments: {
      id: string;
      reference: string;

      amount: string;
      currency: string;

      method: PaymentMethod;
      status: PaymentStatus;

      transactionReference: string | null;
      paidAt: string | null;
      notes: string | null;

      createdAt: string;
      updatedAt: string;
    }[];
  }[];

  activities: {
    id: string;

    type: BookingActivityType;
    description: string;

    createdBy: string | null;

    createdAt: string;
  }[];
}