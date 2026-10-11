import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { createCourseSchema, updateCourseSchema } from "@/lib/validation/course";
import { requireAdmin } from "@/lib/server/course";
import z, { ZodError } from "zod";


export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: data.slug,
      },
      select: {
        id: true,
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          message: "A course with this slug already exists.",
        },
        { status: 409 }
      );
    }

    // Check category exists
    const category = await prisma.courseCategory.findUnique({
      where: {
        id: data.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          message: "Selected category does not exist.",
        },
        { status: 404 }
      );
    }

    // Check all audiences exist
    const uniqueAudienceIds = [...new Set(data.audiences)];

    const audiences = await prisma.courseAudience.findMany({
      where: {
        id: {
          in: uniqueAudienceIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (audiences.length !== uniqueAudienceIds.length) {
      return NextResponse.json(
        {
          message: "One or more selected audiences are invalid.",
        },
        { status: 400 }
      );
    }

    // Create course and its relations
    const course = await prisma.course.create({
      data: {
        categoryId: data.categoryId,

        title: data.title,
        slug: data.slug,

        shortDescription: data.shortDescription,
        description: data.description,
        learningOutcomes: data.learningOutcomes,

        durationDays: data.durationDays,

        level: data.level,
        status: data.status,

        thumbnailUrl: data.thumbnailUrl,

        featured: data.featured,
        certificateProvided: data.certificateProvided,
        isPopular: data.isPopular,

        // Audiences
        audiences: {
          connect: uniqueAudienceIds.map((id) => ({
            id,
          })),
        },

        // Modules
        modules: {
          create: data.modules.map((module) => ({
            title: module.title,
            topics: module.topics,
            estimatedDuration:
              module.estimatedDuration ?? null,
          })),
        },

        // Pricing for all delivery modes
        pricing: {
          create: data.pricing.map((price) => ({
            deliveryMode: price.deliveryMode,
            amount: new Prisma.Decimal(price.amount),
            currency: price.currency,
          })),
        },
      },

      include: {
        category: true,
        audiences: true,
        modules: true,
        pricing: true,
      },
    });

    return NextResponse.json(course, {
      status: 201,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    const validated = updateCourseSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: validated.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      id,
      audiences,
      modules,
      pricing,
      ...courseData
    } = validated.data;

    const existing = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          select: { id: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );
    }

    // Identify existing modules that belong to this course.
    const existingModuleIds = new Set(
      existing.modules.map((module) => module.id)
    );

    // Split submitted modules into existing and new.
    const modulesToUpdate = modules.filter(
      (module) => module.id && existingModuleIds.has(module.id)
    );

    const modulesToCreate = modules.filter(
      (module) => !module.id
    );

    // Reject module IDs that don't belong to this course.
    const invalidModule = modules.find(
      (module) => module.id && !existingModuleIds.has(module.id)
    );

    if (invalidModule) {
      return NextResponse.json(
        {
          success: false,
          error: "One or more module IDs are invalid.",
        },
        { status: 400 }
      );
    }

    // Delete modules that were removed from the form.
    const submittedModuleIds = new Set(
      modulesToUpdate.map((module) => module.id)
    );

    const modulesToDelete = existing.modules
      .filter((module) => !submittedModuleIds.has(module.id))
      .map((module) => module.id);

    const course = await prisma.$transaction(async (tx) => {
      // Update course details and audiences.
      await tx.course.update({
        where: { id },
        data: {
          ...courseData,

          audiences: {
            set: audiences.map((audienceId) => ({
              id: audienceId,
            })),
          },
        },
      });

      // Remove deleted modules.
      if (modulesToDelete.length > 0) {
        await tx.courseModule.deleteMany({
          where: {
            courseId: id,
            id: {
              in: modulesToDelete,
            },
          },
        });
      }

      // Update existing modules.
      for (const courseModule of modulesToUpdate) {
        await tx.courseModule.update({
          where: {
            id: courseModule.id!,
          },
          data: {
            title: courseModule.title,
            topics: courseModule.topics,
            estimatedDuration:
              courseModule.estimatedDuration ?? null,
          },
        });
      }

      // Create newly added modules.
      if (modulesToCreate.length > 0) {
        await tx.courseModule.createMany({
          data: modulesToCreate.map((courseModule) => ({
            courseId: id,
            title: courseModule.title,
            topics: courseModule.topics,
            estimatedDuration:
              courseModule.estimatedDuration ?? null,
          })),
        });
      }

      // Create or update all three delivery-mode prices.
      for (const price of pricing) {
        await tx.coursePricing.upsert({
          where: {
            courseId_deliveryMode: {
              courseId: id,
              deliveryMode: price.deliveryMode,
            },
          },
          create: {
            courseId: id,
            deliveryMode: price.deliveryMode,
            amount: new Prisma.Decimal(price.amount),
            currency: price.currency,
          },
          update: {
            amount: new Prisma.Decimal(price.amount),
            currency: price.currency,
          },
        });
      }

      // Fetch updated course with relations.
      return tx.course.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          audiences: true,
          modules: true,
          pricing: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully.",
        data: course,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: z.flattenError(error).fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("Update course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}