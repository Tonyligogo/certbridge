import { generateEnquiryReference } from "@/app/features/enquiry/lib/reference-generator";
import { createEnquirySchema } from "@/app/features/enquiry/lib/validation/enquiry";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Check request content type
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type must be application/json",
        },
        { status: 415 }
      );
    }

    // 2. Limit request size
    const MAX_BODY_SIZE = 16 * 1024;

    const rawBody = await request.text();

    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body is too large",
        },
        { status: 413 }
      );
    }

    // 3. Parse JSON
    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    // 4. Validate request
    const result = createEnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      type,
      fullName,
      email,
      phone,
      organization,
      courseId,
      courseName,
      participantCount,
      deliveryMode,
      preferredDate,
      message,
      website,
    } = result.data;

    // 5. Basic spam protection
    // The honeypot should always be empty for legitimate users.
    if (website?.trim()) {
      return NextResponse.json(
        {
          success: true,
          message: "Request received",
        },
        { status: 202 }
      );
    }

    const isQuote = type === "QUOTE";

    // 6. Resolve catalogue course if provided
    let selectedCourseId: string | null = null;
    let selectedCourseName: string | null = null;

    if (isQuote) {
      if (courseId) {
        const course = await prisma.course.findUnique({
          where: {
            id: courseId,
          },
          select: {
            id: true,
            title: true,
            status: true,
          },
        });

        if (!course) {
          return NextResponse.json(
            {
              success: false,
              message: "The selected course was not found",
            },
            { status: 404 }
          );
        }

        if (course.status !== "PUBLISHED") {
          return NextResponse.json(
            {
              success: false,
              message: "The selected course is not available",
            },
            { status: 400 }
          );
        }

        selectedCourseId = course.id;
        selectedCourseName = course.title;
      } else {
        selectedCourseName = courseName?.trim() || null;
      }

      if (!selectedCourseId && !selectedCourseName) {
        return NextResponse.json(
          {
            success: false,
            message: "Please specify a training course or topic",
          },
          { status: 400 }
        );
      }
    }

    // 7. Parse preferred date
    // Store at noon UTC to avoid accidental day shifts
    // when displaying a date-only value.
    let parsedPreferredDate: Date | null = null;

    if (isQuote && preferredDate) {
      parsedPreferredDate = new Date(
        `${preferredDate}T12:00:00.000Z`
      );

      if (Number.isNaN(parsedPreferredDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid preferred training date",
          },
          { status: 400 }
        );
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const requestedDay = new Date(
        `${preferredDate}T00:00:00.000Z`
      );

      if (requestedDay < today) {
        return NextResponse.json(
          {
            success: false,
            message: "Preferred training date cannot be in the past",
          },
          { status: 400 }
        );
      }
    }

    // 8. Create enquiry and initial activity
    // The nested activity creation is atomic with the enquiry.
    const enquiry = await prisma.enquiry.create({
      data: {
        reference: generateEnquiryReference(),

        type,
        status: "NEW",

        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        organization: organization?.trim() || null,

        courseId: isQuote ? selectedCourseId : null,
        courseName: isQuote ? selectedCourseName : null,

        participantCount: isQuote
          ? (participantCount ?? null)
          : null,

        deliveryMode: isQuote
          ? (deliveryMode ?? null)
          : null,

        preferredDate: isQuote
          ? parsedPreferredDate
          : null,

        message: message?.trim() || null,

        activities: {
          create: {
            type: "CREATED",
            description: isQuote
              ? "Training quotation request submitted."
              : "General enquiry submitted.",
          },
        },
      },

      select: {
        id: true,
        reference: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    // 9. Return response
    return NextResponse.json(
      {
        success: true,
        message: isQuote
          ? "Quotation request submitted successfully"
          : "Enquiry submitted successfully",
        data: enquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit enquiry",
      },
      { status: 500 }
    );
  }
}