// Mirrors the Prisma schema for the CertBridge Global course model.

import { CourseLevel } from "@/generated/prisma/enums";

export const DIFFICULTY_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "ALL_LEVELS",
] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const COURSE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export const DELIVERY_MODES = ["ONLINE", "CLIENT_SITE", "ARRANGED_VENUE"] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];

export type PricingTier = {
  id: string;
  deliveryMode: DeliveryMode;
  currency: string;
  amount: string;
};

export type SyllabusModule = {
  id: string;
  title: string;
  durationMinutes: string;
  description: string;
};

export type CourseForm = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  durationDays: string;
  difficulty: DifficultyLevel;
  status: CourseStatus;
  isFeatured: boolean;
  isPopular: boolean;
  hasCertificate: boolean;
  thumbnailUrl: string;
  categoryId: string;
  audienceIds: string[];
  pricing: PricingTier[];
  modules: SyllabusModule[];
};

export interface CoursePricingFormType {
  id?: string;
  deliveryMode: DeliveryMode;
  amount: string;
  currency: string;
}
export interface CourseModuleFormType {
  id?: string;
  title: string;
  topics: string[];
  estimatedDuration: number | null;
}
export interface CourseFormType {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  learningOutcomes: string[];
  durationDays: number;
  level: CourseLevel;
  status: CourseStatus;
  featured: boolean;
  isPopular: boolean;
  certificateProvided: boolean;
  thumbnailUrl: string;
  categoryId: string;
  audiences: string[];
  pricing: CoursePricingFormType[];
  modules: CourseModuleFormType[];
}

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  ONLINE: "Online",
  CLIENT_SITE: "Client Site",
  ARRANGED_VENUE: "Our Venue",
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All levels",
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const countWords = (value: string) => value.trim() ? value.trim().split(/\s+/).length : 0;

export const uid = () => `temp-${crypto.randomUUID()}`;