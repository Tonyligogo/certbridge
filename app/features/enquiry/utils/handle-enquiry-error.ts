import { NextResponse } from "next/server";

const enquiryErrors: Record<string, { message: string; status: number }> = {
  ENQUIRY_NOT_FOUND: {
    message: "Enquiry not found",
    status: 404,
  },
  ENQUIRY_ALREADY_CONVERTED: {
    message: "Converted enquiries cannot be modified",
    status: 409,
  },
  ENQUIRY_ALREADY_CLOSED: {
    message: "Enquiry is already closed",
    status: 409,
  },
  ENQUIRY_NOT_CLOSED: {
    message: "Only closed enquiries can be reopened",
    status: 409,
  },
  ENQUIRY_REOPEN_REQUIRED: {
    message: "Reopen the enquiry before changing its status",
    status: 409,
  },
  ENQUIRY_STATUS_UNCHANGED: {
    message: "Enquiry already has this status",
    status: 409,
  },
};

export function handleEnquiryError(error: unknown) {
  if (!(error instanceof Error)) return null;

  const matched = enquiryErrors[error.message];

  if (!matched) return null;

  return NextResponse.json(
    {
      success: false,
      message: matched.message,
    },
    { status: matched.status }
  );
}