// Mirrors the Prisma schema for the CertBridge Global course model.

export const DIFFICULTY_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "ALL_LEVELS",
] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const COURSE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export const DELIVERY_MODES = ["ONLINE", "CLIENT_SITE", "OUR_VENUE"] as const;
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

export const CATEGORIES = [
  { id: "cat_business", name: "Business & Leadership" },
  { id: "cat_compliance", name: "Compliance & Safety" },
  { id: "cat_tech", name: "Tech & Digital Skills" },
  { id: "cat_finance", name: "Finance & Procurement" },
  { id: "cat_health", name: "Healthcare & Wellbeing" },
  { id: "cat_projects", name: "Project & Risk Management" },
];

export const AUDIENCES = [
  { id: "aud_corporate", name: "Corporate Teams" },
  { id: "aud_individual", name: "Individual Learners" },
  { id: "aud_exec", name: "Executive Managers" },
  { id: "aud_public", name: "Public Sector Officers" },
  { id: "aud_ngo", name: "NGO & Development Staff" },
  { id: "aud_grads", name: "Graduate Trainees" },
];

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  ONLINE: "Online",
  CLIENT_SITE: "Client Site",
  OUR_VENUE: "Our Venue",
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

export const countWords = (value: string) =>
  value.trim() ? value.trim().split(/\s+/).length : 0;

export const uid = () => Math.random().toString(36).slice(2, 10);
