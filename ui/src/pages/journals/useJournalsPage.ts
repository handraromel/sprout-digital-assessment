import { useJournalListQuery } from "@/hooks/queries";
import { useModalStore } from "@/stores";
import type { JournalEntry } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MODAL_ID } from "./constants";

export function useJournalsPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  const { isOpen, open, close } = useModalStore();

  const { data: journalsData, isLoading, refetch } = useJournalListQuery();

  const journals = useMemo(() => {
    if (!journalsData?.data) return [];

    if (!searchValue.trim()) return journalsData.data;

    const searchLower = searchValue.toLowerCase();
    return journalsData.data.filter(
      (journal) =>
        journal.entryNumber.toLowerCase().includes(searchLower) ||
        journal.description?.toLowerCase().includes(searchLower),
    );
  }, [journalsData, searchValue]);

  const navigateToCreate = useCallback(() => {
    navigate("/journals/new");
  }, [navigate]);

  const navigateToEdit = useCallback(
    (journal: JournalEntry) => {
      navigate(`/journals/${journal.id}/edit`);
    },
    [navigate],
  );

  const navigateToDetail = useCallback(
    (journal: JournalEntry) => {
      navigate(`/journals/${journal.id}`);
    },
    [navigate],
  );

  const openDeleteModal = useCallback(
    (journal: JournalEntry) => {
      setSelectedJournal(journal);
      open(MODAL_ID.DELETE);
    },
    [open],
  );

  const closeDeleteModal = useCallback(() => {
    setSelectedJournal(null);
    close(MODAL_ID.DELETE);
  }, [close]);

  const openReverseModal = useCallback(
    (journal: JournalEntry) => {
      setSelectedJournal(journal);
      open(MODAL_ID.REVERSE);
    },
    [open],
  );

  const closeReverseModal = useCallback(() => {
    setSelectedJournal(null);
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

  return {
    journals,
    isLoading,
    searchValue,
    setSearchValue,
    selectedJournal,
    navigateToCreate,
    navigateToEdit,
    navigateToDetail,
    isDeleteModalOpen: isOpen(MODAL_ID.DELETE),
    openDeleteModal,
    closeDeleteModal,
    isReverseModalOpen: isOpen(MODAL_ID.REVERSE),
    openReverseModal,
    closeReverseModal,
    isSuccessModalOpen: isOpen(MODAL_ID.SUCCESS),
    successMessage,
    showSuccessModal,
    closeSuccessModal,
    refetch,
  };
}
