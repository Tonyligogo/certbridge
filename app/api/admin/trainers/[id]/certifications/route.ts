import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  createTrainerCertificationSchema,
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

    const { id: trainerId } = await context.params;

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

    const certifications =
      await prisma.trainerCertification.findMany({
        where: {
          trainerId,
        }
      });

    return NextResponse.json({
      success: true,
      data: certifications,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    console.error(
      "GET /api/trainers/[id]/certifications error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch certifications",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const { id: trainerId } = await context.params;

    const body = await request.json();

    const parsed =
      createTrainerCertificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid certification data",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

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

    const certification =
      await prisma.trainerCertification.create({
        data: {
          trainerId,
          name: parsed.data.name,
          issuedBy:
            parsed.data.issuedBy,
          issuedAt: parsed.data.issuedAt,
          expiresAt: parsed.data.expiresAt,
          storagePath: parsed.data.storagePath,
          status: "PENDING",
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Certification added successfully",
        data: certification,
      },
      { status: 201 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);
    
        if (authResponse) {
          return authResponse;
        }

    console.error(
      "POST /api/trainers/[id]/certifications error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create certification",
      },
      { status: 500 }
    );
  }
}