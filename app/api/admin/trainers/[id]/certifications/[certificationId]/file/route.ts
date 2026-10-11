import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "trainer-certifications";

interface RouteContext {
  params: Promise<{
    id: string;
    certificationId: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id:trainerId, certificationId } = await params;

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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Certification file is required",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Certification file cannot be empty",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed.",
        },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Certification file must not exceed 10 MB.",
        },
        { status: 400 }
      );
    }

    /*Generate new storage path*/

    const extension = file.name.split(".").pop()?.toLowerCase();

    const fileName = `${crypto.randomUUID()}${
      extension ? `.${extension}` : ""
    }`;

    const newStoragePath = `${trainerId}/${fileName}`;

    /*Upload new file*/

    const supabase = await createClient();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newStoragePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(
        "Failed to upload replacement certification:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload certification file",
        },
        { status: 500 }
      );
    }

    /* Update certification record*/

    let updatedCertification;

    try {
      updatedCertification =
        await prisma.trainerCertification.update({
          where: {
            id: certification.id,
          },
          data: {
            storagePath: newStoragePath,
            status: "PENDING",
          },
        });
    } catch (error) {
      /*
       * The database update failed after the new file was uploaded.
       * Remove the new file so we don't leave an orphaned object.
       */
      await supabase.storage
        .from(BUCKET)
        .remove([newStoragePath]);

      throw error;
    }

    /*Remove old file*/

    if (certification.storagePath) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove([certification.storagePath]);

      if (removeError) {
        /*
         * At this point the database already points to the new file.
         *
         * We don't fail the request because the replacement itself
         * succeeded. The old file is now just an orphaned object that
         * should be cleaned up.
         */
        console.error(
          "Failed to remove old certification file:",
          removeError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Certification file replaced successfully",
      data: updatedCertification,
    });
  } catch (error) {
    console.error(
      "PUT certification file error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to replace certification file",
      },
      { status: 500 }
    );
  }
}