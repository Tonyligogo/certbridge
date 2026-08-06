import { Course as UpdateCourse } from "@/app/features/course-catalog/types/catalogue";
import { Course } from "@/generated/prisma/client";
import { api } from "@/lib/api";
import { CreateCourseInput } from "@/lib/validation/course";

export type CreateCoursePayload = CreateCourseInput;

export type UpdateCoursePayload = Partial<CreateCoursePayload>;

export const courseService = {
  async getCourses() {
    const response = await api.get<Course[]>("/api/courses");
    return response.data;
  },

  async getCourse(id: string) {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  },


  async getCourseBySlug(slug: string) {
    const response = await api.get<UpdateCourse>(`/api/courses/${slug}`);
    return response.data;
  },

  async createCourse(data: CreateCoursePayload) {
    const response = await api.post<Course>("/api/courses", data);
    return response.data;
  },

  async updateCourse(id: string, data: UpdateCoursePayload) {
    const response = await api.patch<Course>(`/api/courses`, data);
    return response.data;
  },

  async deleteCourse(id: string) {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
  },
};