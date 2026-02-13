import { API_ENDPOINTS } from "@/constants/api";
import type {
  AccountDeleteResponse,
  AccountListResponse,
  AccountResponse,
  AccountTreePaginatedParams,
  AccountTreePaginatedResponse,
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

  getTreePaginated: async (
    params: AccountTreePaginatedParams = {},
  ): Promise<AccountTreePaginatedResponse> => {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set("type", params.type);
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.cursor) searchParams.set("cursor", params.cursor);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.ACCOUNTS.TREE_PAGINATED}?${queryString}`
      : API_ENDPOINTS.ACCOUNTS.TREE_PAGINATED;

    return httpGet<AccountTreePaginatedResponse>(url);
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
