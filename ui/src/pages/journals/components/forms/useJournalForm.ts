import { JOURNAL_MESSAGES } from "@/constants/journal";
import {
  useCreateJournalMutation,
  usePostJournalMutation,
  useUpdateJournalMutation,
} from "@/hooks/mutations";
import { useAccountTreeQuery, useJournalByIdQuery } from "@/hooks/queries";
import { useModalStore } from "@/stores";
import type {
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
} from "@/types";
import type { CreateJournalFormData } from "@/validations/schemas";
import { createJournalSchema } from "@/validations/schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { flattenAccountTreeForJournal, formatDateForApi } from "../../utils";

const MODAL_ID = {
  SUCCESS: "journal-form-success",
} as const;

interface UseJournalFormOptions {
  mode: "create" | "edit";
}

export function useJournalForm({ mode }: UseJournalFormOptions) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const journalId = params.id || null;

  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  const { isOpen, open, close } = useModalStore();

  const { data: journal, isLoading: isLoadingJournal } =
    useJournalByIdQuery(journalId);
  const { data: accountTree, isLoading: isLoadingAccounts } =
    useAccountTreeQuery();

  const createMutation = useCreateJournalMutation();
  const updateMutation = useUpdateJournalMutation();
  const postMutation = usePostJournalMutation();

  const isCreate = mode === "create";
  const isLoading = isLoadingJournal || isLoadingAccounts;
  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    postMutation.isPending;

  const form = useForm<CreateJournalFormData>({
    // @ts-expect-error yupResolver type compatibility with react-hook-form
    resolver: yupResolver(createJournalSchema),
    defaultValues: {
      date: new Date(),
      invoiceReference: "",
      description: "",
      lines: [{ accountId: "", debit: 0, credit: 0 }],
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  // Cast control to proper form type
  const control =
    form.control as unknown as import("react-hook-form").Control<CreateJournalFormData>;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const lines = useWatch({ control: form.control, name: "lines" });

  // Calculate running totals
  const totals = useMemo(() => {
    const totalDebit = (lines || []).reduce(
      (sum, line) => sum + (Number(line?.debit) || 0),
      0,
    );
    const totalCredit = (lines || []).reduce(
      (sum, line) => sum + (Number(line?.credit) || 0),
      0,
    );
    const difference = Math.abs(totalDebit - totalCredit);
    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    return { totalDebit, totalCredit, difference, isBalanced };
  }, [lines]);

  // Account options for dropdown
  const accountOptions = useMemo(() => {
    if (!accountTree) return [];
    return flattenAccountTreeForJournal(accountTree);
  }, [accountTree]);

  // Reset form when editing an existing journal
  useEffect(() => {
    if (mode === "edit" && journal) {
      form.reset({
        date: new Date(journal.date),
        invoiceReference: journal.invoiceReference || "",
        description: journal.description || "",
        lines: (journal.lines || []).map((line) => ({
          accountId: line.accountId,
          debit: Number(line.debit) || 0,
          credit: Number(line.credit) || 0,
        })),
      });
    }
  }, [journal, mode, form]);

  const addLine = useCallback(() => {
    append({ accountId: "", debit: 0, credit: 0 });
  }, [append]);

  const removeLine = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  const showSuccessModal = useCallback(
    (title: string, description: string) => {
      setSuccessMessage({ title, description });
      open(MODAL_ID.SUCCESS);
    },
    [open],
  );

  const closeSuccessModal = useCallback(() => {
    close(MODAL_ID.SUCCESS);
    navigate("/journals");
  }, [close, navigate]);

  const onSubmit = useCallback(
    async (data: CreateJournalFormData, shouldPost: boolean = false) => {
      try {
        const formattedLines = data.lines.map((line) => ({
          accountId: line.accountId,
          debit: Number(line.debit) || 0,
          credit: Number(line.credit) || 0,
        }));

        if (isCreate) {
          const createData: CreateJournalEntryRequest = {
            date: formatDateForApi(data.date),
            invoiceReference: data.invoiceReference || undefined,
            description: data.description || "",
            lines: formattedLines,
          };

          const response = await createMutation.mutateAsync(createData);

          if (shouldPost && response.data?.id) {
            await postMutation.mutateAsync(response.data.id);
            showSuccessModal(
              JOURNAL_MESSAGES.POST_SUCCESS,
              JOURNAL_MESSAGES.POST_SUCCESS_DESC,
            );
          } else {
            showSuccessModal(
              JOURNAL_MESSAGES.CREATE_SUCCESS,
              JOURNAL_MESSAGES.CREATE_SUCCESS_DESC,
            );
          }
        } else {
          if (!journalId) return;

          const updateData: UpdateJournalEntryRequest = {
            date: formatDateForApi(data.date),
            invoiceReference: data.invoiceReference || undefined,
            description: data.description || "",
            lines: formattedLines,
          };

          await updateMutation.mutateAsync({ id: journalId, data: updateData });

          if (shouldPost) {
            await postMutation.mutateAsync(journalId);
            showSuccessModal(
              JOURNAL_MESSAGES.POST_SUCCESS,
              JOURNAL_MESSAGES.POST_SUCCESS_DESC,
            );
          } else {
            showSuccessModal(
              JOURNAL_MESSAGES.UPDATE_SUCCESS,
              JOURNAL_MESSAGES.UPDATE_SUCCESS_DESC,
            );
          }
        }
      } catch (error) {
        console.error("Failed to save journal:", error);
      }
    },
    [
      isCreate,
      journalId,
      createMutation,
      updateMutation,
      postMutation,
      showSuccessModal,
    ],
  );

  const handleSave = form.handleSubmit((data) =>
    onSubmit(data as unknown as CreateJournalFormData, false),
  );
  const handleSaveAndPost = form.handleSubmit((data) =>
    onSubmit(data as unknown as CreateJournalFormData, true),
  );

  const navigateBack = useCallback(() => {
    navigate("/journals");
  }, [navigate]);

  return {
    form,
    control,
    register,
    errors,
    fields,
    lines,
    totals,
    accountOptions,
    isLoading,
    isSubmitting,
    isCreate,
    journal,
    addLine,
    removeLine,
    handleSave,
    handleSaveAndPost,
    navigateBack,
    isSuccessModalOpen: isOpen(MODAL_ID.SUCCESS),
    successMessage,
    closeSuccessModal,
  };
}
