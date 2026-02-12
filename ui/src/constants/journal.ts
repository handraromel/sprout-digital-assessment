import { JournalStatus } from "@/types/journal";

export const JOURNAL_CONFIG = {
  DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
  },
  LINES: {
    MINIMUM: 2,
  },
  REVERSAL_REASON: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
  },
  PAGE_SIZE: 10,
};

export const JOURNAL_MESSAGES = {
  PAGE_TITLE: "Jurnal Umum",
  EMPTY: "Tidak ada data jurnal",
  ADD_NEW: "Tambah Jurnal Baru",
  CREATE_SUCCESS: "Berhasil Tambah Jurnal Baru",
  CREATE_SUCCESS_DESC: "Jurnal baru berhasil ditambahkan!",
  UPDATE_SUCCESS: "Berhasil Update Jurnal",
  UPDATE_SUCCESS_DESC: "Jurnal berhasil diperbarui!",
  DELETE_SUCCESS: "Berhasil Hapus Jurnal",
  DELETE_SUCCESS_DESC: "Jurnal berhasil dihapus!",
  POST_SUCCESS: "Berhasil Posting Jurnal",
  POST_SUCCESS_DESC: "Jurnal berhasil diposting!",
  REVERSE_SUCCESS: "Berhasil Batalkan Jurnal",
  REVERSE_SUCCESS_DESC: "Jurnal berhasil dibatalkan!",
  DELETE_CONFIRM_TITLE: "Hapus Jurnal",
  DELETE_CONFIRM_DESC: "Apakah kamu yakin ingin menghapus jurnal ini?",
  REVERSE_CONFIRM_TITLE: "Batalkan Jurnal",
  REVERSE_CONFIRM_DESC:
    "Apakah kamu yakin ingin membatalkan jurnal ini? Sistem akan membuat jurnal balik dengan nilai debit dan kredit yang ditukar.",
  FETCH_ERROR: "Gagal memuat data jurnal",
  CREATE_ERROR: "Gagal membuat jurnal baru",
  UPDATE_ERROR: "Gagal memperbarui jurnal",
  DELETE_ERROR: "Gagal menghapus jurnal",
  POST_ERROR: "Gagal memposting jurnal",
  REVERSE_ERROR: "Gagal membatalkan jurnal",
};

export const JOURNAL_STATUS_CONFIG: Record<
  JournalStatus,
  { label: string; textColor: string; bgColor: string }
> = {
  [JournalStatus.DRAFT]: {
    label: "Draft",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  [JournalStatus.POSTED]: {
    label: "Posted",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  [JournalStatus.REVERSED]: {
    label: "Canceled",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export const INVOICE_OPTIONS = [
  { value: "INV-2025-09-011", label: "INV-2025-09-011" },
  { value: "INV-2025-09-012", label: "INV-2025-09-012" },
  { value: "INV-2025-09-013", label: "INV-2025-09-013" },
  { value: "INV-2025-09-014", label: "INV-2025-09-014" },
  { value: "INV-2025-09-015", label: "INV-2025-09-015" },
  { value: "INV-2025-09-016", label: "INV-2025-09-016" },
  { value: "INV-2025-09-017", label: "INV-2025-09-017" },
  { value: "INV-2025-09-018", label: "INV-2025-09-018" },
  { value: "INV-2025-09-019", label: "INV-2025-09-019" },
  { value: "INV-2025-09-020", label: "INV-2025-09-020" },
];
