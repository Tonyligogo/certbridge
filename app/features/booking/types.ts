import { QuoteStatus } from "@/generated/prisma/client";
import { BookingRequestInput } from "./lib/booking-schema";
import { BookingFinancialSummary } from "./lib/get-booking-financial-state";

// Match your Prisma enum (adjust literal values if they differ in your database)
export type DeliveryMode = "ONLINE" | "CLIENT_SITE" | "ARRANGED_VENUE";
export type ParticipantType = "individual" | "group";

export interface ParticipantDraft {
  key: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function prefillFirstParticipant(
  draft: BookingDraft
): BookingDraft {
  const firstParticipant = draft.participants[0];

  if (!firstParticipant) return draft;

  // Only prefill a completely empty participant.
  // Never overwrite someone the user has already entered.
  const isEmpty =
    !firstParticipant.firstName.trim() &&
    !firstParticipant.lastName.trim() &&
    !firstParticipant.email.trim() &&
    !firstParticipant.phone.trim();

  if (!isEmpty) return draft;

  const nameParts = draft.contactName.trim().split(/\s+/).filter(Boolean);

  return {
    ...draft,
    participants: [
      {
        ...firstParticipant,
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" "),
        email: draft.contactEmail.trim(),
        phone: draft.contactPhone.trim(),
      },
      ...draft.participants.slice(1),
    ],
  };
}


export interface BookingDraft {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organizationName: string;
  
  deliveryMode: DeliveryMode;
  participantType: ParticipantType;
  participants: ParticipantDraft[];
  
  locationCountry: string;
  locationCity: string;
  locationAddress: string;
  locationNotes: string;
  
  preferredStartDate: string;
  preferredEndDate: string;
  
  specialRequirements: string;
  quotedAmount: number;
}

export type DraftPatch = Partial<BookingDraft>;
export type FieldErrors = Record<string, string>;

export interface StepProps {
  draft: BookingDraft;
  errors: FieldErrors;
  onChange: (patch: DraftPatch) => void;
}

export function newParticipant(): ParticipantDraft {
  return {
    key: Math.random().toString(36).slice(2),
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };
}

export function emptyDraft(): BookingDraft {
  return {
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organizationName: "",
    deliveryMode: "ONLINE",
    participantType: "individual",
    participants: [newParticipant()],
    locationCountry: "",
    locationCity: "",
    locationAddress: "",
    locationNotes: "",
    preferredStartDate: "",
    preferredEndDate: "",
    specialRequirements: "",
    quotedAmount: 0,
  };
}

// Ensure BookingRequestInput in your schema expects these camelCase fields
export function draftToRequest(draft: BookingDraft, courseIdOrSlug: string): BookingRequestInput {
  return {
    courseId: courseIdOrSlug,
    contactName: draft.contactName,
    contactEmail: draft.contactEmail,
    contactPhone: draft.contactPhone,
    organizationName: draft.organizationName,
    deliveryMode: draft.deliveryMode as Exclude<DeliveryMode, "">,
    
    // Required by your Booking model    
    participants: draft.participants.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
    })),
    
    // Convert empty strings to undefined to satisfy Prisma's optional fields
    locationCountry: draft.locationCountry || undefined,
    locationCity: draft.locationCity || undefined,
    locationAddress: draft.locationAddress || undefined,
    locationNotes: draft.locationNotes || undefined,
    
    preferredStartDate: draft.preferredStartDate,
    preferredEndDate: draft.preferredEndDate,

    quotedAmount: draft.quotedAmount || 0,
    
    specialRequirements: draft.specialRequirements || undefined,
  };
}

export type BookingWorkflowStage =
  | "RESOURCE_SOURCING"
  | "QUOTE_PREPARATION"
  | "AWAITING_QUOTE_RESPONSE"
  | "CONFIRMED"
  | "SCHEDULING"
  | "UPCOMING"
  | "DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export type BookingNextAction =
  | "SOURCE_TRAINER"
  | "SOURCE_VENUE"
  | "CREATE_QUOTE"
  | "SEND_QUOTE"
  | "AWAIT_QUOTE_RESPONSE"
  | "REVISE_QUOTE"
  | "UPDATE_QUOTE_STATUS"
  | "SCHEDULE_TRAINING"
  | "RESCHEDULE_TRAINING"
  | "CREATE_INVOICE"
  | "VIEW_INVOICE"
  | "EDIT_INVOICE"
  | "ISSUE_INVOICE"
  | "RECORD_PAYMENT"
  | "AWAIT_PAYMENT"
  | "PREPARE_FOR_TRAINING"
  | "RECORD_ATTENDANCE"
  | "ISSUE_CERTIFICATES"
  | "COLLECT_FEEDBACK"
  | "COMPLETE_BOOKING"
  | "NONE";

export type BookingActionKind =
  | "ACTION"
  | "WAITING"
  | "INFO";
  
export type InvoiceDisplayStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "PAID"
  | "VOID"; 
  
export type BookingActionPriority =
  | "HIGH"
  | "NORMAL"
  | "LOW";


export type BookingWorkflowAction = {
  type: BookingNextAction;
  kind: BookingActionKind;
  priority: BookingActionPriority;
  label: string;
  description?: string;
};

export type BookingWorkflow = {
  stage: BookingWorkflowStage;

  resources: {
    ready: boolean;

    trainer: {
      required: boolean;
      ready: boolean;
      hasCandidates: boolean;
      confirmedCount: number;
      availableCount: number;
      contactedCount: number;
      consideringCount: number;
    };

    venue: {
      required: boolean;
      ready: boolean;
      hasCandidates: boolean;
      confirmedCount: number;
      availableCount: number;
      contactedCount: number;
      consideringCount: number;
    };
  };

  quote: {
    exists: boolean;
    status: QuoteStatus | null;
    accepted: boolean;
  };

  scheduling: {
    scheduled: boolean;
    startDate: string | null;
    endDate: string | null;
  };

  delivery: {
    upcoming: boolean;
    inProgress: boolean;
    ended: boolean;
  };

  participants: {
    total: number;
    attended: number;
    absent: number;
    certificatesIssued: number;
    feedbackSubmitted: number;
    attendanceRecorded: boolean;
  };

  financial: BookingFinancialSummary;

  actions: BookingWorkflowAction[];

  primaryAction:
    | BookingWorkflowAction
    | null;
};
