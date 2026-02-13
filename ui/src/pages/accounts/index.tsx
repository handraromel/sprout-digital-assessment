import { ConfirmModal, TreeTable } from "@/components/common";
import { ACCOUNT_MESSAGES } from "@/constants/account";
import { useDeleteAccountMutation } from "@/hooks/mutations";
import type { AccountTreeNode, TreeTableColumn } from "@/types";
import { formatCurrency } from "@/utils";
import {
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { AccountFormModal } from "./components/forms/AccountFormModal";
import { useAccountsPage } from "./useAccountsPage";

// Recursively calculate total balance of a node and all its children
function calculateTotalBalance(node: AccountTreeNode): number {
  const ownBalance = Number(node.balance) || 0;
  const childrenBalance = (node.children || []).reduce(
    (sum, child) => sum + calculateTotalBalance(child),
    0,
  );
  return ownBalance + childrenBalance;
}

const LEVEL_STYLES: Record<number, string> = {
  0: "bg-white font-bold text-sm",
  1: "bg-purple-50/60 font-semibold text-sm",
};

export default function AccountsPage() {
  const {
    accountTree,
    fullAccountTree,
    isLoading,
    expandedIds,
    toggleExpand,
    searchValue,
    setSearchValue,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    isSuccessModalOpen,
    successMessage,
    showSuccessModal,
    closeSuccessModal,
    selectedAccount,
    // Infinite scroll props
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
  } = useAccountsPage();

  const deleteMutation = useDeleteAccountMutation();

  const handleDelete = async () => {
    if (!selectedAccount) return;

    await deleteMutation.mutateAsync(selectedAccount.id);
    closeDeleteModal();
    showSuccessModal(
      ACCOUNT_MESSAGES.DELETE_SUCCESS,
      ACCOUNT_MESSAGES.DELETE_SUCCESS_DESC,
    );
  };

  // Pre-calculate total balances for each node
  const balanceMap = useMemo(() => {
    const map = new Map<string, number>();
    const traverse = (nodes: AccountTreeNode[]) => {
      for (const node of nodes) {
        map.set(node.id, calculateTotalBalance(node));
        if (node.children) traverse(node.children);
      }
    };
    traverse(accountTree);
    return map;
  }, [accountTree]);

  const columns: TreeTableColumn<AccountTreeNode>[] = useMemo(
    () => [
      {
        id: "code",
        width: "140px",
        cell: (row) => (
          <span className="font-mono text-gray-600">{row.code}</span>
        ),
      },
      {
        id: "name",
        cell: (row, level) => (
          <span
            className={level <= 1 ? "tracking-wide uppercase" : ""}
            style={{ paddingLeft: `${level * 24}px`, display: "inline-block" }}
          >
            {row.name}
          </span>
        ),
      },
      {
        id: "balance",
        align: "right",
        cell: (row, level) => {
          const hasChildren = (row.children?.length || 0) > 0;
          const totalBalance = balanceMap.get(row.id) || 0;
          const isExpanded = expandedIds.has(row.id);

          if (hasChildren) {
            if (level === 0) {
              return (
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Total Saldo :
                  </span>
                  <span
                    className={`text-base font-bold ${
                      totalBalance < 0 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {formatCurrency(totalBalance)}
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      isExpanded ? "" : "-rotate-90"
                    }`}
                  />
                </div>
              );
            }
            return (
              <div className="flex items-center justify-end gap-2">
                <span
                  className={`text-sm ${
                    totalBalance < 0 ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {formatCurrency(totalBalance)}
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isExpanded ? "" : "-rotate-90"
                  }`}
                />
              </div>
            );
          }
          return (
            <span
              className={`mr-5 text-sm ${
                Number(row.balance) < 0 ? "text-red-500" : "text-gray-600"
              }`}
            >
              {formatCurrency(row.balance)}
            </span>
          );
        },
      },
    ],
    [balanceMap, expandedIds],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-foreground mb-6 text-2xl font-bold">Daftar Akun</h1>

      <TreeTable<AccountTreeNode>
        data={accountTree}
        columns={columns}
        getRowId={(row) => row.id}
        getChildren={(row) => row.children || []}
        getRowLevel={(row) => row.level}
        expandedIds={expandedIds}
        onToggleExpand={toggleExpand}
        levelStyles={LEVEL_STYLES}
        isLoading={isLoading}
        emptyMessage="Tidak ada data akun"
        showSearch
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari akun..."
        searchClassName="flex-1"
        onAdd={openAddModal}
        addButtonLabel="Tambah Akun Baru"
        isSystemRow={(row) => row.isSystem || row.isControl}
        inlineActions={[
          {
            icon: <PencilSquareIcon className="h-4 w-4" />,
            label: "Edit",
            colorClass: "hover:bg-gray-200 text-gray-600",
            onClick: (row) => openEditModal(row),
          },
          {
            icon: <TrashIcon className="h-4 w-4" />,
            label: "Hapus",
            colorClass: "hover:bg-red-100 text-red-500",
            onClick: (row) => openDeleteModal(row),
          },
        ]}
        inlineActionsColumnIndex={1}
      />

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm">Memuat lebih banyak...</span>
          </div>
        )}
        {!hasNextPage && !isLoading && accountTree.length > 0 && (
          <span className="text-sm text-gray-400">Semua data telah dimuat</span>
        )}
      </div>

      <AccountFormModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        mode="create"
        accountTree={fullAccountTree}
        onSuccess={showSuccessModal}
      />

      <AccountFormModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        mode="edit"
        account={selectedAccount}
        accountTree={fullAccountTree}
        onSuccess={showSuccessModal}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={ACCOUNT_MESSAGES.DELETE_CONFIRM_TITLE}
        description={ACCOUNT_MESSAGES.DELETE_CONFIRM_DESC}
        variant="danger"
        confirmText="Hapus"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        showIcon
        buttonLayout="vertical"
      />

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
