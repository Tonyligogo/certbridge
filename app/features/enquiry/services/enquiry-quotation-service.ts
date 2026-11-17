
import { api } from "@/lib/api";

import type {
  CreateEnquiryQuoteInput,
  CreateEnquiryQuoteResult,
  EnquiryQuote,
  EnquiryQuoteStatusResult,
  EnquiryQuoteVoidResult,
  SendEnquiryQuoteInput,
  UpdateEnquiryQuoteInput,
  UpdateEnquiryQuoteStatusInput,
  VoidEnquiryQuoteInput
} from "../types";

const baseUrl = (enquiryId: string) =>
  `/api/admin/enquiries/${enquiryId}/quotes`;

const quoteUrl = (
  enquiryId: string,
  quoteId: string,
) => `${baseUrl(enquiryId)}/${quoteId}`;

export const enquiryQuotationService = {
  async list(enquiryId: string) {
    const response = await api.get<EnquiryQuote[]>(
      baseUrl(enquiryId),
    );

    return response.data;
  },

  async get(enquiryId: string, quoteId: string) {
    const response = await api.get<EnquiryQuote>(
      quoteUrl(enquiryId, quoteId),
    );

    return response.data;
  },

 
async create(
  enquiryId: string,
  input: CreateEnquiryQuoteInput,
){
  const response = await api.post<CreateEnquiryQuoteResult>(
    baseUrl(enquiryId),
    input,
  );

  return response.data;
},


  async update(
    enquiryId: string,
    quoteId: string,
    input: UpdateEnquiryQuoteInput,
  ) {
    const response = await api.patch<EnquiryQuote>(
      quoteUrl(enquiryId, quoteId),
      input,
    );

    return response.data;
  },

  async issue(enquiryId: string, quoteId: string) {
    const response = await api.post(
      `${quoteUrl(enquiryId, quoteId)}/issue`,
      {quoteId},
    );

    return response.data;
  },

   async updateIssue(enquiryId: string, quoteId: string, input: UpdateEnquiryQuoteInput) {
    const response = await api.patch<EnquiryQuote>(
      `${quoteUrl(enquiryId, quoteId)}/issue`,
      input,
    );

    return response.data;
  },

  async send(
    enquiryId: string,
    quoteId: string,
    input: SendEnquiryQuoteInput = {},
  ) {
    // The send endpoint returns data and email as
    // separate top-level response properties.
    const response = await api.post<{
      id: string;
    }>(
      `${quoteUrl(enquiryId, quoteId)}/send`,
      input,
    );

    return response.data;
  },

  async updateStatus(
    enquiryId: string,
    quoteId: string,
    input: UpdateEnquiryQuoteStatusInput,
  ) {
    const response =
      await api.patch<EnquiryQuoteStatusResult>(
        `${quoteUrl(enquiryId, quoteId)}/status`,
        input,
      );

    return response.data;
  },

  async void(
    enquiryId: string,
    quoteId: string,
    input: VoidEnquiryQuoteInput,
  ) {
    const response =
      await api.post<EnquiryQuoteVoidResult>(
        `${quoteUrl(enquiryId, quoteId)}/void`,
        input,
      );

    return response.data;
  },
};
