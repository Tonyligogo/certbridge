import { updateEnquirySchema } from "@/app/features/enquiry/lib/validation/enquiry";
import { handleEnquiryError } from "@/app/features/enquiry/utils/handle-enquiry-error";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Enquiry ID is required",
        },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },

      select: {
        id: true,
        reference: true,
        type: true,
        status: true,

        fullName: true,
        email: true,
        phone: true,
        organization: true,

        courseId: true,
        courseName: true,
        participantCount: true,
        deliveryMode: true,
        preferredDate: true,
        message: true,

        adminNotes: true,
        contactedAt: true,
        closedAt: true,
        bookingId: true,

        createdAt: true,
        updatedAt: true,

        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },

        activities: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            type: true,
            description: true,
            createdAt: true,
            createdBy: true,
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Enquiry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/enquiries/[id] error:",
      error
    );

    const authResponse = handleAuthError(error);

    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enquiry details",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await request.json().catch(() => null);
    const parsed = updateEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid enquiry action",
          errors: parsed.error,
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const enquiry = await tx.enquiry.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          closedAt: true,
          bookingId: true,
        },
      });

      if (!enquiry) {
        throw new Error("ENQUIRY_NOT_FOUND");
      }

      if (
        enquiry.status === "CONVERTED" ||
        enquiry.bookingId
      ) {
        throw new Error("ENQUIRY_ALREADY_CONVERTED");
      }

      let newStatus:
        | "NEW"
        | "CONTACTED"
        | "IN_PROGRESS"
        | "CLOSED";

      let description: string;
      let activityType: | "STATUS_CHANGED";

      let metadata: Prisma.InputJsonValue;

      let closedAt: Date | null = enquiry.closedAt;

      switch (input.action) {
        case "CHANGE_STATUS": {
          if (enquiry.status === "CLOSED") {
            throw new Error("ENQUIRY_ALREADY_CLOSED");
          }

          if (enquiry.status === input.status) {
            throw new Error("ENQUIRY_STATUS_UNCHANGED");
          }

          newStatus = input.status;
          closedAt = null;

          description = `Status changed from ${enquiry.status} to ${input.status}`;
          activityType = "STATUS_CHANGED";

          metadata = {
            from: enquiry.status,
            to: input.status,
          };

          break;
        }

        case "CLOSE": {
          if (enquiry.status === "CLOSED") {
            throw new Error("ENQUIRY_ALREADY_CLOSED");
          }

          newStatus = "CLOSED";
          closedAt = new Date();

          description = `Enquiry closed: ${input.reason}`;
          activityType = "STATUS_CHANGED";

          metadata = {
            from: enquiry.status,
            to: "CLOSED",
            reason: input.reason,
          };

          break;
        }

        case "REOPEN": {
          if (enquiry.status !== "CLOSED") {
            throw new Error("ENQUIRY_NOT_CLOSED");
          }

          newStatus = "NEW";
          closedAt = null;

          description = "Enquiry reopened";
          activityType = "STATUS_CHANGED";

          metadata = {
            from: "CLOSED",
            to: "NEW",
          };

          break;
        }
      }

      const updated = await tx.enquiry.update({
        where: { id },
        data: {
          status: newStatus,
          closedAt,
        },
        select: {
          id: true,
          status: true,
          closedAt: true,
          updatedAt: true,
        },
      });

      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          type: activityType,
          description,
          metadata,
          createdBy: session.user.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/enquiries/[id] error:",
      error
    );

    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;

    const enquiryResponse = handleEnquiryError(error);
  if (enquiryResponse) return enquiryResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update enquiry",
      },
      { status: 500 }
    );
  }
}