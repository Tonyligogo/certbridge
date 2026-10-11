import { api, ApiResponse } from "@/lib/api";
import { Payment, RecordPaymentResponse } from "../types/payments";
import { RecordPaymentInput } from "../schema/schemas";

export const paymentService = {
    async getInvoicePayments(
  bookingId: string,
  invoiceId: string
): Promise<ApiResponse<Payment[]>> {
  return api.get<Payment[]>(
    `/api/admin/bookings/${bookingId}/invoices/${invoiceId}/payments`
  );
},

async recordPayment(
  bookingId: string,
  invoiceId: string,
  data: RecordPaymentInput
): Promise<ApiResponse<RecordPaymentResponse>> {
  return api.post<RecordPaymentResponse>(
    `/api/admin/bookings/${bookingId}/invoices/${invoiceId}/payments`,
    data
  );
},
}