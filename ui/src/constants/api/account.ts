export const ACCOUNT_ENDPOINTS = {
  LIST: "/api/v1/accounts",
  TREE: "/api/v1/accounts/tree",
  TREE_PAGINATED: "/api/v1/accounts/tree/paginated",
  BY_ID: (id: string) => `/api/v1/accounts/${id}`,
  CREATE: "/api/v1/accounts",
  UPDATE: (id: string) => `/api/v1/accounts/${id}`,
  DELETE: (id: string) => `/api/v1/accounts/${id}`,
} as const;
