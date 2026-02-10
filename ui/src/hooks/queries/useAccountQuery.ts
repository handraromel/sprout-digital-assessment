import { ACCOUNT_MESSAGES } from "@/constants/account";
import { accountService } from "@/services";
import { useNotificationStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export const ACCOUNT_QUERY_KEYS = {
  all: ["accounts"] as const,
  tree: ["accounts", "tree"] as const,
  detail: (id: string) => ["accounts", id] as const,
};

export const useAccountTreeQuery = () => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.tree,
    queryFn: () => accountService.getTree(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
    meta: {
      onError: () => {
        showError(ACCOUNT_MESSAGES.FETCH_ERROR);
      },
    },
  });
};

export const useAccountByIdQuery = (id: string | null) => {
  const { showError } = useNotificationStore();

  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.detail(id || ""),
    queryFn: () => accountService.getById(id!),
    select: (response) => response.data,
    enabled: !!id,
    meta: {
      onError: () => {
        showError(ACCOUNT_MESSAGES.FETCH_ERROR);
      },
    },
  });
};
