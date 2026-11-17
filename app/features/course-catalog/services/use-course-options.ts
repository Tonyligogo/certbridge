import { CourseLevel } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

export interface CourseOption {
  id: string;
  title: string;
  level: CourseLevel;
  durationDays: number;
}

export const courseOptionsService = {
  async search(search: string) {
    const params = new URLSearchParams({
      search,
      limit: "20",
    });

    return api.get<CourseOption[]>(
      `/api/admin/courses/options?${params.toString()}`,
    );
  },
};