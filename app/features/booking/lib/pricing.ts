// Enums matching your exact Prisma schema
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type DeliveryMode = "ONLINE" | "CLIENT_SITE" | "OUR_VENUE";
export type BookingStatus = 
  | "PENDING"
  | "QUOTED"
  | "CONFIRMED"
  | "TRAINER_ASSIGNED"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  ONLINE: "Online",
  CLIENT_SITE: "Client Site",
  OUR_VENUE: "Our Venue",
};

export const DELIVERY_MODE_DESCRIPTIONS: Record<DeliveryMode, string> = {
  ONLINE: "Live virtual classroom, joined from anywhere.",
  CLIENT_SITE: "Our facilitator delivers the training directly at your premises.",
  OUR_VENUE: "Delivered at one of our fully equipped training venues.",
};

export function deliveryModeLabel(mode: DeliveryMode): string {
  return DELIVERY_MODE_LABELS[mode] ?? mode;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CourseAudience {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CoursePricing {
  id: string;
  courseId: string;
  deliveryMode: DeliveryMode;
  amount: number;
  currency: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  estimatedDuration?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Course {
  id: string;
  categoryId: string;
  category?: CourseCategory;
  pricing?: CoursePricing | null;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  durationDays: number;
  level: CourseLevel;
  status: CourseStatus;
  thumbnailUrl?: string | null;
  featured: boolean;
  certificateProvided: boolean;
  isPopular: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  audiences?: CourseAudience[];
  modules?: CourseModule[];
}

export interface PriceEstimate {
  available: boolean;
  currency: string;
  ratePerParticipant: number | null;
  participantCount: number;
  totalAmount: number | null;
}

/**
 * Price estimation based on 1:1 CoursePricing relation and participant count.
 */
export function estimatePrice(
  course: Pick<Course, "pricing">,
  participants: number
): PriceEstimate {
  const count = Math.max(1, Math.floor(participants || 1));
  const pricing = course.pricing;

  if (!pricing || pricing.amount == null) {
    return {
      available: false,
      currency: pricing?.currency ?? "KES",
      ratePerParticipant: null,
      participantCount: count,
      totalAmount: null,
    };
  }

  const rate = Number(pricing.amount);
  const totalAmount = round2(rate * count);

  return {
    available: true,
    currency: pricing.currency,
    ratePerParticipant: rate,
    participantCount: count,
    totalAmount,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatMoney(amount: number, currency = "KES"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}