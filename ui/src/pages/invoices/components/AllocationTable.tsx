import type { Invoice } from "@/types/invoice";
import { formatCurrency, parseCurrencyInput } from "@/utils";
import { formatDate } from "@/utils/date";
import { CheckIcon, InboxIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface PaymentAllocation {
  invoiceId: string;
  allocatedAmount: number;
}

interface AllocationTableProps {
  unpaidInvoices: Invoice[];
  allocations: PaymentAllocation[];
  isLoading: boolean;
  selectedCustomer: string | null;
  onToggleInvoice: (invoice: Invoice, checked: boolean) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onUpdateAmount: (invoiceId: string, amount: number) => void;
  onRemoveAllocation: (invoiceId: string) => void;
}

export const AllocationTable = ({
  unpaidInvoices,
  allocations,
  isLoading,
  selectedCustomer,
  onToggleInvoice,
  onToggleSelectAll,
  onUpdateAmount,
  onRemoveAllocation,
}: AllocationTableProps) => {
  const isInvoiceSelected = (invoiceId: string) =>
    allocations.some((a) => a.invoiceId === invoiceId);

  const getAllocationAmount = (invoiceId: string) => {
    const allocation = allocations.find((a) => a.invoiceId === invoiceId);
    return allocation?.allocatedAmount ?? 0;
  };

  const isAllSelected =
    unpaidInvoices.length > 0 &&
    unpaidInvoices.every((invoice) => isInvoiceSelected(invoice.id));

  const getInvoiceStatus = (invoice: Invoice) => {
    const allocation = allocations.find((a) => a.invoiceId === invoice.id);
    if (!allocation) return null;

    const remainingBalance = parseFloat(invoice.remainingBalance);
    const isPaid = allocation.allocatedAmount >= remainingBalance;

    return isPaid ? "LUNAS" : "BELUM LUNAS";
  };

  if (!selectedCustomer) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 py-16 text-gray-400">
        <InboxIcon className="mb-3 h-12 w-12" />
        <p className="text-sm">Pilih pelanggan terlebih dahulu</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (unpaidInvoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 py-16 text-gray-400">
        <InboxIcon className="mb-3 h-12 w-12" />
        <p className="text-sm">Tidak ada tagihan belum lunas</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-12 bg-gray-100 px-4 py-3 text-left">
              <div
                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border ${
                  isAllSelected
                    ? "border-green-500 bg-green-500"
                    : "border-gray-400 bg-white"
                }`}
                onClick={() => onToggleSelectAll(!isAllSelected)}
              >
                {isAllSelected && <CheckIcon className="h-4 w-4 text-white" />}
              </div>
            </th>
            <th className="bg-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-700">
              Faktur
            </th>
            <th className="bg-gray-100 px-4 py-3 text-right text-sm font-medium text-gray-700">
              Sisa Tagihan
            </th>
            <th className="bg-gray-100 px-4 py-3 text-right text-sm font-medium text-gray-700">
              Alokasi Pembayaran
            </th>
          </tr>
        </thead>
        <tbody>
          {unpaidInvoices.map((invoice) => {
            const isSelected = isInvoiceSelected(invoice.id);
            const maxAmount = parseFloat(invoice.remainingBalance);
            const status = getInvoiceStatus(invoice);

            return (
              <tr key={invoice.id} className="border-b border-gray-200">
                <td className="bg-white px-4 py-3">
                  <div
                    className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border ${
                      isSelected
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => onToggleInvoice(invoice, !isSelected)}
                  >
                    {isSelected && <CheckIcon className="h-4 w-4 text-white" />}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {invoice.invoiceNumber} ({formatDate(invoice.dueDate)})
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">
                  {formatCurrency(invoice.remainingBalance)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={
                          isSelected
                            ? formatCurrency(
                                getAllocationAmount(invoice.id).toString(),
                              )
                            : "Rp 0"
                        }
                        onChange={(e) => {
                          if (!isSelected) {
                            onToggleInvoice(invoice, true);
                          }
                          const parsed = parseCurrencyInput(e.target.value);
                          const amount = Math.min(
                            Math.max(0, parsed),
                            maxAmount,
                          );
                          onUpdateAmount(invoice.id, amount);
                        }}
                        className={`w-36 rounded border px-3 py-1.5 text-right text-sm ${
                          isSelected
                            ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            : "border-gray-300"
                        } focus:outline-none`}
                      />
                    </div>
                    {isSelected && status && (
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          status === "LUNAS" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {status}
                        {status === "LUNAS" ? (
                          <CheckIcon className="h-3 w-3" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => onRemoveAllocation(invoice.id)}
                            className="hover:text-red-800"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
