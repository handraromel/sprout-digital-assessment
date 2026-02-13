import { INVOICE_STATUS_CONFIG } from "@/constants/invoice";
import type { InvoiceStatus } from "@/types/invoice";

export function getStatusBadgeConfig(status: InvoiceStatus) {
  return INVOICE_STATUS_CONFIG[status] ?? INVOICE_STATUS_CONFIG.UNPAID;
}

export function formatDaysOverdue(daysOverdue: number): string {
  if (daysOverdue <= 0) return "-";
  return `${daysOverdue} hari`;
}

export function formatUmur(daysOverdue: number): {
  text: string;
  color: string;
} {
  if (daysOverdue < 0) {
    // Future due date
    return {
      text: `Jatuh tempo ${Math.abs(daysOverdue)} hari lagi`,
      color: "text-gray-600",
    };
  } else if (daysOverdue === 0) {
    return {
      text: "Jatuh tempo hari ini",
      color: "text-yellow-600",
    };
  } else {
    // Overdue
    return {
      text: `Terlambat ${daysOverdue} hari`,
      color: "text-red-600",
    };
  }
}
