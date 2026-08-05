import { getCatalogueCourses } from "../server/course";
import type { CourseAudience, CourseCategory, CourseLevel } from "../types/catalogue";
import { CourseCatalogue } from "./CoursesCatalog";


interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  sheetCategories?: CourseCategory[];
  sheetAudiences?: CourseAudience[];
}

export async function CoursesGrid({
  searchParams,
  sheetCategories = [],
  sheetAudiences = [],
}: Props) {
  const q =
    typeof searchParams.q === "string"
      ? searchParams.q
      : undefined;

  const categories =
    typeof searchParams.categories === "string"
      ? searchParams.categories.split(",")
      : [];

  const audiences =
    typeof searchParams.audiences === "string"
      ? searchParams.audiences.split(",")
      : [];

  const levels =
  typeof searchParams.levels === "string"
    ? (searchParams.levels.split(",") as CourseLevel[])
    : [];

    const featured = searchParams.featured === "true";
const popular = searchParams.isPopular === "true";
  const courses = await getCatalogueCourses({
    q,
    categories,
    audiences,
    levels,
    featured,
    popular,
  });

  return <CourseCatalogue courses={courses} sheetCategories={sheetCategories} sheetAudiences={sheetAudiences} />;
}