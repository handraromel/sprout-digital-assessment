export const MODAL_ID = {
  PAYMENT: "payment-modal",
} as const;

export const INVOICE_TABLE_COLUMNS = {
  CUSTOMER_NAME: "customerName",
  INVOICE_NUMBER: "invoiceNumber",
  DUE_DATE: "dueDate",
  DAYS_OVERDUE: "daysOverdue",
  REMAINING_BALANCE: "remainingBalance",
} as const;

export const MOCK_CUSTOMERS = [
  "PT. Abadi Nan Jaya",
  "CV. Indah Sentosa",
  "PT. Sinar Harapan",
  "PT. Kemilau Bersama",
  "CV. Harapan Jaya",
  "PT. Sejahtera Abadi",
  "PT. Cipta Karya Jaya Rasa",
  "PT. Maju Pantang Molor",
  "CV. Kemana Aja",
] as const;

// Mock discount options - maps account codes to discount percentages
// These are used as fallback when real accounts aren't available
export const DISCOUNT_OPTIONS: Record<
  string,
  { name: string; percent: number }
> = {
  "701.001": { name: "Diskon Penjualan Barang Dagangan", percent: 10 },
  "701.002": {
    name: "Diskon Penjualan Barang Dagangan Beban Distributor",
    percent: 5,
  },
  "701.003": { name: "Diskon Penjualan Barang Dagangan Diklaim", percent: 15 },
  "701.004": {
    name: "Diskon Penjualan Barang Dagangan Klaim Beban Distributor",
    percent: 20,
  },
};

export interface DiscountAccountOption {
  value: string; // account ID
  label: string;
  code: string;
  percent: number;
}
