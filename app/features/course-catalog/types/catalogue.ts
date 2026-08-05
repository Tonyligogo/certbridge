export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type DeliveryMode = "ONLINE" | "CLIENT_SITE" | "OUR_VENUE";

export interface CourseAudience {
  id: string;
  name: string;
  slug: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  estimatedDuration?: number | null; // in minutes
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CoursePricing {
  id: string;
  courseId: string;
  deliveryMode: DeliveryMode;
  amount: number | string;
  currency: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Course {
  id: string;
  categoryId: string;
  category: CourseCategory;
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
  audiences: CourseAudience[];
  modules: CourseModule[];
  pricing?: CoursePricing | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Filter params schema for Next.js URL query strings
export interface CatalogueFilterParams {
  q?: string;
  categories?: string[]; // category IDs or slugs
  audiences?: string[];  // audience IDs or slugs
  level?: CourseLevel[];
  deliveryMode?: DeliveryMode[];
  featured?: boolean;
  isPopular?: boolean;
  certificateProvided?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "title-asc";
  page?: number;
  limit?: number;
}