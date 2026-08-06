"use client";

import { use } from "react";
import { useGetCourseBySlug, useUpdateCourse } from "@/hooks/course/use-course";
import { CreateCourseInput, UpdateCourseInput } from "@/lib/validation/course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CourseForm, CourseForm as CourseFormType } from "@/app/features/courses/CourseForm";
import { CourseAudience, CourseModule } from "@/app/features/course-catalog/types/catalogue";
import { UpdateCoursePayload } from "@/services/course";

interface EditCoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { slug } = use(params);
  const { data: course, isLoading } = useGetCourseBySlug(slug);
  const { mutate: updateCourse, isPending } = useUpdateCourse();
  const router = useRouter();
  console.log(course)

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
    durationDays: course.durationDays,
    level: course.level,
    status: course.status,
    featured: course.featured,
    isPopular: course.isPopular,
    certificateProvided: course.certificateProvided,
    thumbnailUrl: course.thumbnailUrl || "",
    categoryId: course.categoryId,
    audiences: course.audiences ? course.audiences.map((a: CourseAudience) => a.id) : [],
    pricing: {
      id: course.pricing?.id || "",
      deliveryMode: course.pricing?.deliveryMode || "ONLINE",
      amount: String(course.pricing?.amount || ""),
      currency: course.pricing?.currency || "KES",
    },
    modules: course.modules
      ? course.modules.map((m: CourseModule) => ({
          id: m.id,
          title: m.title,
          description: m.description || "",
          estimatedDuration: m.estimatedDuration || 0,
        }))
      : [],
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