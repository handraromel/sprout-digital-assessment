import { INVOICE_CONFIG } from "@/constants/invoice";
import * as yup from "yup";

const paymentAllocationSchema = yup.object({
  invoiceId: yup.string().required("Invoice wajib dipilih"),
  allocatedAmount: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return 0;
      return value;
    })
    .min(1, "Jumlah pembayaran harus lebih dari 0")
    .required("Jumlah pembayaran wajib diisi"),
});

export const createPaymentSchema = yup.object({
  paymentDate: yup
    .date()
    .required("Tanggal pembayaran wajib diisi")
    .typeError("Tanggal tidak valid"),
  customerName: yup.string().required("Pelanggan wajib dipilih"),
  depositAccountId: yup.string().required("Akun deposit wajib dipilih"),
  discountAccountId: yup.string().nullable().default(null),
  discountPercent: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return null;
      return value;
    })
    .nullable()
    .default(null)
    .min(INVOICE_CONFIG.DISCOUNT.MIN, "Diskon tidak boleh negatif")
    .max(INVOICE_CONFIG.DISCOUNT.MAX, "Diskon tidak boleh lebih dari 100%"),
  allocations: yup
    .array()
    .of(paymentAllocationSchema)
    .min(1, "Minimal 1 tagihan harus dipilih untuk pembayaran")
    .required("Alokasi pembayaran wajib diisi"),
});

export interface CreatePaymentFormData {
  paymentDate: Date;
  customerName: string;
  depositAccountId: string;
  discountAccountId: string | null;
  discountPercent: number | null;
  allocations: {
    invoiceId: string;
    allocatedAmount: number;
  }[];
}

export type PaymentAllocationFormData = yup.InferType<
  typeof paymentAllocationSchema
>;
