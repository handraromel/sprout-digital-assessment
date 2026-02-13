import { INVOICE_ENDPOINTS, PAYMENT_ENDPOINTS } from "@/constants/api/invoice";
import type {
  CreatePaymentRequest,
  CustomersResponse,
  InvoiceListResponse,
  InvoiceSummaryResponse,
  PaymentListResponse,
  PaymentResponse,
  UnpaidInvoicesResponse,
} from "@/types/invoice";
import { httpGet, httpPost } from "@/utils/httpClient";

export interface InvoiceSearchParams {
  search?: string;
  customerName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaymentSearchParams {
  search?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const invoiceService = {
  getAll: async (
    params?: InvoiceSearchParams,
  ): Promise<InvoiceListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.customerName)
      searchParams.append("customerName", params.customerName);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    const url = query
      ? `${INVOICE_ENDPOINTS.LIST}?${query}`
      : INVOICE_ENDPOINTS.LIST;
    return httpGet<InvoiceListResponse>(url);
  },

  getSummary: async (): Promise<InvoiceSummaryResponse> => {
    return httpGet<InvoiceSummaryResponse>(INVOICE_ENDPOINTS.SUMMARY);
  },

  getCustomers: async (): Promise<CustomersResponse> => {
    return httpGet<CustomersResponse>(INVOICE_ENDPOINTS.CUSTOMERS);
  },

  getUnpaidByCustomer: async (
    customerName: string,
  ): Promise<UnpaidInvoicesResponse> => {
    return httpGet<UnpaidInvoicesResponse>(
      INVOICE_ENDPOINTS.UNPAID_BY_CUSTOMER(customerName),
    );
  },
};

export const paymentService = {
  getAll: async (
    params?: PaymentSearchParams,
  ): Promise<PaymentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.customerName)
      searchParams.append("customerName", params.customerName);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    const url = query
      ? `${PAYMENT_ENDPOINTS.LIST}?${query}`
      : PAYMENT_ENDPOINTS.LIST;
    return httpGet<PaymentListResponse>(url);
  },

  getById: async (id: string): Promise<PaymentResponse> => {
    return httpGet<PaymentResponse>(PAYMENT_ENDPOINTS.BY_ID(id));
  },

  create: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    return httpPost<PaymentResponse>(PAYMENT_ENDPOINTS.CREATE, data);
  },
};
