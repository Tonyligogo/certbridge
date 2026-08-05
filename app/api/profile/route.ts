import { ProfileType } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createProfileSchema,
  updateProfileSchema,
} from "@/lib/validation/profile";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile already exists.",
        },
        { status: 409 },
      );
    }

    const body = createProfileSchema.parse(await request.json());

    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        type: body.type as ProfileType,
        displayName: body.displayName,
        phone: body.phone,
        country: body.country,
        city: body.city,
        website: body.website,
        logoUrl: body.logoUrl,
        kraPin: body.kraPin,
        address: body.address,
        onboardingComplete: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile created successfully.",
        data: profile,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: z.flattenError(error).fieldErrors,
        },
        {
          status: 400,
        },
      );
    }
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const body = updateProfileSchema.parse(await request.json());

    const profile = await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        displayName: body.displayName,
        phone: body.phone,
        country: body.country,
        city: body.city,
        website: body.website,
        logoUrl: body.logoUrl,
        kraPin: body.kraPin,
        address: body.address,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: z.flattenError(error).fieldErrors,
        },
        {
          status: 400,
        },
      );
    }
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
