"use client";

import { use } from "react";
import { useGetCourseBySlug, useUpdateCourse } from "@/hooks/course/use-course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CourseForm, CourseFormType } from "@/app/features/courses/CourseForm";
import { UpdateCoursePayload } from "@/services/course";
import { DeliveryMode } from "@/generated/prisma/enums";

interface EditCoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { slug } = use(params);
  const { data: course, isLoading } = useGetCourseBySlug(slug);
  const { mutate: updateCourse, isPending } = useUpdateCourse();
  const router = useRouter();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Loading course data...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Course not found.</div>;
  }

  // Format record into CourseForm structure
  

const initialFormData: CourseFormType = {
  title: course.title,
  slug: course.slug,
  shortDescription: course.shortDescription,
  description: course.description,
  learningOutcomes: course.learningOutcomes ?? [],
  durationDays: course.durationDays,
  level: course.level,
  status: course.status,
  featured: course.featured,
  isPopular: course.isPopular,
  certificateProvided: course.certificateProvided,
  thumbnailUrl: course.thumbnailUrl ?? "",
  categoryId: course.categoryId,

  audiences: course.audiences.map((audience) => audience.id),

  pricing: Object.values(DeliveryMode).map((mode) => {
    const existingPrice = course.pricing.find(
      (price) => price.deliveryMode === mode
    );

    return {
      id: existingPrice?.id ?? "",
      deliveryMode: mode,
      amount: existingPrice
        ? String(existingPrice.amount)
        : "",
      currency: existingPrice?.currency ?? "KES",
    };
  }),

  modules: course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    topics: module.topics,
    estimatedDuration: module.estimatedDuration ?? null,
  })),
};


  const handleUpdate = (payload: UpdateCoursePayload) => {
    const id = course.id;
    const data = {...payload, id}
    updateCourse(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Course updated", {
            description: `“${payload.title}” updated successfully.`,
          });
          router.push("/admin/courses");
        },
        onError: () => {
          toast.error("Update failed", {
            description: "Failed to update course details.",
          });
        },
      }
    );
  };

  return (
    <CourseForm
      initialData={initialFormData}
      onSubmit={handleUpdate}
      isSubmitting={isPending}
      submitButtonText="Save Changes"
    />
  );
}