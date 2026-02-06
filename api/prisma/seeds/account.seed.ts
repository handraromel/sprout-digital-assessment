/**
 * Account Seed Data
 * Indonesian Standard Chart of Accounts (Daftar Akun)
 */

import { AccountType } from "../../generated/prisma/client";

interface AccountSeed {
  code: string;
  name: string;
  type: AccountType;
  parentCode?: string;
  balance?: number;
  isSystem?: boolean;
  isControl?: boolean;
}

export const accountSeedData: AccountSeed[] = [
  // ============================================
  // ASSETS (ASET) - 1xx.xxx
  // ============================================
  {
    code: "100.000",
    name: "ASET",
    type: "ASSET",
    isSystem: true,
    isControl: true,
  },

  // Current Assets (Aset Lancar)
  {
    code: "110.000",
    name: "ASET LANCAR",
    type: "ASSET",
    parentCode: "100.000",
    isSystem: true,
  },
  { code: "111.000", name: "Kas & Bank", type: "ASSET", parentCode: "110.000" },
  {
    code: "111.001",
    name: "Kas Kantor",
    type: "ASSET",
    parentCode: "111.000",
    balance: 5000000,
  },
  {
    code: "111.002",
    name: "Bank BCA",
    type: "ASSET",
    parentCode: "111.000",
    balance: 5000000,
  },
  {
    code: "111.003",
    name: "Bank Mandiri",
    type: "ASSET",
    parentCode: "111.000",
    balance: 5000000,
  },
  {
    code: "111.004",
    name: "Bank BRI",
    type: "ASSET",
    parentCode: "111.000",
    balance: 5000000,
  },
  {
    code: "112.000",
    name: "Piutang Usaha",
    type: "ASSET",
    parentCode: "110.000",
    balance: 20000000,
  },
  {
    code: "112.001",
    name: "Piutang Dagang",
    type: "ASSET",
    parentCode: "112.000",
    balance: 15000000,
  },
  {
    code: "112.002",
    name: "Piutang Karyawan",
    type: "ASSET",
    parentCode: "112.000",
    balance: 5000000,
  },
  {
    code: "113.000",
    name: "Persediaan",
    type: "ASSET",
    parentCode: "110.000",
    balance: 20000000,
  },
  {
    code: "113.001",
    name: "Persediaan Barang Dagang",
    type: "ASSET",
    parentCode: "113.000",
    balance: 15000000,
  },
  {
    code: "113.002",
    name: "Persediaan Bahan Baku",
    type: "ASSET",
    parentCode: "113.000",
    balance: 5000000,
  },
  {
    code: "114.000",
    name: "Pajak Dibayar di Muka",
    type: "ASSET",
    parentCode: "110.000",
    balance: 20000000,
  },
  {
    code: "114.001",
    name: "PPN Masukan",
    type: "ASSET",
    parentCode: "114.000",
    balance: 5000000,
  },
  {
    code: "114.002",
    name: "PPh 23 Dibayar di Muka",
    type: "ASSET",
    parentCode: "114.000",
    balance: 5000000,
  },
  {
    code: "115.000",
    name: "Biaya Dibayar di Muka",
    type: "ASSET",
    parentCode: "110.000",
    balance: 10000000,
  },
  {
    code: "115.001",
    name: "Sewa Dibayar di Muka",
    type: "ASSET",
    parentCode: "115.000",
    balance: 6000000,
  },
  {
    code: "115.002",
    name: "Asuransi Dibayar di Muka",
    type: "ASSET",
    parentCode: "115.000",
    balance: 4000000,
  },

  // Fixed Assets (Aset Tetap)
  {
    code: "120.000",
    name: "ASET TETAP",
    type: "ASSET",
    parentCode: "100.000",
    isSystem: true,
  },
  {
    code: "121.000",
    name: "Tanah dan Bangunan",
    type: "ASSET",
    parentCode: "120.000",
    balance: 200000000,
  },
  {
    code: "121.001",
    name: "Tanah",
    type: "ASSET",
    parentCode: "121.000",
    balance: 150000000,
  },
  {
    code: "121.002",
    name: "Bangunan",
    type: "ASSET",
    parentCode: "121.000",
    balance: 50000000,
  },
  {
    code: "122.000",
    name: "Kendaraan",
    type: "ASSET",
    parentCode: "120.000",
    balance: 100000000,
  },
  {
    code: "123.000",
    name: "Peralatan Kantor",
    type: "ASSET",
    parentCode: "120.000",
    balance: 25000000,
  },
  {
    code: "124.000",
    name: "Akumulasi Penyusutan",
    type: "ASSET",
    parentCode: "120.000",
    balance: -50000000,
  },

  // ============================================
  // LIABILITIES (KEWAJIBAN) - 2xx.xxx
  // ============================================
  {
    code: "200.000",
    name: "KEWAJIBAN",
    type: "LIABILITY",
    isSystem: true,
    isControl: true,
  },

  // Current Liabilities (Kewajiban Lancar)
  {
    code: "210.000",
    name: "KEWAJIBAN LANCAR",
    type: "LIABILITY",
    parentCode: "200.000",
    isSystem: true,
  },
  {
    code: "211.000",
    name: "Hutang Usaha",
    type: "LIABILITY",
    parentCode: "210.000",
    balance: 30000000,
  },
  {
    code: "211.001",
    name: "Hutang Dagang",
    type: "LIABILITY",
    parentCode: "211.000",
    balance: 25000000,
  },
  {
    code: "211.002",
    name: "Hutang Supplier",
    type: "LIABILITY",
    parentCode: "211.000",
    balance: 5000000,
  },
  {
    code: "212.000",
    name: "Hutang Pajak",
    type: "LIABILITY",
    parentCode: "210.000",
    balance: 15000000,
  },
  {
    code: "212.001",
    name: "PPN Keluaran",
    type: "LIABILITY",
    parentCode: "212.000",
    balance: 8000000,
  },
  {
    code: "212.002",
    name: "PPh 21",
    type: "LIABILITY",
    parentCode: "212.000",
    balance: 4000000,
  },
  {
    code: "212.003",
    name: "PPh 25",
    type: "LIABILITY",
    parentCode: "212.000",
    balance: 3000000,
  },
  {
    code: "213.000",
    name: "Hutang Gaji",
    type: "LIABILITY",
    parentCode: "210.000",
    balance: 20000000,
  },

  // Long-term Liabilities (Kewajiban Jangka Panjang)
  {
    code: "220.000",
    name: "KEWAJIBAN JANGKA PANJANG",
    type: "LIABILITY",
    parentCode: "200.000",
    isSystem: true,
  },
  {
    code: "221.000",
    name: "Hutang Bank",
    type: "LIABILITY",
    parentCode: "220.000",
    balance: 100000000,
  },

  // ============================================
  // EQUITY (EKUITAS) - 3xx.xxx
  // ============================================
  {
    code: "300.000",
    name: "EKUITAS",
    type: "EQUITY",
    isSystem: true,
    isControl: true,
  },
  {
    code: "310.000",
    name: "Modal Disetor",
    type: "EQUITY",
    parentCode: "300.000",
    balance: 500000000,
  },
  {
    code: "320.000",
    name: "Laba Ditahan",
    type: "EQUITY",
    parentCode: "300.000",
    balance: 50000000,
  },
  {
    code: "330.000",
    name: "Laba Tahun Berjalan",
    type: "EQUITY",
    parentCode: "300.000",
    balance: 0,
  },

  // ============================================
  // REVENUE (PENDAPATAN) - 4xx.xxx
  // ============================================
  {
    code: "400.000",
    name: "PENDAPATAN",
    type: "REVENUE",
    isSystem: true,
    isControl: true,
  },
  {
    code: "410.000",
    name: "Pendapatan Usaha",
    type: "REVENUE",
    parentCode: "400.000",
  },
  {
    code: "411.000",
    name: "Penjualan",
    type: "REVENUE",
    parentCode: "410.000",
    balance: 150000000,
  },
  {
    code: "412.000",
    name: "Pendapatan Jasa",
    type: "REVENUE",
    parentCode: "410.000",
    balance: 50000000,
  },
  {
    code: "420.000",
    name: "Pendapatan Lain-lain",
    type: "REVENUE",
    parentCode: "400.000",
  },
  {
    code: "421.000",
    name: "Pendapatan Bunga",
    type: "REVENUE",
    parentCode: "420.000",
    balance: 1000000,
  },
  {
    code: "422.000",
    name: "Pendapatan Selisih Kurs",
    type: "REVENUE",
    parentCode: "420.000",
    balance: 500000,
  },

  // ============================================
  // EXPENSES (BEBAN) - 5xx.xxx
  // ============================================
  {
    code: "500.000",
    name: "BEBAN",
    type: "EXPENSE",
    isSystem: true,
    isControl: true,
  },

  // Cost of Goods Sold (Harga Pokok Penjualan)
  {
    code: "510.000",
    name: "Harga Pokok Penjualan",
    type: "EXPENSE",
    parentCode: "500.000",
    isSystem: true,
  },
  {
    code: "511.000",
    name: "Pembelian",
    type: "EXPENSE",
    parentCode: "510.000",
    balance: 80000000,
  },
  {
    code: "512.000",
    name: "Ongkos Kirim Pembelian",
    type: "EXPENSE",
    parentCode: "510.000",
    balance: 5000000,
  },

  // Operating Expenses (Beban Operasional)
  {
    code: "520.000",
    name: "Beban Operasional",
    type: "EXPENSE",
    parentCode: "500.000",
    isSystem: true,
  },
  {
    code: "521.000",
    name: "Beban Gaji",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 30000000,
  },
  {
    code: "522.000",
    name: "Beban Sewa",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 10000000,
  },
  {
    code: "523.000",
    name: "Beban Listrik & Air",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 3000000,
  },
  {
    code: "524.000",
    name: "Beban Telepon & Internet",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 2000000,
  },
  {
    code: "525.000",
    name: "Beban Perlengkapan Kantor",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 1500000,
  },
  {
    code: "526.000",
    name: "Beban Penyusutan",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 10000000,
  },
  {
    code: "527.000",
    name: "Beban Transportasi",
    type: "EXPENSE",
    parentCode: "520.000",
    balance: 5000000,
  },

  // Other Expenses (Beban Lain-lain)
  {
    code: "530.000",
    name: "Beban Lain-lain",
    type: "EXPENSE",
    parentCode: "500.000",
  },
  {
    code: "531.000",
    name: "Beban Bunga",
    type: "EXPENSE",
    parentCode: "530.000",
    balance: 8000000,
  },
  {
    code: "532.000",
    name: "Beban Administrasi Bank",
    type: "EXPENSE",
    parentCode: "530.000",
    balance: 500000,
  },
];
