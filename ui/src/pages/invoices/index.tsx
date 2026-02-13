import { DataTable } from "@/components/common";
import { useDataTable } from "@/components/common/DataTable";
import { INVOICE_CONFIG } from "@/constants/invoice";
import type { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { PaymentModal, SummaryCards } from "./components";
import { useInvoicesPage } from "./useInvoicesPage";
import { formatUmur } from "./utils";

export default function InvoicesPage() {
  const {
    invoices,
    summary,
    isLoading,
    searchValue,
    setSearchValue,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
    form,
    accountOptions,
    discountAccountOptions,
    customerOptions,
    unpaidInvoices,
    isLoadingUnpaid,
    selectedCustomer,
    handleCustomerChange,
    handleSubmitPayment,
    isSubmitting,
  } = useInvoicesPage();

  const columns: ColumnDef<Invoice, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Pelanggan",
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.customerName}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "invoiceNumber",
        header: "Nomor Faktur",
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.original.invoiceNumber}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "dueDate",
        header: "Tanggal Jatuh Tempo",
        cell: ({ row }) => formatDate(row.original.dueDate),
        enableSorting: true,
      },
      {
        accessorKey: "daysOverdue",
        header: "Umur",
        cell: ({ row }) => {
          const days = row.original.daysOverdue;
          const { text, color } = formatUmur(days);
          return <span className={`text-sm ${color}`}>{text}</span>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "remainingBalance",
        header: "Sisa Tagihan",
        cell: ({ row }) => (
          <span className="text-right font-mono">
            {formatCurrency(row.original.remainingBalance)}
          </span>
        ),
        meta: { align: "right" as const },
        enableSorting: true,
      },
    ],
    [],
  );

  const { table, setGlobalFilter } = useDataTable({
    data: invoices,
    columns,
    initialPageSize: INVOICE_CONFIG.PAGINATION.DEFAULT_LIMIT,
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setGlobalFilter(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Penagihan</h1>
        <p className="text-sm text-gray-500">
          Kelola tagihan dan catat pembayaran pelanggan
        </p>
      </div>

      <SummaryCards summary={summary} isLoading={isLoading} />

      <DataTable<Invoice>
        table={table}
        columns={columns}
        isLoading={isLoading}
        globalFilter={searchValue}
        onGlobalFilterChange={handleSearchChange}
        searchPlaceholder="Cari invoice atau pelanggan..."
        emptyMessage="Tidak ada data penagihan"
        onAdd={openPaymentModal}
        addButtonLabel="Catat Pembayaran"
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        form={form}
        customerOptions={customerOptions}
        accountOptions={accountOptions}
        discountAccountOptions={discountAccountOptions}
        unpaidInvoices={unpaidInvoices}
        isLoadingUnpaid={isLoadingUnpaid}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
        onSubmit={handleSubmitPayment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
