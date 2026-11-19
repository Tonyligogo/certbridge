import { api, type ApiResponse } from "@/lib/api";

import type {
  CreateQuoteInput,
  Quote,
  QuoteStatusResponse,
  UpdateQuoteStatusInput,
} from "../types/quote";
import { SendInvoiceEmailInput } from "../../invoices/schema/schemas";
import { UpdateQuoteInput } from "../lib/quote-schema";

export const quoteService = {
  /**
   * Get the quote for a booking.
   */
  async getQuote(
    bookingId: string
  ): Promise<ApiResponse<Quote | null>> {
    return api.get<Quote | null>(
      `/api/admin/bookings/${bookingId}/quotes`
    );
  },

  /**
   * Create the quote for a booking.
   */
  async createQuote(
    bookingId: string,
    data: CreateQuoteInput
  ): Promise<ApiResponse<Quote>> {
    return api.post<Quote>(
      `/api/admin/bookings/${bookingId}/quotes`,
      data
    );
  },

  async sendQuoteEmail(
    bookingId: string,
    quoteId: string,
    data: SendInvoiceEmailInput = {}
  ): Promise<ApiResponse<Quote>> {
    return api.post<Quote>(
      `/api/admin/bookings/${bookingId}/quotes/${quoteId}/send`,
      data
    );
  },

  /**
   * Update the quote for a booking.
   */
  async updateQuote(
    bookingId: string,
    data: UpdateQuoteInput
  ): Promise<ApiResponse<Quote>> {
    return api.patch<Quote>(
      `/api/admin/bookings/${bookingId}/quotes`,
      data
    );
  },

  async updateQuoteStatus(
     bookingId: string,
     data: UpdateQuoteStatusInput
   ): Promise<ApiResponse<QuoteStatusResponse>> {
     return api.patch<QuoteStatusResponse>(
       `/api/admin/bookings/${bookingId}/quotes/status`,
       data
     );
   },
};
