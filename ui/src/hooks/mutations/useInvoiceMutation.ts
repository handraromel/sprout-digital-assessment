import { INVOICE_MESSAGES } from "@/constants/invoice";
import { paymentService } from "@/services/invoiceService";
import { useNotificationStore } from "@/stores";
import type { CreatePaymentRequest } from "@/types/invoice";
import { handleMutationError } from "@/utils/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { INVOICE_QUERY_KEYS } from "../queries/useInvoiceQuery";

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEYS.all });
      showSuccess(INVOICE_MESSAGES.PAYMENT_CREATE_SUCCESS);
    },
    onError: (error: unknown) => {
      handleMutationError(
        error,
        showError,
        INVOICE_MESSAGES.PAYMENT_CREATE_ERROR,
      );
    },
  });
};
