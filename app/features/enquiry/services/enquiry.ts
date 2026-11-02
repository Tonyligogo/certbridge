import { api } from "@/lib/api";
import type { AdminEnquiriesResponse, AdminEnquiryActivity, AdminEnquiryDetail, CreatedEnquiry, CreateEnquiryInput, EnquiryStatus, GetEnquiriesParams } from "../types";
import { AddEnquiryNoteInput, UpdateEnquiryInput } from "../lib/validation/enquiry";

export const enquiryService = {
  async createEnquiry(data: CreateEnquiryInput) {
    return api.post<CreatedEnquiry>("/api/enquiries", data);
  },

  async getEnquiries(params: GetEnquiriesParams) {
    const query = new URLSearchParams();
  
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 10));
  
    if (params.search) {
      query.set("search", params.search);
    }
  
    if (params.status && params.status !== "ALL") {
      query.set("status", params.status);
    }
  
    if (params.type && params.type !== "ALL") {
      query.set("type", params.type);
    }
  
    if (params.dateFrom) {
      query.set("dateFrom", params.dateFrom);
    }
  
    if (params.dateTo) {
      query.set("dateTo", params.dateTo);
    }
  
    return api.get<AdminEnquiriesResponse>(
      `/api/admin/enquiries?${query.toString()}`
    );
  },

  async getEnquiryDetails(id: string) {
    return api.get<AdminEnquiryDetail>(
      `/api/admin/enquiries/${id}`
    );
  },
// Inside enquiryService:

updateEnquiry: async (
  id: string,
  input: UpdateEnquiryInput
) =>
  api.patch<{
    id: string;
    status: EnquiryStatus;
    closedAt: string | null;
    updatedAt: string;
  }>(
    `/api/admin/enquiries/${id}`,
    input
  ),

addNote: async (
  id: string,
  input: AddEnquiryNoteInput
) =>
  api.post<AdminEnquiryActivity>(
    `/api/admin/enquiries/${id}/activities`,
    input
  ),
};
