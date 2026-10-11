import { getCatalogueCourses } from "../server/course";

import type {
  CourseAudience,
  CourseCategory,
  CourseLevel,
} from "../types/catalogue";

import { CourseCatalogue } from "./CoursesCatalog";

interface Props {
  searchParams: Record<
    string,
    string | string[] | undefined
  >;
  sheetCategories?: CourseCategory[];
  sheetAudiences?: CourseAudience[];
}

export async function CoursesGrid({
  searchParams,
  sheetCategories = [],
  sheetAudiences = [],
}: Props) {
  const getString = (key: string) => {
    const value = searchParams[key];
    return typeof value === "string" ? value : undefined;
  };

  const getArray = (key: string) => {
    return (
      getString(key)
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean) ?? []
    );
  };

  const q = getString("q");

  const categories = getArray("categories");
  const audiences = getArray("audiences");

  const levels = getArray("levels") as CourseLevel[];

  const featured = getString("featured") === "true";
  const popular = getString("isPopular") === "true";

  const rawPage = Number(getString("page") ?? 1);

  const page = Number.isFinite(rawPage)
    ? Math.max(1, Math.floor(rawPage))
    : 1;

  const { courses, pagination } = await getCatalogueCourses({
    q,
    categories,
    audiences,
    levels,
    featured,
    popular,
    page,
    limit: 12,
  });

  return (
    <CourseCatalogue
      courses={courses}
      pagination={pagination}
      sheetCategories={sheetCategories}
      sheetAudiences={sheetAudiences}
    />
  );
}