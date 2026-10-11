import { api, ApiResponse } from "@/lib/api";
import { Invoice } from "../types/invoice";
import { CreateInvoiceInput, UpdateInvoiceInput } from "../schema/schemas";

export const invoiceService = {
    async getInvoices(
  bookingId: string
): Promise<ApiResponse<Invoice[]>> {
  return api.get<Invoice[]>(
    `/api/admin/bookings/${bookingId}/invoices`
  );
},

async getInvoice(
  bookingId: string,
  invoiceId: string
): Promise<ApiResponse<Invoice>> {
  return api.get<Invoice>(
    `/api/admin/bookings/${bookingId}/invoices/${invoiceId}`
  );
},

async createInvoice(
  bookingId: string,
  data: CreateInvoiceInput
): Promise<ApiResponse<Invoice>> {
  return api.post<Invoice>(
    `/api/admin/bookings/${bookingId}/invoices`,
    data
  );
},

async updateInvoice(
  bookingId: string,
  invoiceId: string,
  data: UpdateInvoiceInput
): Promise<ApiResponse<Invoice>> {
  return api.patch<Invoice>(
    `/api/admin/bookings/${bookingId}/invoices/${invoiceId}`,
    data
  );
},

async issueInvoice(
  bookingId: string,
  invoiceId: string
): Promise<ApiResponse<Invoice>> {
  return api.post<Invoice>(
    `/api/admin/bookings/${bookingId}/invoices/${invoiceId}/issue`,
    {}
  );
},

async voidInvoice(
  bookingId: string,
  invoiceId: string
): Promise<ApiResponse<Invoice>> {
  return api.post<Invoice>(
    `/api/admin/bookings/${bookingId}/invoices/${invoiceId}/void`,
    {}
  );
},
}