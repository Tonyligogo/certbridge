import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  updateTrainerCertificationSchema,
} from "@/app/features/trainers/lib/trainer-schema";
import { requireAdmin } from "@/lib/server/course";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "trainer-certifications";

interface RouteContext {
  params: Promise<{
    id: string;
    certificationId: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const {
      id: trainerId,
      certificationId,
    } = await context.params;

    const body = await request.json();

    const parsed =
      updateTrainerCertificationSchema.safeParse(body);

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

    const existing =
      await prisma.trainerCertification.findFirst({
        where: {
          id: certificationId,
          trainerId,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Certification not found",
        },
        { status: 404 }
      );
    }

    const certification =
      await prisma.trainerCertification.update({
        where: {
          id: certificationId,
        },
        data: parsed.data,
      });

    /*
     * If the certification itself becomes invalid,
     * we should also make sure the trainer isn't still
     * marked as certified.
     *
     * For now we only automatically turn certified OFF.
     * Turning it ON remains an explicit admin decision.
     */
    if (
      parsed.data.status === "EXPIRED" ||
      parsed.data.status === "REJECTED"
    ) {
      await prisma.trainer.update({
        where: {
          id: trainerId,
        },
        data: {
          certified: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Certification updated successfully",
      data: certification,
    });
  } catch (error) {
    const authResponse = handleAuthError(error);
        
            if (authResponse) {
              return authResponse;
            }

    console.error(
      "PATCH certification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update certification",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();

    const {
      id: trainerId,
      certificationId,
    } = await context.params;

    const certification =
      await prisma.trainerCertification.findFirst({
        where: {
          id: certificationId,
          trainerId,
        },
      });

    if (!certification) {
      return NextResponse.json(
        {
          success: false,
          message: "Certification not found",
        },
        { status: 404 }
      );
    }

     // Remove the file from Supabase Storage if one exists.
    if (certification.storagePath) {
      const supabase = await createClient();

      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([certification.storagePath]);

      if (error) {
        console.error(
          "Failed to remove certification file:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            message: "Failed to remove certification file",
          },
          { status: 500 }
        );
      }
    }

    await prisma.trainerCertification.delete({
      where: {
        id: certificationId,
      },
    });

    /*
     * We don't automatically change Trainer.certified here.
     * The admin can decide whether the trainer still has
     * sufficient valid certification.
     */
    return NextResponse.json({
      success: true,
      message: "Certification deleted successfully",
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
      "DELETE certification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete certification",
      },
      { status: 500 }
    );
  }
}