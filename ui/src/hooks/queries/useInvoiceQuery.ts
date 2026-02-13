import { INVOICE_MESSAGES } from "@/constants/invoice";
import {
  invoiceService,
  type InvoiceSearchParams,
} from "@/services/invoiceService";
import { useNotificationStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export const INVOICE_QUERY_KEYS = {
  all: ["invoices"] as const,
  list: (params?: InvoiceSearchParams) => ["invoices", "list", params] as const,
  summary: () => ["invoices", "summary"] as const,
  customers: () => ["invoices", "customers"] as const,
  unpaidByCustomer: (customerName: string) =>
    ["invoices", "unpaid", customerName] as const,
  detail: (id: string) => ["invoices", id] as const,
};

export const useInvoiceListQuery = (params?: InvoiceSearchParams) => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.list(params),
    queryFn: () => invoiceService.getAll(params),
    select: (response) => ({
      data: response.data,
      pagination: response.pagination,
    }),
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        showError(INVOICE_MESSAGES.FETCH_ERROR);
      },
    },
  });
};

export const useInvoiceSummaryQuery = () => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.summary(),
    queryFn: () => invoiceService.getSummary(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        showError(INVOICE_MESSAGES.FETCH_ERROR);
      },
    },
  });
};

export const useCustomersQuery = () => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.customers(),
    queryFn: () => invoiceService.getCustomers(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        showError(INVOICE_MESSAGES.FETCH_CUSTOMERS_ERROR);
      },
    },
  });
};

export const useUnpaidInvoicesByCustomerQuery = (
  customerName: string | null,
) => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.unpaidByCustomer(customerName || ""),
    queryFn: () => invoiceService.getUnpaidByCustomer(customerName!),
    select: (response) => response.data,
    enabled: !!customerName,
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        showError(INVOICE_MESSAGES.FETCH_UNPAID_ERROR);
      },
    },
  });
};
