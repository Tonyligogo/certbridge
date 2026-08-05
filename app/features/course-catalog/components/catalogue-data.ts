import { Course, CourseLevel, DeliveryMode } from "../types/catalogue";

export const LEVEL_OPTIONS: { id: CourseLevel; label: string }[] = [
  { id: "BEGINNER", label: "Beginner" },
  { id: "INTERMEDIATE", label: "Intermediate" },
  { id: "ADVANCED", label: "Advanced" },
  { id: "ALL_LEVELS", label: "All Levels" },
];

export const DELIVERY_MODE_OPTIONS: { id: DeliveryMode; label: string }[] = [
  { id: "ONLINE", label: "Online" },
  { id: "CLIENT_SITE", label: "Client Site" },
  { id: "OUR_VENUE", label: "Our Venue" },
];

export const DURATION_BUCKETS = [
  { id: "1-day", label: "1 Day or less", minDays: 0, maxDays: 1 },
  { id: "2-3-days", label: "2 – 3 Days", minDays: 2, maxDays: 3 },
  { id: "4-plus-days", label: "4+ Days", minDays: 4, maxDays: Infinity },
];

export const SORT_OPTIONS = [
  { id: "recent", label: "Most Recent" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
  { id: "title", label: "Title A-Z" },
];

export const slugify = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

/**
 * Utility to extract and format the price from a course's pricing record
 */
export const formatStartingPrice = (course: Pick<Course, "pricing">): string => {
  if (!course.pricing) {
    return "Contact for Pricing";
  }

  const numericAmount = Number(course.pricing.amount);

  if (numericAmount === 0) return "Free";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: course.pricing.currency || "KES",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const DEFAULT_PRICE_MAX = 1000000;