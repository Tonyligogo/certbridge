import { addEnquiryNoteSchema } from "@/app/features/enquiry/lib/validation/enquiry";
import { handleAuthError } from "@/app/features/trainers/lib/authError";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/server/course";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAdmin();
    const { id: enquiryId } = await params;

    const body = await request.json().catch(() => null);
    const parsed = addEnquiryNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid note",
          errors: parsed.error,
        },
        { status: 400 },
      );
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      select: { id: true },
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

    const activity = await prisma.enquiryActivity.create({
      data: {
        enquiryId,
        type: "NOTE_ADDED",
        description: parsed.data.note,
        createdBy: session.user.id,
      },
      select: {
        id: true,
        type: true,
        description: true,
        createdAt: true,
        createdBy: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Note added successfully",
        data: activity,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/enquiries/[id]/activities error:",
      error,
    );

    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add note",
      },
      { status: 500 },
    );
  }
}