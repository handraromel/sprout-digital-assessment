import { API_ENDPOINTS } from "@/constants/api";
import type {
  AccountDeleteResponse,
  AccountListResponse,
  AccountResponse,
  AccountTreeResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types/account";
import { httpDelete, httpGet, httpPost, httpPut } from "@/utils/httpClient";

export const accountService = {
  getAll: async (): Promise<AccountListResponse> => {
    return httpGet<AccountListResponse>(API_ENDPOINTS.ACCOUNTS.LIST);
  },

  getTree: async (): Promise<AccountTreeResponse> => {
    return httpGet<AccountTreeResponse>(API_ENDPOINTS.ACCOUNTS.TREE);
  },

  getById: async (id: string): Promise<AccountResponse> => {
    return httpGet<AccountResponse>(API_ENDPOINTS.ACCOUNTS.BY_ID(id));
  },

  create: async (data: CreateAccountRequest): Promise<AccountResponse> => {
    return httpPost<AccountResponse>(API_ENDPOINTS.ACCOUNTS.CREATE, data);
  },

  update: async (
    id: string,
    data: UpdateAccountRequest,
  ): Promise<AccountResponse> => {
    return httpPut<AccountResponse>(API_ENDPOINTS.ACCOUNTS.UPDATE(id), data);
  },

  delete: async (id: string): Promise<AccountDeleteResponse> => {
    return httpDelete<AccountDeleteResponse>(API_ENDPOINTS.ACCOUNTS.DELETE(id));
  },
};
