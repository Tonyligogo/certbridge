import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  updateTrainerSchema,
} from "@/app/features/trainers/lib/trainer-schema";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const trainer = await prisma.trainer.findUnique({
      where: {
        id,
      },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
              },
            },
          },
        },
        certifications: {
          orderBy: {
            createdAt: "desc",
          },
        },
        bookings: {
          take: 20,
          include: {
            booking: {
              select: {
                id: true,
                reference: true,
                status: true,
                participantCount: true,
                scheduledStartDate: true,
                scheduledEndDate: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
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

    return NextResponse.json({
      success: true,
      data: trainer,
      message: "Trainer fetched successfully",
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("GET /api/trainers/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trainer",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const body = await request.json();

    const parsed = updateTrainerSchema.safeParse(body);

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

    const existingTrainer = await prisma.trainer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingTrainer) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer not found",
        },
        { status: 404 }
      );
    }

    const trainer = await prisma.trainer.update({
      where: {
        id,
      },
      data: parsed.data,
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        certifications: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trainer updated successfully",
      data: trainer,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("PATCH /api/trainers/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update trainer",
      },
      { status: 500 }
    );
  }
}

/**
 * We intentionally do not physically delete trainers.
 *
 * Historical bookings may reference them, so DELETE simply
 * makes the trainer inactive.
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const existingTrainer = await prisma.trainer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingTrainer) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer not found",
        },
        { status: 404 }
      );
    }

    const trainer = await prisma.trainer.update({
      where: {
        id,
      },
      data: {
        status: "INACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Trainer deactivated successfully",
      data: trainer,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    console.error("DELETE /api/trainers/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to deactivate trainer",
      },
      { status: 500 }
    );
  }
}