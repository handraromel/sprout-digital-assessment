import { ACCOUNT_MESSAGES } from "@/constants/account";
import { accountService } from "@/services";
import { useNotificationStore } from "@/stores";
import type {
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types/account";
import { handleMutationError } from "@/utils/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEYS } from "../queries/useAccountQuery";

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.tree });
      showSuccess(ACCOUNT_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, ACCOUNT_MESSAGES.CREATE_ERROR);
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.tree });
      showSuccess(ACCOUNT_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, ACCOUNT_MESSAGES.UPDATE_ERROR);
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.tree });
      showSuccess(ACCOUNT_MESSAGES.DELETE_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(error, showError, ACCOUNT_MESSAGES.DELETE_ERROR);
    },
  });
};
