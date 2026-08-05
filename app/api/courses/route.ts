import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";
import { createCourseSchema } from "@/lib/validation/course";
import { requireAdmin } from "@/lib/server/course";

export async function POST(req: NextRequest) {
  try {
    requireAdmin()
    const body = await req.json();

    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          message: "A course with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Check category exists
    const category = await prisma.courseCategory.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          message: "Selected category does not exist.",
        },
        {
          status: 404,
        }
      );
    }

    // Check all audiences exist
    const audiences = await prisma.courseAudience.findMany({
      where: {
        id: {
          in: data.audiences,
        },
      },
    });

    if (audiences.length !== data.audiences.length) {
      return NextResponse.json(
        {
          message: "One or more selected audiences are invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const course = await prisma.$transaction(async (tx) => {
      return tx.course.create({
        data: {
          categoryId: data.categoryId,

          title: data.title,
          slug: data.slug,

          shortDescription: data.shortDescription,
          description: data.description,

          durationDays: data.durationDays,

          level: data.level,
          status: data.status,

          thumbnailUrl: data.thumbnailUrl,

          featured: data.featured,
          certificateProvided: data.certificateProvided,
          isPopular: data.isPopular,

          audiences: {
            connect: data.audiences.map((id) => ({
              id,
            })),
          },

          modules: {
            create: data.modules.map((module) => ({
              title: module.title,
              description: module.description,
              estimatedDuration: module.estimatedDuration,
            })),
          },

          pricing: {
            create: {
              deliveryMode: data.pricing.deliveryMode,
              amount: new Prisma.Decimal(data.pricing.amount),
              currency: data.pricing.currency,
            },
          },
        },

        include: {
          category: true,

          audiences: true,

          modules: true,

          pricing: true,
        },
      });
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
      {
        status: 500,
      }
    );
  }
}