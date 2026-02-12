import type { BreadcrumbItem } from "@/types/breadcrumb";

export const MODAL_ID = {
  DELETE: "journal-delete",
  SUCCESS: "journal-success",
  REVERSE: "journal-reverse",
} as const;

export const BREADCRUMB_ITEMS = {
  CREATE: [
    { label: "Jurnal Umum", href: "/journals" },
    { label: "Tambah Baru" },
  ] as BreadcrumbItem[],
  EDIT: [
    { label: "Jurnal Umum", href: "/journals" },
    { label: "Edit Jurnal" },
  ] as BreadcrumbItem[],
  DETAIL: [
    { label: "Jurnal Umum", href: "/journals" },
    { label: "Detail Jurnal" },
  ] as BreadcrumbItem[],
} as const;
