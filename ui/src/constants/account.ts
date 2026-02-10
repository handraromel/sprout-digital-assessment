import { AccountType } from "@/types/account";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.ASSET]: "Aset",
  [AccountType.LIABILITY]: "Kewajiban",
  [AccountType.EQUITY]: "Ekuitas",
  [AccountType.REVENUE]: "Pendapatan",
  [AccountType.EXPENSE]: "Beban",
};

export const ACCOUNT_CONFIG = {
  CODE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 20,
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  BALANCE: {
    MIN: 0,
  },
};

export const ACCOUNT_MESSAGES = {
  CREATE_SUCCESS: "Berhasil Tambah Akun Baru",
  CREATE_SUCCESS_DESC: "Akun baru berhasil ditambahkan!",
  UPDATE_SUCCESS: "Berhasil Update Akun",
  UPDATE_SUCCESS_DESC: "Akun berhasil diperbarui!",
  DELETE_SUCCESS: "Berhasil Hapus Akun",
  DELETE_SUCCESS_DESC: "Akun berhasil dihapus!",
  DELETE_CONFIRM_TITLE: "Hapus Akun",
  DELETE_CONFIRM_DESC: "Apakah kamu yakin ingin menghapus akun ini?",
  FETCH_ERROR: "Gagal memuat data akun",
  CREATE_ERROR: "Gagal membuat akun baru",
  UPDATE_ERROR: "Gagal memperbarui akun",
  DELETE_ERROR: "Gagal menghapus akun",
};
