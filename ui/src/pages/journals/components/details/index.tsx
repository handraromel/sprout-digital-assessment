import { Breadcrumb, Button, ConfirmModal } from "@/components/common";
import { JOURNAL_MESSAGES, JOURNAL_STATUS_CONFIG } from "@/constants/journal";
import { useReverseJournalMutation } from "@/hooks/mutations";
import { useJournalByIdQuery } from "@/hooks/queries";
import { useModalStore } from "@/stores";
import type { JournalStatus } from "@/types";
import { formatCurrency } from "@/utils";
import {
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BREADCRUMB_ITEMS } from "../../constants";

const MODAL_ID = {
  REVERSE: "journal-detail-reverse",
  SUCCESS: "journal-detail-success",
} as const;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const StatusBadge = ({ status }: { status: JournalStatus }) => {
  const config = JOURNAL_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
};

export default function JournalDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const journalId = params.id || "";

  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  const { isOpen, open, close } = useModalStore();

  const { data: journal, isLoading, refetch } = useJournalByIdQuery(journalId);
  const reverseMutation = useReverseJournalMutation();

  const navigateBack = useCallback(() => {
    navigate("/journals");
  }, [navigate]);

  const navigateToEdit = useCallback(() => {
    navigate(`/journals/${journalId}/edit`);
  }, [navigate, journalId]);

  const openReverseModal = useCallback(() => {
    open(MODAL_ID.REVERSE);
  }, [open]);

  const closeReverseModal = useCallback(() => {
    close(MODAL_ID.REVERSE);
  }, [close]);

  const showSuccessModal = useCallback(
    (title: string, description: string) => {
      setSuccessMessage({ title, description });
      open(MODAL_ID.SUCCESS);
    },
    [open],
  );

  const closeSuccessModal = useCallback(() => {
    close(MODAL_ID.SUCCESS);
    refetch();
  }, [close, refetch]);

  const handleReverse = async () => {
    try {
      await reverseMutation.mutateAsync({
        id: journalId,
        data: { reason: "Reversal" },
      });
      closeReverseModal();
      showSuccessModal(
        JOURNAL_MESSAGES.REVERSE_SUCCESS,
        JOURNAL_MESSAGES.REVERSE_SUCCESS_DESC,
      );
    } catch (error) {
      console.error("Failed to reverse journal:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
          <div className="space-y-4">
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-64 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="space-y-6">
        <div className="py-12 text-center">
          <p className="text-gray-500">Jurnal tidak ditemukan</p>
          <Button variant="primary" onClick={navigateBack} className="mt-4">
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = journal.status === "DRAFT";
  const canReverse = journal.status === "POSTED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={navigateBack}
              className="mt-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 cursor-pointer text-gray-600" />
            </button>
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Detail Jurnal
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={journal.status} />
            {canEdit && (
              <Button
                variant="secondary"
                onClick={navigateToEdit}
                icon={<PencilSquareIcon className="h-4 w-4" />}
                size="sm"
              >
                Edit
              </Button>
            )}
            {canReverse && (
              <Button
                variant="warning"
                onClick={openReverseModal}
                icon={<ArrowUturnLeftIcon className="h-4 w-4" />}
                size="sm"
              >
                Balik Jurnal
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 ml-9">
          <Breadcrumb items={BREADCRUMB_ITEMS.DETAIL} />
        </div>
      </div>

      {/* Journal Info */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Tanggal</p>
            <p className="font-medium">{formatDate(journal.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">No. Referensi</p>
            <p className="font-mono font-medium">
              {journal.entryNumber || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dibuat pada</p>
            <p className="font-medium">
              {new Date(journal.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>
        {journal.description && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">Keterangan</p>
            <p className="font-medium">{journal.description}</p>
          </div>
        )}
      </div>

      {/* Journal Lines */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="font-semibold text-gray-900">Detail Transaksi</h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="col-span-2 text-sm font-semibold text-gray-700">
            Kode Akun
          </div>
          <div className="col-span-5 text-sm font-semibold text-gray-700">
            Nama Akun
          </div>
          <div className="col-span-2 text-right text-sm font-semibold text-gray-700">
            Debit
          </div>
          <div className="col-span-2 text-right text-sm font-semibold text-gray-700">
            Kredit
          </div>
          <div className="col-span-1" />
        </div>

        {/* Lines */}
        <div className="divide-y divide-gray-100">
          {(journal.lines || []).map((line) => (
            <div
              key={line.id}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4"
            >
              <div className="col-span-2 font-mono text-sm text-gray-600">
                {line.accountCode || "-"}
              </div>
              <div className="col-span-5">{line.accountName || "-"}</div>
              <div className="col-span-2 text-right font-mono">
                {Number(line.debit) > 0 ? formatCurrency(line.debit) : "-"}
              </div>
              <div className="col-span-2 text-right font-mono">
                {Number(line.credit) > 0 ? formatCurrency(line.credit) : "-"}
              </div>
              <div className="col-span-1" />
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t-2 border-gray-200 bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 text-right font-semibold text-gray-700">
              Total :
            </div>
            <div className="col-span-2 text-right font-mono font-bold text-gray-900">
              {formatCurrency(journal.totalDebit)}
            </div>
            <div className="col-span-2 text-right font-mono font-bold text-gray-900">
              {formatCurrency(journal.totalCredit)}
            </div>
            <div className="col-span-1" />
          </div>
        </div>
      </div>

      {/* Reversal Info */}
      {journal.reversedFrom && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Catatan:</span> Jurnal ini merupakan
            jurnal balik dari{" "}
            <span className="font-mono font-medium">
              {journal.reversedFrom.entryNumber}
            </span>
          </p>
        </div>
      )}

      {journal.reversedBy && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <span className="font-medium">Catatan:</span> Jurnal ini telah
            dibatalkan dengan jurnal balik{" "}
            <span className="font-mono font-medium">
              {journal.reversedBy.entryNumber}
            </span>
          </p>
        </div>
      )}

      {/* Reverse Confirmation Modal */}
      <ConfirmModal
        isOpen={isOpen(MODAL_ID.REVERSE)}
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
        isOpen={isOpen(MODAL_ID.SUCCESS)}
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
