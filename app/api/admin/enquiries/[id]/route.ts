import { updateEnquiryDetailsSchema } from "@/app/features/enquiry/lib/validation/enquiry";
import { EnquiryDetailsError, updateEnquiryDetails } from "@/app/features/enquiry/services/update-enquiry-details";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Enquiry ID is required",
        },
        { status: 400 },
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
            durationDays: true,
            level: true,
            slug: true,
            pricing: {
              select: {
                amount: true,
                currency: true,
                deliveryMode: true,
              },
            },
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
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("GET /api/admin/enquiries/[id] error:", error);

    const authResponse = handleAuthError(error);

    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enquiry details",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const authResult = await requireAdmin();
    const { id: enquiryId } = await params;

    const body = await request.json();

    const parsed =
      updateEnquiryDetailsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if(parsed.data.courseId){
      const course = await prisma.course.findUnique({
        where:{id:parsed.data.courseId},
        select:{
          id: true,
          title: true
        }
      })

      if(!course){
        return NextResponse.json(
        {
          success: false,
          message: "Linked course not found",
        },
        { status: 404 },
      );
      }
      parsed.data.courseId = course.id;
      parsed.data.courseName = course.title;
    }

    const updated = await updateEnquiryDetails({
      enquiryId,
      adminUserId: authResult.user.id,
      input: parsed.data,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry details updated successfully.",
      data: updated,
    });
  } catch (error) {
    if (error instanceof EnquiryDetailsError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enquiry was modified by another request. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    console.error(
      "PATCH /api/admin/enquiries/[id] error:",
      error,
    );

    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update enquiry details.",
      },
      { status: 500 },
    );
  }
}

