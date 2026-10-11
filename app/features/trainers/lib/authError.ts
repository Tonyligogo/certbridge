import { NextResponse } from "next/server";

export function handleAuthError(error: unknown) {
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

  return null;
}