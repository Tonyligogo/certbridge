import { randomBytes } from "node:crypto";

export function generateEnquiryReference() {
  const year = new Date().getUTCFullYear();

  const random = randomBytes(5)
    .toString("hex")
    .toUpperCase();

  return `ENQ-${year}-${random}`;
}