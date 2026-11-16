
import { api } from "@/lib/api";

import type {
  AdminEnquiriesResponse,
  AdminEnquiryActivity,
  AdminEnquiryDetail,
  ConvertEnquiryResult,
  CreatedEnquiry,
  CreateEnquiryInput,
  EnquiryStatus,
  GetEnquiriesParams,
  UpdatedEnquiryDetails,
  UpdateEnquiryDetailsInput,
  UpdateEnquiryStatusInput,
} from "../types";

import {
  AddEnquiryNoteInput,
  ConvertEnquiryInput,
} from "../lib/validation/enquiry";

export const enquiryService = {
  async createEnquiry(data: CreateEnquiryInput) {
    return api.post<CreatedEnquiry>(
      "/api/enquiries",
      data,
    );
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
      `/api/admin/enquiries?${query.toString()}`,
    );
  },

  async getEnquiryDetails(id: string) {
    return api.get<AdminEnquiryDetail>(
      `/api/admin/enquiries/${id}`,
    );
  },

  // Edit enquiry information
  async updateEnquiryDetails(
  id: string,
  input: UpdateEnquiryDetailsInput,
) {
  return api.patch<UpdatedEnquiryDetails>(
    `/api/admin/enquiries/${id}`,
    input,
  );
},

  // Change enquiry workflow status
  async updateEnquiryStatus(
    id: string,
    input: UpdateEnquiryStatusInput,
  ) {
    return api.patch<{
      id: string;
      status: EnquiryStatus;
      closedAt: string | null;
      updatedAt: string;
    }>(
      `/api/admin/enquiries/${id}/status`,
      input,
    );
  },

  async addNote(
    id: string,
    input: AddEnquiryNoteInput,
  ) {
    return api.post<AdminEnquiryActivity>(
      `/api/admin/enquiries/${id}/activities`,
      input,
    );
  },

  async convertEnquiry(
    id: string,
    input: ConvertEnquiryInput,
  ) {
    return api.post<ConvertEnquiryResult>(
      `/api/admin/enquiries/${id}/convert`,
      input,
    );
  },
};
