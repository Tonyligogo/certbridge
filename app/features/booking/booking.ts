import { BookingStatus, InvoiceStatus, PaymentStatus, QuoteStatus } from "@/generated/prisma/enums";
import { BookingWorkflowInput } from "./types/admin-booking";
import { Prisma } from "@/generated/prisma/browser";
import { BookingActionKind, BookingActionPriority, BookingWorkflow, BookingWorkflowAction, BookingWorkflowStage, InvoiceDisplayStatus } from "./types";
import { getBookingFinancialSummary } from "./lib/get-booking-financial-state";

type GetBookingActionsInput = {
  booking: BookingWorkflowInput;

  resources: ReturnType<typeof getResourceState>;
  quote: ReturnType<typeof getQuoteState>;
  scheduling: ReturnType<typeof getSchedulingState>;
  delivery: ReturnType<typeof getDeliveryTimingState>;
  participants: ReturnType<typeof getParticipantState>;
  financial: ReturnType<typeof getBookingFinancialSummary>;

  now: Date;
};

export function getBookingWorkflow(
  booking: BookingWorkflowInput,
  now = new Date()
): BookingWorkflow {
  const resources =
    getResourceState(booking);

  const quote =
    getQuoteState(booking);

  const scheduling =
    getSchedulingState(booking);

  const delivery =
    getDeliveryTimingState(booking, now);

  const participants =
    getParticipantState(booking);

  const financial =
  getBookingFinancialSummary(
    booking.invoices
  );

  const stage =
    getBookingStage(booking, now);

  const actions =
    getBookingActions({
      booking,
      resources,
      quote,
      scheduling,
      delivery,
      participants,
      financial,
      now,
    });

  return {
    stage,
    resources,
    quote,
    scheduling,
    delivery,
    participants,
    financial,

    actions,

    primaryAction:
      actions.find(
        ({ priority }) =>
          priority === "HIGH"
      ) ??
      actions.find(
        ({ priority }) =>
          priority === "NORMAL"
      ) ??
      actions[0] ??
      null,
  };
}

export function getResourceRequirements(
  booking: BookingWorkflowInput
) {
  return {
    trainerRequired: true,

    venueRequired:
      booking.deliveryMode === "ARRANGED_VENUE",

    clientLocationRequired:
      booking.deliveryMode === "CLIENT_SITE",

    online:
      booking.deliveryMode === "ONLINE",
  };
}

export function getTrainerState(
  booking: BookingWorkflowInput
) {
  const confirmed = booking.trainers.filter(
    ({ status }) => status === "CONFIRMED"
  );

  const available = booking.trainers.filter(
    ({ status }) => status === "AVAILABLE"
  );

  const contacted = booking.trainers.filter(
    ({ status }) => status === "CONTACTED"
  );

  const considering = booking.trainers.filter(
    ({ status }) => status === "CONSIDERING"
  );

  return {
    required: true,

    ready: confirmed.length > 0,

    confirmedCount: confirmed.length,
    availableCount: available.length,
    contactedCount: contacted.length,
    consideringCount: considering.length,

    hasCandidates: booking.trainers.length > 0,
  };
}

export function getVenueState(
  booking: BookingWorkflowInput
) {
  const required =
    booking.deliveryMode === "ARRANGED_VENUE";

  const confirmed = booking.venues.filter(
    ({ status }) => status === "CONFIRMED"
  );

  const available = booking.venues.filter(
    ({ status }) => status === "AVAILABLE"
  );

  const contacted = booking.venues.filter(
    ({ status }) => status === "CONTACTED"
  );

  const considering = booking.venues.filter(
    ({ status }) => status === "CONSIDERING"
  );

  return {
    required,

    ready:
      !required ||
      confirmed.length > 0,

    confirmedCount: confirmed.length,
    availableCount: available.length,
    contactedCount: contacted.length,
    consideringCount: considering.length,

    hasCandidates: booking.venues.length > 0,
  };
}

export function getResourceState(
  booking: BookingWorkflowInput
) {
  const trainer = getTrainerState(booking);
  const venue = getVenueState(booking);

  return {
    trainer,
    venue,

    ready:
      trainer.ready &&
      venue.ready,
  };
}

export function getQuoteState(
  booking: BookingWorkflowInput
) {
  const quote = booking.quote;

  if (!quote) {
    return {
      exists: false,
      status: null,
      draft: false,
      sent: false,
      accepted: false,
      declined: false,
      expired: false,
      cancelled: false,
    };
  }

  return {
    exists: true,
    status: quote.status,

    draft: quote.status === "DRAFT",
    sent: quote.status === "SENT",
    accepted: quote.status === "ACCEPTED",
    declined: quote.status === "DECLINED",
    expired: quote.status === "EXPIRED",
    cancelled: quote.status === "CANCELLED",
  };
}

export function canCreateQuote(
  booking: BookingWorkflowInput
) {
  const resources = getResourceState(booking);

  return (
    booking.status === "OPEN" &&
    resources.ready &&
    !booking.quote
  );
}

export const QUOTE_TRANSITIONS: Record<
  QuoteStatus,
  QuoteStatus[]
> = {
  DRAFT: ["SENT", "CANCELLED"],

  SENT: [
    "ACCEPTED",
    "DECLINED",
    "EXPIRED",
    "CANCELLED",
  ],

  ACCEPTED: [],
  DECLINED: [],
  EXPIRED: [],
  CANCELLED: [],
};

export const BOOKING_TRANSITIONS: Record<
  BookingStatus,
  BookingStatus[]
> = {
  OPEN: [
    "CONFIRMED",
    "CANCELLED",
  ],

  CONFIRMED: [
    "COMPLETED",
    "CANCELLED",
  ],

  COMPLETED: [],

  CANCELLED: [],
};

export function getSchedulingState(
  booking: BookingWorkflowInput
) {
  const hasStart =
    booking.scheduledStartDate !== null;

  const hasEnd =
    booking.scheduledEndDate !== null;

  return {
    scheduled:
      hasStart && hasEnd,

    partiallyScheduled:
      hasStart !== hasEnd,

    startDate:
      booking.scheduledStartDate,

    endDate:
      booking.scheduledEndDate,
  };
}

export function canScheduleBooking(
  booking: BookingWorkflowInput
) {
  const resources = getResourceState(booking);

  return (
    booking.status === "CONFIRMED" &&
    resources.ready
  );
}

export function getInvoicePaymentState(
  invoice: BookingWorkflowInput["invoices"][number]
) {
  const completedPayments =
    invoice.payments.filter(
      ({ status }) => status === "COMPLETED"
    );

  const paidAmount =
    completedPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0
    );

  const totalAmount =
    Number(invoice.totalAmount);

  const balance =
    totalAmount - paidAmount;

  return {
    paidAmount,
    balance,

    unpaid:
      paidAmount === 0,

    partiallyPaid:
      paidAmount > 0 &&
      balance > 0,

    fullyPaid:
      balance <= 0,
  };
}

export function getInvoiceDisplayStatus(
  invoice: BookingWorkflowInput["invoices"][number],
  now = new Date()
): InvoiceDisplayStatus {
  if (invoice.status === "VOID") {
    return "VOID";
  }

  if (invoice.status === "DRAFT") {
    return "DRAFT";
  }

  const payment = getInvoicePaymentState(invoice);

  if (
    invoice.status === "PAID" ||
    payment.fullyPaid
  ) {
    return "PAID";
  }

  if (
    invoice.dueAt &&
    new Date(invoice.dueAt) < now &&
    payment.balance > 0
  ) {
    return "OVERDUE";
  }

  if (payment.partiallyPaid) {
    return "PARTIALLY_PAID";
  }

  return "ISSUED";
}

export const INVOICE_TRANSITIONS: Record<
  InvoiceStatus,
  InvoiceStatus[]
> = {
  DRAFT: [
    "ISSUED",
    "VOID",
  ],

  ISSUED: [
    "PAID",
    "VOID",
  ],

  PAID: [],

  VOID: [],
};

export function canCreateInvoice(
  booking: BookingWorkflowInput
) {
  return (
    booking.status === "CONFIRMED" &&
    booking.quote?.status === "ACCEPTED"
  );
}

export function getBookingFinancialState(
  booking: BookingWorkflowInput
) {
  const activeInvoices =
    booking.invoices.filter(
      ({ status }) => status !== "VOID"
    );

  const issuedInvoices =
    activeInvoices.filter(
      ({ status }) => status !== "DRAFT"
    );

  const totalInvoiced =
    issuedInvoices.reduce(
      (total, invoice) =>
        total.plus(invoice.totalAmount),
      new Prisma.Decimal(0)
    );

  const totalPaid =
    issuedInvoices.reduce(
      (total, invoice) =>
        total.plus(
          getInvoicePaymentState(invoice).paidAmount
        ),
      new Prisma.Decimal(0)
    );

  const balance =
    totalInvoiced.minus(totalPaid);

  return {
    hasInvoices:
      activeInvoices.length > 0,

    hasIssuedInvoices:
      issuedInvoices.length > 0,

    totalInvoiced,
    totalPaid,
    balance,

    fullyPaid:
      totalInvoiced.gt(0) &&
      balance.lte(0),

    partiallyPaid:
      totalPaid.gt(0) &&
      balance.gt(0),

    unpaid:
      totalInvoiced.gt(0) &&
      totalPaid.eq(0),
  };
}

export function canRecordPayment(
  invoice: BookingWorkflowInput["invoices"][number]
) {
  return (
    invoice.status === "ISSUED"
  );
}

export const PAYMENT_TRANSITIONS: Record<
  PaymentStatus,
  PaymentStatus[]
> = {
  PENDING: [
    "COMPLETED",
    "FAILED",
    "CANCELLED",
  ],

  COMPLETED: [
    "REFUNDED",
  ],

  FAILED: [],

  REFUNDED: [],

  CANCELLED: [],
};

export function getDeliveryTimingState(
  booking: BookingWorkflowInput,
  now = new Date()
) {
  const start = booking.scheduledStartDate;
  const end = booking.scheduledEndDate;

  if (!start || !end) {
    return {
      scheduled: false,
      upcoming: false,
      inProgress: false,
      ended: false,
    };
  }

  return {
    scheduled: true,

    upcoming:
      now < new Date(start),

    inProgress:
      now >= new Date(start) &&
      now <= new Date(end),

    ended:
      now > new Date(end),
  };
}

export function getParticipantState(
  booking: BookingWorkflowInput
) {
  const total =
    booking.participants.length;

  const attended =
    booking.participants.filter(
      ({ attended }) => attended
    ).length;

  const attendanceRecorded =
  booking.participants.length > 0 &&
  booking.participants.every(
    ({ attended }) => attended !== null
  );

  const certificatesIssued =
    booking.participants.filter(
      ({ certificateIssued }) =>
        certificateIssued
    ).length;

  const feedbackSubmitted =
    booking.participants.filter(
      ({ feedbackSubmitted }) =>
        feedbackSubmitted
    ).length;

  const attendeesWithoutCertificates =
    booking.participants.filter(
      (participant) =>
        participant.attended &&
        !participant.certificateIssued
    ).length;

  return {
    total,
    attended,
    absent: total - attended,

    certificatesIssued,
    feedbackSubmitted,

    attendeesWithoutCertificates,

    attendanceRecorded
  };
}

export function canIssueCertificate(
  participant: {
    attended: boolean | null;
    certificateIssued: boolean;
  }
) {
  return (
    participant.attended === true &&
    !participant.certificateIssued
  );
}

export function canCompleteBooking(
  booking: BookingWorkflowInput,
  now = new Date()
) {
  const timing =
    getDeliveryTimingState(booking, now);

  const attendanceRecorded =
    booking.participants.length > 0 &&
    booking.participants.every(
      ({ attended }) =>
        attended !== null
    );

  return (
    booking.status === "CONFIRMED" &&
    timing.ended &&
    attendanceRecorded
  );
}
export function getBookingStage(
  booking: BookingWorkflowInput,
  now = new Date()
): BookingWorkflowStage {
  if (booking.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (booking.status === "COMPLETED") {
    return "COMPLETED";
  }

  const timing =
    getDeliveryTimingState(booking, now);

  if (timing.ended) {
    return "DELIVERY";
  }

  if (timing.upcoming || timing.inProgress) {
    return "UPCOMING";
  }

  const resources =
    getResourceState(booking);

  const quote =
    getQuoteState(booking);

  if (booking.status === "CONFIRMED") {
    return "SCHEDULING";
  }

  if (quote.sent) {
    return "AWAITING_QUOTE_RESPONSE";
  }

  if (quote.draft) {
    return "QUOTE_PREPARATION";
  }

  if (resources.ready && !quote.exists) {
    return "QUOTE_PREPARATION";
  }

  return "RESOURCE_SOURCING";
}

export function getBookingActions(
  input: GetBookingActionsInput
): BookingWorkflowAction[] {
  const {
    booking,
    resources,
    quote,
    scheduling,
    delivery,
    participants,
    financial,
    now,
  } = input;

  const actions: BookingWorkflowAction[] = [];

  if (booking.status === "CANCELLED") {
    return [];
  }

  // Completed bookings may still have financial work.
  if (booking.status === "COMPLETED") {
    addFinancialActions({
      booking,
      financial,
      actions,
      now,
    });

    return sortBookingActions(actions);
  }

  // Resources.
  addResourceActions({
    resources,
    actions,
  });

  if (!resources.ready) {
    return sortBookingActions(actions);
  }

  // Quote / commercial acceptance.
  const commercialReady =
    addQuoteActions({
      quote,
      actions,
    });

  if (!commercialReady) {
    return sortBookingActions(actions);
  }

  // Scheduling.
  addSchedulingActions({
    scheduling,
    delivery,
    actions,
  });

  // Finance runs in parallel after acceptance.
  addFinancialActions({
    booking,
    financial,
    actions,
    now,
  });

   // Delivery / post-training.
  addDeliveryActions({
    delivery,
    participants,
    actions,
  });

  return sortBookingActions(actions);
}

const ACTION_PRIORITY: Record<
  BookingActionPriority,
  number
> = {
  HIGH: 0,
  NORMAL: 1,
  LOW: 2,
};

const ACTION_KIND_PRIORITY: Record<
  BookingActionKind,
  number
> = {
  ACTION: 0,
  WAITING: 1,
  INFO: 2,
};

export function sortBookingActions(
  actions: BookingWorkflowAction[]
) {
  return [...actions].sort((a, b) => {
    const priorityDifference =
      ACTION_PRIORITY[a.priority] -
      ACTION_PRIORITY[b.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      ACTION_KIND_PRIORITY[a.kind] -
      ACTION_KIND_PRIORITY[b.kind]
    );
  });
}

function addFinancialActions({
  booking,
  financial,
  actions,
  now,
}: {
  booking: BookingWorkflowInput;
  financial: ReturnType<typeof getBookingFinancialSummary>;
  actions: BookingWorkflowAction[];
  now: Date;
}) {
  if (!financial.hasInvoices) {
    actions.push({
      type: "CREATE_INVOICE",
      kind: "ACTION",
      priority: "NORMAL",
      label: "Create invoice",
      description:
        "Create an invoice for the agreed charges.",
    });

    return;
  }

  const activeInvoices = booking.invoices.filter(
    ({ status }) => status !== "VOID"
  );

  const draftInvoices = activeInvoices.filter(
    ({ status }) => status === "DRAFT"
  );

  const issuedInvoices = activeInvoices.filter(
    ({ status }) => status === "ISSUED"
  );

  if (draftInvoices.length > 0) {
    actions.push({
      type: "ISSUE_INVOICE",
      kind: "ACTION",
      priority: "NORMAL",
      label:
        draftInvoices.length === 1
          ? "Issue invoice"
          : `Issue ${draftInvoices.length} invoices`,
      description:
        "There are draft invoices that have not yet been issued.",
    });
  }

  const hasOverdueInvoice =
    issuedInvoices.some((invoice) => {
      if (!invoice.dueAt) {
        return false;
      }

      const payment =
        getInvoicePaymentState(invoice);

      return (
        new Date(invoice.dueAt) < now &&
        payment.balance > 0
      );
    });

  if (hasOverdueInvoice) {
    actions.push({
      type: "RECORD_PAYMENT",
      kind: "ACTION",
      priority: "HIGH",
      label: "Payment overdue",
      description:
        "One or more invoices are overdue with an outstanding balance.",
    });

    return;
  }

 const hasOutstandingIssuedInvoices =
    issuedInvoices.some(
      (invoice) =>
        getInvoicePaymentState(invoice).balance > 0
    );

  if (hasOutstandingIssuedInvoices) {
    actions.push({
      type: "AWAIT_PAYMENT",
      kind: "WAITING",
      priority: "LOW",
      label: "Awaiting payment",
      description:
        "Issued invoices have outstanding balances.",
    });
  }
}

function addResourceActions({
  resources,
  actions,
}: {
  resources: ReturnType<typeof getResourceState>;
  actions: BookingWorkflowAction[];
}) {
  if (!resources.trainer.ready) {
    actions.push({
      type: "SOURCE_TRAINER",
      kind: "ACTION",
      priority: "HIGH",
      label: resources.trainer.hasCandidates
        ? "Continue trainer sourcing"
        : "Find a trainer",
      description: resources.trainer.hasCandidates
        ? "No trainer has been confirmed yet. Review the current trainer candidates and secure one for this booking."
        : "A trainer is required before this booking can proceed to quotation.",
    });
  }

  if (
    resources.venue.required &&
    !resources.venue.ready
  ) {
    actions.push({
      type: "SOURCE_VENUE",
      kind: "ACTION",
      priority: "HIGH",
      label: resources.venue.hasCandidates
        ? "Continue venue sourcing"
        : "Find a venue",
      description: resources.venue.hasCandidates
        ? "No venue has been confirmed yet. Review the current venue candidates and secure one for this booking."
        : "A venue must be arranged before this booking can proceed to quotation.",
    });
  }

  /*
   * Don't suggest quote actions until all required
   * resources have been secured.
   */
  if (!resources.ready) {
    return sortBookingActions(actions);
  }
}


function addQuoteActions({
  quote,
  actions,
}: {
  quote: ReturnType<typeof getQuoteState>;
  actions: BookingWorkflowAction[];
}): boolean {
  if (!quote.exists) {
    actions.push({
      type: "CREATE_QUOTE",
      kind: "ACTION",
      priority: "HIGH",
      label: "Prepare quote",
      description:
        "All required resources have been secured. Prepare a quote for the client.",
    });

    return false;
  }

  if (quote.status === "DRAFT") {
    actions.push({
      type: "SEND_QUOTE",
      kind: "ACTION",
      priority: "HIGH",
      label: "Review and send quote",
      description:
        "The quote is still in draft. Review the pricing and send it to the client when ready.",
    });

    return false;
  }

  if (quote.status === "SENT") {
    actions.push({
      type: "AWAIT_QUOTE_RESPONSE",
      kind: "WAITING",
      priority: "NORMAL",
      label: "Awaiting client response",
      description:
        "The quote has been sent and is awaiting the client's response.",
    });

    return false;
  }

  if (
    quote.status === "DECLINED" ||
    quote.status === "EXPIRED" ||
    quote.status === "CANCELLED"
  ) {
    actions.push({
      type: "REVISE_QUOTE",
      kind: "ACTION",
      priority: "HIGH",
      label: "Revise quote",
      description:
        quote.status === "DECLINED"
          ? "The client declined the quote. Review the requirements or pricing before preparing a revision."
          : quote.status === "EXPIRED"
            ? "The quote has expired. Review it before issuing a revised quote."
            : "The quote was cancelled. Prepare a revision if this booking is still proceeding.",
    });

    return false;
  }

  // Accepted quotations allow the workflow to continue.
  if (quote.accepted) {
    return true;
  }

  // Unknown or inconsistent quotation state.
  return false;
}


function addSchedulingActions({
  scheduling,
  delivery,
  actions,
}: {
  scheduling: ReturnType<typeof getSchedulingState>;
  delivery: ReturnType<typeof getDeliveryTimingState>;
  actions: BookingWorkflowAction[];
}) {
  if (!scheduling.scheduled) {
    actions.push({
      type: scheduling.partiallyScheduled
        ? "RESCHEDULE_TRAINING"
        : "SCHEDULE_TRAINING",
      kind: "ACTION",
      priority: "HIGH",
      label: scheduling.partiallyScheduled
        ? "Complete training schedule"
        : "Schedule training",
      description:
        "Set the final training start and end dates.",
    });

    return;
  }

  if (delivery.upcoming) {
    actions.push({
      type: "PREPARE_FOR_TRAINING",
      kind: "INFO",
      priority: "LOW",
      label: "Prepare for training",
      description:
        "Review participants, trainer, venue and delivery arrangements before the training date.",
    });
  }
}

function addDeliveryActions({
  delivery,
  participants,
  actions,
}: {
  delivery: ReturnType<typeof getDeliveryTimingState>;
  participants: ReturnType<typeof getParticipantState>;
  actions: BookingWorkflowAction[];
}) {
  if (delivery.inProgress) {
    actions.push({
      type: "PREPARE_FOR_TRAINING",
      kind: "INFO",
      priority: "NORMAL",
      label: "Training in progress",
      description:
        "The scheduled training is currently in progress.",
    });

    return sortBookingActions(actions);
  }
  if (delivery.ended) {
    if (!participants.attendanceRecorded) {
      actions.push({
        type: "RECORD_ATTENDANCE",
        kind: "ACTION",
        priority: "HIGH",
        label: "Record attendance",
        description:
          "Training has ended. Record attendance for all participants.",
      });

      return sortBookingActions(actions);
    }

    if (participants.attendeesWithoutCertificates > 0) {
      actions.push({
        type: "ISSUE_CERTIFICATES",
        kind: "ACTION",
        priority: "NORMAL",
        label: "Issue certificates",
        description: `${participants.attendeesWithoutCertificates} ${
          participants.attendeesWithoutCertificates === 1
            ? "attendee has"
            : "attendees have"
        } not yet been issued a certificate.`,
      });
    }

    const attendeesWithoutFeedback =
      participants.attended -
      participants.feedbackSubmitted;

    if (attendeesWithoutFeedback > 0) {
      actions.push({
        type: "COLLECT_FEEDBACK",
        kind: "ACTION",
        priority: "LOW",
        label: "Collect feedback",
        description:
          "Some attendees have not yet submitted training feedback.",
      });
    }

    /*
     * Certificates and feedback don't necessarily have to
     * block completion.
     *
     * Attendance is the hard requirement.
     */
    actions.push({
      type: "COMPLETE_BOOKING",
      kind: "ACTION",
      priority:
        participants.attendeesWithoutCertificates === 0
          ? "HIGH"
          : "NORMAL",
      label: "Complete booking",
      description:
        participants.attendeesWithoutCertificates > 0
          ? "Attendance is complete. The booking can be completed, although some certificates are still outstanding."
          : "Training and attendance are complete. Mark this booking as completed.",
    });
  }

  return sortBookingActions(actions);

}