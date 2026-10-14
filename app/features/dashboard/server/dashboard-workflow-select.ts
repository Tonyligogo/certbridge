import type { Prisma } from "@/generated/prisma/client";

export const dashboardWorkflowSelect = {
  id: true,
  reference: true,
  organizationName: true,
  contactName: true,
  createdAt: true,

  status: true,
  deliveryMode: true,

  preferredStartDate: true,
  preferredEndDate: true,
  scheduledStartDate: true,
  scheduledEndDate: true,

  course: {
    select: {
      id: true,
      title: true,
    },
  },

  trainers: {
    select: {
      status: true,
    },
  },

  venues: {
    select: {
      status: true,
    },
  },

  quote: {
    select: {
      status: true,
    },
  },

  invoices: {
    select: {
      id: true,
      reference: true,
      status: true,
      currency: true,
      totalAmount: true,
      issuedAt: true,
      dueAt: true,

      payments: {
        select: {
          amount: true,
          status: true,
        },
      },
    },
  },

  participants: {
    select: {
      attended: true,
      certificateIssued: true,
      feedbackSubmitted: true,
    },
  },
} satisfies Prisma.BookingSelect;