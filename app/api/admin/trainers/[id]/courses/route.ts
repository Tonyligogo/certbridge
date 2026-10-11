import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  updateTrainerCoursesSchema,
} from "@/app/features/trainers/lib/trainer-schema";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id: trainerId } = await context.params;

    const body = await request.json();

    const parsed = updateTrainerCoursesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course selection",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const courseIds = [...new Set(parsed.data.courseIds)];

    const trainer = await prisma.trainer.findUnique({
      where: {
        id: trainerId,
      },
      select: {
        id: true,
      },
    });

    if (!trainer) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer not found",
        },
        { status: 404 }
      );
    }

    if (courseIds.length > 0) {
      const courses = await prisma.course.findMany({
        where: {
          id: {
            in: courseIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (courses.length !== courseIds.length) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more courses do not exist",
          },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.trainerCourse.deleteMany({
        where: {
          trainerId,
        },
      });

      if (courseIds.length > 0) {
        await tx.trainerCourse.createMany({
          data: courseIds.map((courseId) => ({
            trainerId,
            courseId,
          })),
        });
      }
    });

    const updatedTrainer = await prisma.trainer.findUniqueOrThrow({
      where: {
        id: trainerId,
      },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trainer courses updated successfully",
      data: updatedTrainer,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }

    console.error(
      "PUT /api/trainers/[id]/courses error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update trainer courses",
      },
      { status: 500 }
    );
  }
}