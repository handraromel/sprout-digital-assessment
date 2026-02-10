import { useAccountTreeQuery } from "@/hooks/queries";
import { useModalStore } from "@/stores";
import type { Account, AccountTreeNode } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { MODAL_ID } from "./constants";

export function useAccountsPage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  const { isOpen, open, close } = useModalStore();

  const { data: accountTree, isLoading, refetch } = useAccountTreeQuery();

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!accountTree) return;

    const getAllIds = (nodes: AccountTreeNode[]): string[] => {
      const ids: string[] = [];
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          ids.push(node.id);
          ids.push(...getAllIds(node.children));
        }
      }
      return ids;
    };

    setExpandedIds(new Set(getAllIds(accountTree)));
  }, [accountTree]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const filteredTree = useMemo(() => {
    if (!accountTree || !searchValue.trim()) return accountTree || [];

    const searchLower = searchValue.toLowerCase();

    const filterNodes = (nodes: AccountTreeNode[]): AccountTreeNode[] => {
      return nodes
        .map((node) => {
          const matchesSelf =
            node.code.toLowerCase().includes(searchLower) ||
            node.name.toLowerCase().includes(searchLower);
          const filteredChildren = filterNodes(node.children || []);

          if (matchesSelf || filteredChildren.length > 0) {
            return {
              ...node,
              children: matchesSelf ? node.children : filteredChildren,
            };
          }
          return null;
        })
        .filter((node): node is AccountTreeNode => node !== null);
    };

    return filterNodes(accountTree);
  }, [accountTree, searchValue]);

  const openAddModal = useCallback(() => {
    setSelectedAccount(null);
    open(MODAL_ID.ADD);
  }, [open]);

  const closeAddModal = useCallback(() => {
    close(MODAL_ID.ADD);
  }, [close]);

  const openEditModal = useCallback(
    (account: Account) => {
      setSelectedAccount(account);
      open(MODAL_ID.EDIT);
    },
    [open],
  );

  const closeEditModal = useCallback(() => {
    setSelectedAccount(null);
    close(MODAL_ID.EDIT);
  }, [close]);

  const openDeleteModal = useCallback(
    (account: Account) => {
      setSelectedAccount(account);
      open(MODAL_ID.DELETE);
    },
    [open],
  );

  const closeDeleteModal = useCallback(() => {
    setSelectedAccount(null);
    close(MODAL_ID.DELETE);
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

  return {
    accountTree: filteredTree,
    fullAccountTree: accountTree || [],
    isLoading,
    expandedIds,
    toggleExpand,
    expandAll,
    collapseAll,
    searchValue,
    setSearchValue,
    isAddModalOpen: isOpen(MODAL_ID.ADD),
    openAddModal,
    closeAddModal,
    isEditModalOpen: isOpen(MODAL_ID.EDIT),
    openEditModal,
    closeEditModal,
    isDeleteModalOpen: isOpen(MODAL_ID.DELETE),
    openDeleteModal,
    closeDeleteModal,
    isSuccessModalOpen: isOpen(MODAL_ID.SUCCESS),
    successMessage,
    showSuccessModal,
    closeSuccessModal,
    selectedAccount,
    refetch,
  };
}
