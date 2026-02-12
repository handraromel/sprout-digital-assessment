/**
 * Journal Entry Seed Data
 * Sample Jurnal Umum (General Journal) entries
 */

import { JournalStatus } from "../../generated/prisma/client";

export interface JournalEntrySeedLine {
  accountCode: string;
  debit: number;
  credit: number;
}

export interface JournalEntrySeed {
  entryNumber: string;
  date: Date;
  description: string;
  invoiceReference?: string;
  status: JournalStatus;
  reversalReason?: string;
  lines: JournalEntrySeedLine[];
}

export const journalSeedData: JournalEntrySeed[] = [
  {
    entryNumber: "JU-2025-001",
    date: new Date("2025-10-01"),
    description: "Biaya ATK bulan Oktober",
    status: "POSTED",
    lines: [
      { accountCode: "525.000", debit: 750000, credit: 0 },
      { accountCode: "111.001", debit: 0, credit: 750000 },
    ],
  },
  {
    entryNumber: "JU-2025-002",
    date: new Date("2025-10-03"),
    description: "Pembayaran gaji karyawan Oktober",
    status: "POSTED",
    lines: [
      { accountCode: "521.000", debit: 15000000, credit: 0 },
      { accountCode: "111.002", debit: 0, credit: 15000000 },
    ],
  },
  {
    entryNumber: "JU-2025-003",
    date: new Date("2025-10-05"),
    description: "Penerimaan pendapatan jasa konsultasi",
    invoiceReference: "INV-2025-09-011",
    status: "POSTED",
    lines: [
      { accountCode: "111.002", debit: 5000000, credit: 0 },
      { accountCode: "412.000", debit: 0, credit: 5000000 },
    ],
  },
  {
    entryNumber: "JU-2025-004",
    date: new Date("2025-10-08"),
    description: "Pembayaran sewa kantor bulan Oktober",
    status: "POSTED",
    lines: [
      { accountCode: "522.000", debit: 5000000, credit: 0 },
      { accountCode: "111.003", debit: 0, credit: 5000000 },
    ],
  },
  {
    entryNumber: "JU-2025-005",
    date: new Date("2025-10-10"),
    description: "Biaya listrik dan air bulan September",
    status: "POSTED",
    lines: [
      { accountCode: "523.000", debit: 1500000, credit: 0 },
      { accountCode: "111.001", debit: 0, credit: 1500000 },
    ],
  },
  {
    entryNumber: "JU-2025-006",
    date: new Date("2025-10-12"),
    description: "Penjualan barang dagang",
    invoiceReference: "INV-2025-09-015",
    status: "POSTED",
    lines: [
      { accountCode: "112.001", debit: 8500000, credit: 0 },
      { accountCode: "411.000", debit: 0, credit: 8500000 },
    ],
  },
  {
    entryNumber: "JU-2025-007",
    date: new Date("2025-10-15"),
    description: "Pembelian persediaan barang dagang",
    invoiceReference: "PO-2025-10-001",
    status: "POSTED",
    lines: [
      { accountCode: "113.001", debit: 12000000, credit: 0 },
      { accountCode: "211.001", debit: 0, credit: 12000000 },
    ],
  },
  {
    entryNumber: "JU-2025-008",
    date: new Date("2025-10-18"),
    description: "Biaya telepon dan internet bulan September",
    status: "DRAFT",
    lines: [
      { accountCode: "524.000", debit: 850000, credit: 0 },
      { accountCode: "111.001", debit: 0, credit: 850000 },
    ],
  },
  {
    entryNumber: "JU-2025-009",
    date: new Date("2025-10-20"),
    description: "Pembayaran hutang dagang ke supplier",
    status: "POSTED",
    lines: [
      { accountCode: "211.001", debit: 7500000, credit: 0 },
      { accountCode: "111.002", debit: 0, credit: 7500000 },
    ],
  },
  {
    entryNumber: "JU-2025-010",
    date: new Date("2025-10-22"),
    description: "Penerimaan piutang dari pelanggan",
    status: "POSTED",
    lines: [
      { accountCode: "111.003", debit: 6000000, credit: 0 },
      { accountCode: "112.001", debit: 0, credit: 6000000 },
    ],
  },
  {
    entryNumber: "JU-2025-011",
    date: new Date("2025-10-24"),
    description: "Biaya transportasi operasional",
    status: "DRAFT",
    lines: [
      { accountCode: "527.000", debit: 2500000, credit: 0 },
      { accountCode: "111.001", debit: 0, credit: 2500000 },
    ],
  },
  {
    entryNumber: "JU-2025-012",
    date: new Date("2025-10-26"),
    description: "Biaya kesehatan bulan Oktober",
    status: "REVERSED",
    reversalReason: "Kesalahan input nominal",
    lines: [
      { accountCode: "525.000", debit: 3000000, credit: 0 },
      { accountCode: "111.002", debit: 0, credit: 3000000 },
    ],
  },
  {
    entryNumber: "JU-2025-013",
    date: new Date("2025-10-27"),
    description: "Biaya Makan bulan Oktober",
    status: "DRAFT",
    lines: [
      { accountCode: "525.000", debit: 1200000, credit: 0 },
      { accountCode: "111.001", debit: 0, credit: 1200000 },
    ],
  },
  {
    entryNumber: "JU-2025-014",
    date: new Date("2025-10-28"),
    description: "Pendapatan bunga bank",
    status: "POSTED",
    lines: [
      { accountCode: "111.002", debit: 250000, credit: 0 },
      { accountCode: "421.000", debit: 0, credit: 250000 },
    ],
  },
  {
    entryNumber: "JU-2025-015",
    date: new Date("2025-10-30"),
    description: "Biaya administrasi bank",
    status: "POSTED",
    lines: [
      { accountCode: "532.000", debit: 50000, credit: 0 },
      { accountCode: "111.002", debit: 0, credit: 50000 },
    ],
  },
];
