export const INVOICE_ENDPOINTS = {
  LIST: "/api/v1/invoices",
  SUMMARY: "/api/v1/invoices/summary",
  CUSTOMERS: "/api/v1/invoices/customers",
  UNPAID_BY_CUSTOMER: (customerName: string) =>
    `/api/v1/invoices/unpaid/${encodeURIComponent(customerName)}`,
  BY_ID: (id: string) => `/api/v1/invoices/${id}`,
  CREATE: "/api/v1/invoices",
} as const;

export const PAYMENT_ENDPOINTS = {
  LIST: "/api/v1/payments",
  BY_ID: (id: string) => `/api/v1/payments/${id}`,
  CREATE: "/api/v1/payments",
} as const;
