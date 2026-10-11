export interface LandingCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  durationDays: number;
  certificateProvided: boolean;

  category: {
    name: string;
    slug: string;
  };

  startingPrice: {
    amount: string;
    currency: string;
  } | null;
}

export interface LandingCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  courseCount: number;
}

export interface LandingAudience {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

export interface LandingStats {
  courses: number;
  categories: number;
}

export interface LandingPageResponse {
  featuredCourses: LandingCourse[];
  popularCourses: LandingCourse[];
  categories: LandingCategory[];
  audiences: LandingAudience[];
  stats: LandingStats;
}