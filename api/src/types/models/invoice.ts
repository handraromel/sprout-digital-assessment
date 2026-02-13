/**
 * Invoice & Payment Model Types
 * Represents the Penagihan (A/R Management) entities and related operations
 */

import { Decimal } from "@prisma/client/runtime/client";
import {
  InvoiceStatus,
  Invoice as PrismaInvoice,
  Payment as PrismaPayment,
  PaymentAllocation as PrismaPaymentAllocation,
} from "../../../generated/prisma/client";

export { InvoiceStatus } from "../../../generated/prisma/client";

export type Invoice = PrismaInvoice;
export type Payment = PrismaPayment;
export type PaymentAllocation = PrismaPaymentAllocation;

export interface InvoiceWithRelations extends Invoice {
  createdBy?: { id: string; fullname: string | null } | null;
  paymentAllocations?: PaymentAllocationWithPayment[];
}

export interface PaymentAllocationWithInvoice extends PaymentAllocation {
  invoice: {
    id: string;
    invoiceNumber: string;
    dueDate: Date;
    totalAmount: Decimal;
    remainingBalance: Decimal;
  };
}

export interface PaymentAllocationWithPayment extends PaymentAllocation {
  payment: {
    id: string;
    paymentNumber: string;
    paymentDate: Date;
  };
}

export interface PaymentWithRelations extends Payment {
  depositAccount: { id: string; code: string; name: string };
  discountAccount?: { id: string; code: string; name: string } | null;
  journalEntry?: { id: string; entryNumber: string } | null;
  createdBy?: { id: string; fullname: string | null } | null;
  allocations: PaymentAllocationWithInvoice[];
}

export interface CreateInvoice {
  invoiceNumber?: string;
  customerName: string;
  date: Date | string;
  dueDate: Date | string;
  totalAmount: number | string | Decimal;
  createdById?: string;
}

export interface CreatePaymentAllocation {
  invoiceId: string;
  allocatedAmount: number | string | Decimal;
}

export interface CreatePayment {
  paymentDate: Date | string;
  customerName: string;
  depositAccountId: string;
  discountAccountId?: string | null;
  discountPercent?: number | string | Decimal | null;
  allocations: CreatePaymentAllocation[];
  createdById?: string;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  totalAmount: string;
  remainingBalance: string;
  status: InvoiceStatus;
  daysOverdue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentAllocationResponse {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDueDate: string;
  allocatedAmount: string;
}

export interface PaymentResponse {
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
  allocations: PaymentAllocationResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceSearchParams {
  search?: string;
  customerName?: string;
  status?: InvoiceStatus;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
}

export interface PaymentSearchParams {
  search?: string;
  customerName?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
}

export interface InvoiceSummary {
  totalPiutang: string;
  totalJatuhTempo: string;
}
