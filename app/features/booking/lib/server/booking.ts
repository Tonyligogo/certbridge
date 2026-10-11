import { getBookingByReference } from "../db/booking";

export async function getBooking(reference: string) {
  return getBookingByReference(reference);
}