import { Card } from "@/components/common";
import type { InvoiceSummary } from "@/types/invoice";
import { formatCurrency } from "@/utils";
import { BanknotesIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

interface SummaryCardsProps {
  summary?: InvoiceSummary;
  isLoading?: boolean;
}

export const SummaryCards = ({ summary, isLoading }: SummaryCardsProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <BanknotesIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Piutang</p>
            <p className="text-xl font-semibold text-gray-900">
              {isLoading ? (
                <span className="inline-block h-6 w-32 animate-pulse rounded bg-gray-200" />
              ) : (
                formatCurrency(summary?.totalPiutang ?? "0")
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-red-100 p-3">
            <CalendarDaysIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Jatuh Tempo</p>
            <p className="text-xl font-semibold text-gray-900">
              {isLoading ? (
                <span className="inline-block h-6 w-32 animate-pulse rounded bg-gray-200" />
              ) : (
                formatCurrency(summary?.totalJatuhTempo ?? "0")
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
