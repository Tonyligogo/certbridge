import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import {
  createTrainerSchema,
} from "@/app/features/trainers/lib/trainer-schema";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(
      1,
      Number(searchParams.get("page") ?? "1")
    );

    const pageSize = Math.min(
      100,
      Math.max(
        1,
        Number(searchParams.get("pageSize") ?? "20")
      )
    );

    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status");
    const certifiedParam = searchParams.get("certified");
    const courseId = searchParams.get("courseId");

    const where: Prisma.TrainerWhereInput = {};

    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          primaryCity: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          primaryCountry: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          expertise: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      status === "ACTIVE" ||
      status === "INACTIVE" ||
      status === "SUSPENDED"
    ) {
      where.status = status;
    }

    if (certifiedParam === "true") {
      where.certified = true;
    }

    if (certifiedParam === "false") {
      where.certified = false;
    }

    if (courseId) {
      where.courses = {
        some: {
          courseId,
        },
      };
    }

    const skip = (page - 1) * pageSize;
const start = performance.now();
    const [trainers, total] = await prisma.$transaction([
      prisma.trainer.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
          certifications: {
            select: {
              id: true,
              name: true,
              issuedBy: true,
              issuedAt: true,
              expiresAt: true,
              status: true,
              storagePath: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),

      prisma.trainer.count({
        where,
      }),
    ]);

    console.log(
  `DB query: ${(performance.now() - start).toFixed(2)}ms`
);

    return NextResponse.json({
      success: true,
      data: {
        trainers,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    }
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("GET /api/trainers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trainers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    const parsed = createTrainerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid trainer data",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      courseIds,
      ...trainerData
    } = parsed.data;

    // Make sure the selected courses actually exist.
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

      if (courses.length !== new Set(courseIds).size) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more selected courses do not exist",
          },
          { status: 400 }
        );
      }
    }

    const trainer = await prisma.$transaction(async (tx) => {
      const createdTrainer = await tx.trainer.create({
        data: trainerData,
      });

      if (courseIds.length > 0) {
        await tx.trainerCourse.createMany({
          data: courseIds.map((courseId) => ({
            trainerId: createdTrainer.id,
            courseId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.trainer.findUniqueOrThrow({
        where: {
          id: createdTrainer.id,
        },
        include: {
          courses: {
            include: {
              course: true,
            },
          },
          certifications: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Trainer created successfully",
        data: trainer,
      },
      { status: 201 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("POST /api/trainers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create trainer",
      },
      { status: 500 }
    );
  }
}