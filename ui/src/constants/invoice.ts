import type { InvoiceStatus } from "@/types/invoice";

export const INVOICE_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
  DISCOUNT: {
    MIN: 0,
    MAX: 100,
  },
} as const;

export const INVOICE_MESSAGES = {
  PAYMENT_CREATE_SUCCESS: "Pembayaran berhasil dicatat",
  PAYMENT_CREATE_ERROR: "Gagal mencatat pembayaran",
  FETCH_ERROR: "Gagal memuat data penagihan",
  FETCH_CUSTOMERS_ERROR: "Gagal memuat data pelanggan",
  FETCH_UNPAID_ERROR: "Gagal memuat data tagihan belum lunas",
} as const;

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; color: string; bgColor: string }
> = {
  UNPAID: {
    label: "Belum Lunas",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
  },
  PARTIAL: {
    label: "Sebagian",
    color: "text-blue-800",
    bgColor: "bg-blue-100",
  },
  PAID: {
    label: "Lunas",
    color: "text-green-800",
    bgColor: "bg-green-100",
  },
} as const;
