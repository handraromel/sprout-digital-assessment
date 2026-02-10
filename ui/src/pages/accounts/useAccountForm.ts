import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from "@/hooks/mutations";
import type { Account, AccountTreeNode, AccountType } from "@/types";
import type {
  CreateAccountFormData,
  UpdateAccountFormData,
} from "@/validations/schemas";
import {
  createAccountSchema,
  updateAccountSchema,
} from "@/validations/schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { flattenAccountTreeForDropdown } from "./utils";

interface UseAccountFormProps {
  mode: "create" | "edit";
  account?: Account | null;
  accountTree: AccountTreeNode[];
  onSuccess: (title: string, description: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function useAccountForm({
  mode,
  account,
  accountTree,
  onSuccess,
  onClose,
  isOpen,
}: UseAccountFormProps) {
  const createMutation = useCreateAccountMutation();
  const updateMutation = useUpdateAccountMutation();

  const isCreate = mode === "create";
  const schema = isCreate ? createAccountSchema : updateAccountSchema;

  const form = useForm<CreateAccountFormData | UpdateAccountFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: isCreate ? "" : undefined,
      parentId: "",
      balance: 0,
    },
  });

  const { reset, setValue, control } = form;
  const parentId = useWatch({ control, name: "parentId" });

  // Track previous isOpen state to detect close
  const prevIsOpen = useRef(isOpen);

  // Reset form when modal closes
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      reset({
        name: "",
        code: isCreate ? "" : undefined,
        parentId: "",
        balance: 0,
      });
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, reset, isCreate]);

  useEffect(() => {
    if (account && mode === "edit") {
      reset({
        name: account.name,
        parentId: account.parentId || "",
        balance: parseFloat(account.balance) || 0,
      });
    } else if (mode === "create" && isOpen) {
      reset({
        name: "",
        code: "",
        parentId: "",
        balance: 0,
      });
    }
  }, [account, mode, reset, isOpen]);

  const parentOptions = useMemo(() => {
    return flattenAccountTreeForDropdown(accountTree);
  }, [accountTree]);

  // Find parent account to determine type and suggest code
  const selectedParent = useMemo(() => {
    if (!parentId) return null;

    const findAccount = (nodes: AccountTreeNode[]): AccountTreeNode | null => {
      for (const node of nodes) {
        if (node.id === parentId) return node;
        if (node.children) {
          const found = findAccount(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findAccount(accountTree);
  }, [parentId, accountTree]);

  const inferredType: AccountType | null = selectedParent?.type || null;

  const handleSubmit = useCallback(
    async (data: CreateAccountFormData | UpdateAccountFormData) => {
      if (isCreate) {
        const createData = data as CreateAccountFormData;
        if (!inferredType) return;

        await createMutation.mutateAsync({
          code: createData.code,
          name: createData.name,
          type: inferredType,
          parentId: createData.parentId || null,
          balance: createData.balance || 0,
        });

        onSuccess(
          "Berhasil Tambah Akun Baru",
          "Akun baru berhasil ditambahkan!",
        );
        onClose();
      } else {
        if (!account) return;

        const updateData = data as UpdateAccountFormData;
        await updateMutation.mutateAsync({
          id: account.id,
          data: {
            name: updateData.name,
            parentId: updateData.parentId || null,
            balance: updateData.balance || 0,
          },
        });

        onSuccess("Berhasil Update Akun", "Akun berhasil diperbarui!");
        onClose();
      }
    },
    [
      isCreate,
      inferredType,
      createMutation,
      updateMutation,
      account,
      onSuccess,
      onClose,
    ],
  );

  return {
    form,
    parentOptions,
    selectedParent,
    inferredType,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit: form.handleSubmit(handleSubmit),
    setValue,
  };
}
