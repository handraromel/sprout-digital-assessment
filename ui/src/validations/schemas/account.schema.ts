import { ACCOUNT_CONFIG } from "@/constants/account";
import * as yup from "yup";

export const createAccountSchema = yup.object({
  name: yup
    .string()
    .required("Nama akun wajib diisi")
    .min(ACCOUNT_CONFIG.NAME.MIN_LENGTH, "Nama akun terlalu pendek")
    .max(ACCOUNT_CONFIG.NAME.MAX_LENGTH, "Nama akun terlalu panjang")
    .trim(),
  code: yup
    .string()
    .required("Nomor akun wajib diisi")
    .min(ACCOUNT_CONFIG.CODE.MIN_LENGTH, "Nomor akun terlalu pendek")
    .max(ACCOUNT_CONFIG.CODE.MAX_LENGTH, "Nomor akun terlalu panjang")
    .trim(),
  parentId: yup.string().required("Akun induk wajib dipilih"),
  balance: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return 0;
      return value;
    })
    .min(ACCOUNT_CONFIG.BALANCE.MIN, "Saldo tidak boleh negatif")
    .default(0),
});

export const updateAccountSchema = yup.object({
  name: yup
    .string()
    .required("Nama akun wajib diisi")
    .min(ACCOUNT_CONFIG.NAME.MIN_LENGTH, "Nama akun terlalu pendek")
    .max(ACCOUNT_CONFIG.NAME.MAX_LENGTH, "Nama akun terlalu panjang")
    .trim(),
  parentId: yup.string().required("Akun induk wajib dipilih"),
  balance: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return 0;
      return value;
    })
    .min(ACCOUNT_CONFIG.BALANCE.MIN, "Saldo tidak boleh negatif")
    .default(0),
});

export type CreateAccountFormData = yup.InferType<typeof createAccountSchema>;
export type UpdateAccountFormData = yup.InferType<typeof updateAccountSchema>;
