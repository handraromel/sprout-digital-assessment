import { JOURNAL_MESSAGES } from "@/constants/journal";
import { journalService } from "@/services";
import { useNotificationStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export const JOURNAL_QUERY_KEYS = {
  all: ["journals"] as const,
  list: (params?: { search?: string; status?: string }) =>
    ["journals", "list", params] as const,
  detail: (id: string) => ["journals", id] as const,
};

export const useJournalListQuery = (params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.list(params),
    queryFn: () => journalService.getAll(params),
    select: (response) => ({
      data: response.data,
      pagination: response.pagination,
    }),
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        showError(JOURNAL_MESSAGES.FETCH_ERROR);
      },
    },
  });
};

export const useJournalByIdQuery = (id: string | null) => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: JOURNAL_QUERY_KEYS.detail(id || ""),
    queryFn: () => journalService.getById(id!),
    select: (response) => response.data,
    enabled: !!id,
    meta: {
      onError: () => {
        showError(JOURNAL_MESSAGES.FETCH_ERROR);
      },
    },
  });
};
