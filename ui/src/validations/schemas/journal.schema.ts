import { JOURNAL_CONFIG } from "@/constants/journal";
import * as yup from "yup";

const journalLineSchema = yup.object({
  accountId: yup.string().required("Akun wajib dipilih"),
  debit: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return 0;
      return value;
    })
    .min(0, "Debit tidak boleh negatif")
    .default(0),
  credit: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return 0;
      return value;
    })
    .min(0, "Kredit tidak boleh negatif")
    .default(0),
});

export const createJournalSchema = yup.object({
  date: yup
    .date()
    .required("Tanggal wajib diisi")
    .typeError("Tanggal tidak valid"),
  description: yup
    .string()
    .required("Deskripsi wajib diisi")
    .min(JOURNAL_CONFIG.DESCRIPTION.MIN_LENGTH, "Deskripsi terlalu pendek")
    .max(JOURNAL_CONFIG.DESCRIPTION.MAX_LENGTH, "Deskripsi terlalu panjang")
    .trim(),
  invoiceReference: yup.string().nullable(),
  lines: yup
    .array()
    .of(journalLineSchema)
    .min(JOURNAL_CONFIG.LINES.MINIMUM, "Minimal 2 baris jurnal diperlukan")
    .test(
      "debit-credit-balance",
      "Total debit harus sama dengan total kredit",
      (lines) => {
        if (!lines) return false;
        const totalDebit = lines.reduce(
          (sum, line) => sum + (line.debit || 0),
          0,
        );
        const totalCredit = lines.reduce(
          (sum, line) => sum + (line.credit || 0),
          0,
        );
        return totalDebit === totalCredit && totalDebit > 0;
      },
    )
    .test(
      "line-has-amount",
      "Setiap baris harus memiliki nilai debit atau kredit",
      (lines) => {
        if (!lines) return false;
        return lines.every(
          (line) => (line.debit || 0) > 0 || (line.credit || 0) > 0,
        );
      },
    )
    .required(),
});

export const reverseJournalSchema = yup.object({
  reason: yup
    .string()
    .required("Alasan pembatalan wajib diisi")
    .min(JOURNAL_CONFIG.REVERSAL_REASON.MIN_LENGTH, "Alasan terlalu pendek")
    .max(JOURNAL_CONFIG.REVERSAL_REASON.MAX_LENGTH, "Alasan terlalu panjang")
    .trim(),
});

export type CreateJournalFormData = yup.InferType<typeof createJournalSchema>;
export type JournalLineFormData = yup.InferType<typeof journalLineSchema>;
export type ReverseJournalFormData = yup.InferType<typeof reverseJournalSchema>;
