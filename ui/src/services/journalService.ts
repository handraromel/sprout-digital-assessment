import { API_ENDPOINTS } from "@/constants/api";
import type {
  CreateJournalEntryRequest,
  JournalEntryDeleteResponse,
  JournalEntryListResponse,
  JournalEntryResponse,
  ReverseJournalEntryRequest,
  UpdateJournalEntryRequest,
} from "@/types/journal";
import {
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  httpPut,
} from "@/utils/httpClient";

export const journalService = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<JournalEntryListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    const url = query
      ? `${API_ENDPOINTS.JOURNALS.LIST}?${query}`
      : API_ENDPOINTS.JOURNALS.LIST;
    return httpGet<JournalEntryListResponse>(url);
  },

  getById: async (id: string): Promise<JournalEntryResponse> => {
    return httpGet<JournalEntryResponse>(API_ENDPOINTS.JOURNALS.BY_ID(id));
  },

  create: async (
    data: CreateJournalEntryRequest,
  ): Promise<JournalEntryResponse> => {
    return httpPost<JournalEntryResponse>(API_ENDPOINTS.JOURNALS.CREATE, data);
  },

  update: async (
    id: string,
    data: UpdateJournalEntryRequest,
  ): Promise<JournalEntryResponse> => {
    return httpPut<JournalEntryResponse>(
      API_ENDPOINTS.JOURNALS.UPDATE(id),
      data,
    );
  },

  delete: async (id: string): Promise<JournalEntryDeleteResponse> => {
    return httpDelete<JournalEntryDeleteResponse>(
      API_ENDPOINTS.JOURNALS.DELETE(id),
    );
  },

  post: async (id: string): Promise<JournalEntryResponse> => {
    return httpPatch<JournalEntryResponse>(API_ENDPOINTS.JOURNALS.POST(id), {});
  },

  reverse: async (
    id: string,
    data: ReverseJournalEntryRequest,
  ): Promise<JournalEntryResponse> => {
    return httpPatch<JournalEntryResponse>(
      API_ENDPOINTS.JOURNALS.REVERSE(id),
      data,
    );
  },
};
