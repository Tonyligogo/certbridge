import "server-only";

import type {
  DashboardData,
  DashboardAttentionItem,
} from "../types/dashboard";
import { requireAdmin } from "@/lib/server/course";
import prisma from "@/lib/prisma";
import { dashboardWorkflowSelect } from "./dashboard-workflow-select";
import { getBookingWorkflow } from "../../booking/booking";
import { toBookingWorkflowInput } from "./dashboard-select-serializer";


export type DashboardPeriod =
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_90_DAYS"
  | "THIS_YEAR"
  | "ALL_TIME";

type DateRange = {
  gte?: Date;
  lt?: Date;
};

const CURRENCY = "KES";
const ATTENTION_LIMIT = 6;
const RECENT_LIMIT = 8;
const UPCOMING_LIMIT = 6;

function getDateRange(
  period: DashboardPeriod,
  now: Date
): DateRange {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  switch (period) {
    case "THIS_MONTH":
      return {
        gte: new Date(Date.UTC(year, month, 1)),
        lt: new Date(Date.UTC(year, month + 1, 1)),
      };

    case "LAST_MONTH":
      return {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
      };

    case "LAST_90_DAYS":
      return {
        gte: new Date(
          now.getTime() - 90 * 24 * 60 * 60 * 1000
        ),
        lt: now,
      };

    case "THIS_YEAR":
      return {
        gte: new Date(Date.UTC(year, 0, 1)),
        lt: new Date(Date.UTC(year + 1, 0, 1)),
      };

    default:
      return {};
  }
}

function getRevenueMonths(now: Date) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() - 5 + index,
        1
      )
    );

    return {
      key: `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}`,
      month: new Intl.DateTimeFormat("en-KE", {
        month: "short",
        timeZone: "UTC",
      }).format(date),
      amount: 0,
    };
  });
}

function toNumber(value: unknown): number {
  if (value == null) return 0;

  const result = Number(value);

  return Number.isFinite(result) ? result : 0;
}

const priorityOrder = {
  HIGH: 0,
  NORMAL: 1,
  LOW: 2,
} as const;

export async function getDashboardData(
  period: DashboardPeriod = "THIS_MONTH"
): Promise<DashboardData> {
  await requireAdmin();

  const now = new Date();
  const range = getDateRange(period, now);

  const bookingDateFilter = {
    createdAt: range,
  };

  const paymentDateFilter = {
    paidAt: range,
  };

  const revenueStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - 5,
      1
    )
  );

  const [
    totalBookings,
    activeBookings,
    completedBookings,
    recentBookingsRaw,
    workflowBookingsRaw,
    upcomingTrainingsRaw,
    completedPayments,
    revenuePayments,
    financialInvoices,
    topCourseGroups,
  ] = await Promise.all([
    // Total bookings in selected period
    prisma.booking.count({
      where: bookingDateFilter,
    }),

    // Active bookings created in selected period
    prisma.booking.count({
      where: {
        ...bookingDateFilter,
        status: {
          in: ["OPEN", "CONFIRMED"],
        },
      },
    }),

    // Completed bookings created in selected period
    prisma.booking.count({
      where: {
        ...bookingDateFilter,
        status: "COMPLETED",
      },
    }),

    // Recent bookings
    prisma.booking.findMany({
      where: bookingDateFilter,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      take: RECENT_LIMIT,
      select: dashboardWorkflowSelect,
    }),

    // Active bookings requiring workflow evaluation
    prisma.booking.findMany({
      where: {
        status: {
          in: ["OPEN", "CONFIRMED"],
        },
      },
      orderBy: [
        { createdAt: "asc" },
        { id: "asc" },
      ],
      select: dashboardWorkflowSelect,
    }),

    // Upcoming scheduled trainings
    prisma.booking.findMany({
      where: {
        status: {
          in: ["OPEN", "CONFIRMED"],
        },
        scheduledStartDate: {
          gte: now,
        },
      },
      orderBy: [
        { scheduledStartDate: "asc" },
        { id: "asc" },
      ],
      take: UPCOMING_LIMIT,
      select: {
        id: true,
        reference: true,
        organizationName: true,
        scheduledStartDate: true,
        scheduledEndDate: true,
        deliveryMode: true,

        course: {
          select: {
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
      },
    }),

    // Completed payments for selected period
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        currency: CURRENCY,
        ...paymentDateFilter,
      },
      _sum: {
        amount: true,
      },
    }),

    // Last six calendar months of completed payments
    prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        currency: CURRENCY,
        paidAt: {
          gte: revenueStart,
          lt: now,
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    }),

    // Issued invoices with their payments
    prisma.invoice.findMany({
      where: {
        status: "ISSUED",
        currency: CURRENCY,
      },
      select: {
        id: true,
        totalAmount: true,
        dueAt: true,

        payments: {
          where: {
            status: "COMPLETED",
          },
          select: {
            amount: true,
            currency: true,
          },
        },
      },
    }),

    // Most booked courses
    prisma.booking.groupBy({
      by: ["courseId"],
      where: {
        status: {
          not: "CANCELLED",
        },
        ...bookingDateFilter,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          courseId: "desc",
        },
      },
      take: 5,
    }),
  ]);

  // ------------------------------------
  // Financial statistics
  // ------------------------------------

  const revenueCollected = toNumber(
    completedPayments._sum.amount
  );

  let outstandingBalance = 0;
  let overdueInvoiceCount = 0;

  for (const invoice of financialInvoices) {
    const paidAmount = invoice.payments.reduce(
      (sum, payment) =>
        payment.currency === CURRENCY
          ? sum + toNumber(payment.amount)
          : sum,
      0
    );

    const balance = Math.max(
      0,
      toNumber(invoice.totalAmount) - paidAmount
    );

    outstandingBalance += balance;

    if (
      balance > 0 &&
      invoice.dueAt &&
      invoice.dueAt < now
    ) {
      overdueInvoiceCount++;
    }
  }

  // ------------------------------------
  // Workflow actions
  // ------------------------------------

  const attention: DashboardAttentionItem[] = [];
  const awaitingResponse: DashboardAttentionItem[] = [];

  for (const booking of workflowBookingsRaw) {
    const workflow = getBookingWorkflow(
      toBookingWorkflowInput(booking),
      now
    );

    const action = workflow.actions.find(
      (item) => item.kind === "ACTION"
    );

    const waitingAction = workflow.actions.find(
      (item) => item.kind === "WAITING"
    );

    const base = {
      bookingId: booking.id,
      reference: booking.reference,
      organizationName: booking.organizationName,
      courseTitle: booking.course.title,
      createdAt: booking.createdAt.toISOString(),
    };

    if (action) {
      attention.push({
        ...base,
        action,
      });
    } else if (waitingAction) {
      awaitingResponse.push({
        ...base,
        action: waitingAction,
      });
    }
  }

  const sortAttention = (
    items: DashboardAttentionItem[]
  ) =>
    items.sort((a, b) => {
      const priorityDifference =
        priorityOrder[a.action.priority] -
        priorityOrder[b.action.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return a.createdAt.localeCompare(b.createdAt);
    });

  sortAttention(attention);
  sortAttention(awaitingResponse);

  // ------------------------------------
  // Recent bookings
  // ------------------------------------

  const recentBookings = recentBookingsRaw.map(
    (booking) => {
      const workflow = getBookingWorkflow(
        toBookingWorkflowInput(booking),
        now
      );

      return {
        id: booking.id,
        reference: booking.reference,
        organizationName: booking.organizationName,
        contactName: booking.contactName,
        courseTitle: booking.course.title,
        status: booking.status,
        deliveryMode: booking.deliveryMode,
        createdAt: booking.createdAt.toISOString(),
        primaryAction: workflow.primaryAction,
      };
    }
  );

  // ------------------------------------
  // Upcoming trainings
  // ------------------------------------

  const upcomingTrainings = upcomingTrainingsRaw.map(
    (booking) => ({
      id: booking.id,
      reference: booking.reference,
      organizationName: booking.organizationName,
      courseTitle: booking.course.title,
      scheduledStartDate:
        booking.scheduledStartDate!.toISOString(),
      scheduledEndDate:
        booking.scheduledEndDate?.toISOString() ?? null,

      trainerReady: booking.trainers.some(
        (trainer) => trainer.status === "CONFIRMED"
      ),

      venueReady:
        booking.deliveryMode !== "ARRANGED_VENUE" ||
        booking.venues.some(
          (venue) => venue.status === "CONFIRMED"
        ),
    })
  );

  // ------------------------------------
  // Revenue chart
  // ------------------------------------

  const revenue = getRevenueMonths(now);

  const revenueByMonth = new Map(
    revenue.map((month) => [month.key, month])
  );

  for (const payment of revenuePayments) {
    if (!payment.paidAt) continue;

    const key = `${payment.paidAt.getUTCFullYear()}-${String(
      payment.paidAt.getUTCMonth() + 1
    ).padStart(2, "0")}`;

    const month = revenueByMonth.get(key);

    if (month) {
      month.amount += toNumber(payment.amount);
    }
  }

  // ------------------------------------
  // Top courses
  // ------------------------------------

  const courseIds = topCourseGroups.map(
    (group) => group.courseId
  );

  const courses = courseIds.length
    ? await prisma.course.findMany({
        where: {
          id: {
            in: courseIds,
          },
        },
        select: {
          id: true,
          title: true,
        },
      })
    : [];

  const courseTitles = new Map(
    courses.map((course) => [
      course.id,
      course.title,
    ])
  );

  const topCourses = topCourseGroups.map(
    (group) => ({
      courseId: group.courseId,
      title:
        courseTitles.get(group.courseId) ??
        "Unknown course",
      bookings: group._count._all,
    })
  );

  return {
    stats: {
      totalBookings,
      activeBookings,
      completedBookings,
      revenueCollected,
      outstandingBalance,
      currency: CURRENCY,
    },

    attentionCount: attention.length,
    awaitingResponseCount: awaitingResponse.length,

    attention: attention.slice(0, ATTENTION_LIMIT),
    awaitingResponse: awaitingResponse.slice(0, ATTENTION_LIMIT),   

    recentBookings,
    upcomingTrainings,

    revenue: revenue.map(({ month, amount }) => ({
      month,
      amount,
    })),

    topCourses,
  };
}
