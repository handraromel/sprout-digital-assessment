import { JOURNAL_MESSAGES } from "@/constants/journal";
import { journalService } from "@/services";
import { useNotificationStore } from "@/stores";
import type {
  CreateJournalEntryRequest,
  ReverseJournalEntryRequest,
  UpdateJournalEntryRequest,
} from "@/types/journal";
import { handleMutationError } from "@/utils/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JOURNAL_QUERY_KEYS } from "../queries/useJournalQuery";

export const useCreateJournalMutation = (suppressNotification = false) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (data: CreateJournalEntryRequest) =>
      journalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
      if (!suppressNotification) {
        showSuccess(JOURNAL_MESSAGES.CREATE_SUCCESS);
      }
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, JOURNAL_MESSAGES.CREATE_ERROR);
    },
  });
};

export const useUpdateJournalMutation = (suppressNotification = false) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateJournalEntryRequest;
    }) => journalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
      if (!suppressNotification) {
        showSuccess(JOURNAL_MESSAGES.UPDATE_SUCCESS);
      }
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, JOURNAL_MESSAGES.UPDATE_ERROR);
    },
  });
};

export const useDeleteJournalMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => journalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
      showSuccess(JOURNAL_MESSAGES.DELETE_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, JOURNAL_MESSAGES.DELETE_ERROR);
    },
  });
};

export const usePostJournalMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => journalService.post(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
      showSuccess(JOURNAL_MESSAGES.POST_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, JOURNAL_MESSAGES.POST_ERROR);
    },
  });
};

export const useReverseJournalMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ReverseJournalEntryRequest;
    }) => journalService.reverse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.all });
      showSuccess(JOURNAL_MESSAGES.REVERSE_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, JOURNAL_MESSAGES.REVERSE_ERROR);
    },
  });
};
