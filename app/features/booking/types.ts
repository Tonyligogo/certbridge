import { BookingRequestInput } from "./lib/booking-schema";

// Match your Prisma enum (adjust literal values if they differ in your database)
export type DeliveryMode = "ONLINE" | "CLIENT_SITE" | "OUR_VENUE" | "";
export type ParticipantType = "individual" | "group";

export interface ParticipantDraft {
  key: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
    deliveryMode: "",
    participantType: "individual",
    participants: [newParticipant()],
    locationCountry: "",
    locationCity: "",
    locationAddress: "",
    locationNotes: "",
    preferredStartDate: "",
    preferredEndDate: "",
    specialRequirements: "",
  };
}

// Ensure BookingRequestInput in your schema expects these camelCase fields
export function draftToRequest(draft: BookingDraft, courseIdOrSlug: string): BookingRequestInput {
  return {
    courseId: courseIdOrSlug, // Adjust key based on your API (courseId vs courseSlug)
    contactName: draft.contactName,
    contactEmail: draft.contactEmail,
    contactPhone: draft.contactPhone,
    organizationName: draft.organizationName,
    deliveryMode: draft.deliveryMode as Exclude<DeliveryMode, "">,
    
    // Required by your Booking model
    participantCount: draft.participants.length, 
    
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
    
    preferredStartDate: draft.preferredStartDate ? new Date(draft.preferredStartDate) : undefined,
    preferredEndDate: draft.preferredEndDate ? new Date(draft.preferredEndDate) : undefined,
    
    specialRequirements: draft.specialRequirements || undefined,
  };
}