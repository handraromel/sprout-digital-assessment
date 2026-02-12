import { ConfirmModal, DataTable } from "@/components/common";
import { useDataTable } from "@/components/common/DataTable";
import {
  JOURNAL_CONFIG,
  JOURNAL_MESSAGES,
  JOURNAL_STATUS_CONFIG,
} from "@/constants/journal";
import {
  useDeleteJournalMutation,
  useReverseJournalMutation,
} from "@/hooks/mutations";
import type { JournalEntry, JournalStatus } from "@/types";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date";
import {
  ArrowUturnLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useJournalsPage } from "./useJournalsPage";

const StatusBadge = ({ status }: { status: JournalStatus }) => {
  const config = JOURNAL_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
};

export default function JournalsPage() {
  const {
    journals,
    isLoading,
    setSearchValue,
    selectedJournal,
    navigateToCreate,
    navigateToEdit,
    navigateToDetail,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    isReverseModalOpen,
    openReverseModal,
    closeReverseModal,
    isSuccessModalOpen,
    successMessage,
    showSuccessModal,
    closeSuccessModal,
  } = useJournalsPage();

  const deleteMutation = useDeleteJournalMutation();
  const reverseMutation = useReverseJournalMutation();

  const columns: ColumnDef<JournalEntry, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: ({ row }) => formatDate(row.original.date),
        enableSorting: true,
      },
      {
        accessorKey: "entryNumber",
        header: "No. Jurnal",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.entryNumber}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "description",
        header: "Keterangan",
        cell: ({ row }) => (
          <span className="text-gray-600">
            {row.original.description || "-"}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "totalDebit",
        header: "Total Debit",
        cell: ({ row }) => (
          <span className="text-right font-mono">
            {formatCurrency(row.original.totalDebit)}
          </span>
        ),
        meta: { align: "right" as const },
        enableSorting: true,
      },
      {
        accessorKey: "totalCredit",
        header: "Total Kredit",
        cell: ({ row }) => (
          <span className="text-right font-mono">
            {formatCurrency(row.original.totalCredit)}
          </span>
        ),
        meta: { align: "right" as const },
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        enableSorting: true,
      },
    ],
    [],
  );

  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data: journals,
    columns,
    initialPageSize: JOURNAL_CONFIG.PAGE_SIZE,
  });

  // Sync external search with internal
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setGlobalFilter(value);
  };

  const handleDelete = async () => {
    if (!selectedJournal) return;

    await deleteMutation.mutateAsync(selectedJournal.id);
    closeDeleteModal();
    showSuccessModal(
      JOURNAL_MESSAGES.DELETE_SUCCESS,
      JOURNAL_MESSAGES.DELETE_SUCCESS_DESC,
    );
  };

  const handleReverse = async () => {
    if (!selectedJournal) return;

    await reverseMutation.mutateAsync({
      id: selectedJournal.id,
      data: { reason: "Reversal" },
    });
    closeReverseModal();
    showSuccessModal(
      JOURNAL_MESSAGES.REVERSE_SUCCESS,
      JOURNAL_MESSAGES.REVERSE_SUCCESS_DESC,
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-foreground mb-6 text-2xl font-bold">
        {JOURNAL_MESSAGES.PAGE_TITLE}
      </h1>

      <DataTable<JournalEntry>
        table={table}
        columns={columns}
        isLoading={isLoading}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleSearchChange}
        emptyMessage={JOURNAL_MESSAGES.EMPTY}
        searchPlaceholder="Cari jurnal..."
        showSearch
        showPagination
        onAdd={navigateToCreate}
        addButtonLabel={JOURNAL_MESSAGES.ADD_NEW}
        actionsConfig={{
          header: "Aksi",
          align: "center",
          actions: [
            {
              type: "view",
              icon: <EyeIcon className="h-4 w-4" />,
              label: "Lihat Detail",
              colorClass: "hover:bg-gray-200 text-gray-600",
              onClick: (row) => navigateToDetail(row),
            },
            {
              type: "edit",
              icon: <PencilSquareIcon className="h-4 w-4" />,
              label: "Edit",
              colorClass: "hover:bg-gray-200 text-gray-600",
              enabled: (row) => row.status === "DRAFT",
              onClick: (row) => navigateToEdit(row),
            },
            {
              type: "delete",
              icon: <TrashIcon className="h-4 w-4" />,
              label: "Hapus",
              colorClass: "hover:bg-red-100 text-red-500",
              enabled: (row) => row.status === "DRAFT",
              onClick: (row) => openDeleteModal(row),
            },
            {
              type: "custom",
              icon: <ArrowUturnLeftIcon className="h-4 w-4" />,
              label: "Balik",
              colorClass: "hover:bg-amber-100 text-amber-600",
              enabled: (row) => row.status === "POSTED",
              onClick: (row) => openReverseModal(row),
            },
          ],
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={JOURNAL_MESSAGES.DELETE_CONFIRM_TITLE}
        description={JOURNAL_MESSAGES.DELETE_CONFIRM_DESC}
        variant="danger"
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={deleteMutation.isPending}
        showIcon
        buttonLayout="vertical"
      />

      {/* Reverse Confirmation Modal */}
      <ConfirmModal
        isOpen={isReverseModalOpen}
        onClose={closeReverseModal}
        onConfirm={handleReverse}
        title={JOURNAL_MESSAGES.REVERSE_CONFIRM_TITLE}
        description={JOURNAL_MESSAGES.REVERSE_CONFIRM_DESC}
        variant="warning"
        confirmText="Balik Jurnal"
        cancelText="Batal"
        isLoading={reverseMutation.isPending}
        showIcon
        buttonLayout="vertical"
      />

      {/* Success Modal */}
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onConfirm={closeSuccessModal}
        title={successMessage.title}
        description={successMessage.description}
        variant="success"
        confirmText="Kembali"
        showIcon
        buttonLayout="vertical"
        hideCancel
      />
    </div>
  );
}
