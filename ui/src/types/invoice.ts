export const InvoiceStatus = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  totalAmount: string;
  remainingBalance: string;
  status: InvoiceStatus;
  daysOverdue: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummary {
  totalPiutang: string;
  totalJatuhTempo: string;
}

export interface PaymentAllocation {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDueDate: string;
  allocatedAmount: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  customerName: string;
  depositAccountId: string;
  depositAccountCode: string;
  depositAccountName: string;
  discountAccountId: string | null;
  discountAccountCode: string | null;
  discountAccountName: string | null;
  totalAmount: string;
  discountPercent: string | null;
  discountAmount: string | null;
  journalEntryId: string | null;
  journalEntryNumber: string | null;
  allocations: PaymentAllocation[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentAllocationRequest {
  invoiceId: string;
  allocatedAmount: number;
}

export interface CreatePaymentRequest {
  paymentDate: string;
  customerName: string;
  depositAccountId: string;
  discountAccountId?: string | null;
  discountPercent?: number | null;
  allocations: CreatePaymentAllocationRequest[];
}

export interface InvoiceListResponse {
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  data: Invoice[];
}

export interface InvoiceSummaryResponse {
  message: string;
  data: InvoiceSummary;
}

export interface CustomersResponse {
  message: string;
  data: string[];
}

export interface UnpaidInvoicesResponse {
  message: string;
  data: Invoice[];
}

export interface PaymentResponse {
  message: string;
  data: Payment;
}

export interface PaymentListResponse {
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  data: Payment[];
}
