export const JOURNAL_ENDPOINTS = {
  LIST: "/api/v1/journals",
  BY_ID: (id: string) => `/api/v1/journals/${id}`,
  CREATE: "/api/v1/journals",
  UPDATE: (id: string) => `/api/v1/journals/${id}`,
  DELETE: (id: string) => `/api/v1/journals/${id}`,
  POST: (id: string) => `/api/v1/journals/${id}/post`,
  REVERSE: (id: string) => `/api/v1/journals/${id}/reverse`,
} as const;
