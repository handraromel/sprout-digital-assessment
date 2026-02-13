import { useCreatePaymentMutation } from "@/hooks/mutations/useInvoiceMutation";
import { useAccountTreeQuery } from "@/hooks/queries";
import {
  useCustomersQuery,
  useInvoiceListQuery,
  useInvoiceSummaryQuery,
  useUnpaidInvoicesByCustomerQuery,
} from "@/hooks/queries/useInvoiceQuery";
import { useModalStore } from "@/stores";
import type { AccountTreeNode } from "@/types";
import type { CreatePaymentRequest } from "@/types/invoice";
import {
  createPaymentSchema,
  type CreatePaymentFormData,
} from "@/validations/schemas/invoice.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DISCOUNT_OPTIONS,
  MOCK_CUSTOMERS,
  MODAL_ID,
  type DiscountAccountOption,
} from "./constants";

function flattenAccounts(
  nodes: AccountTreeNode[],
  result: { id: string; code: string; name: string; level: number }[] = [],
): { id: string; code: string; name: string; level: number }[] {
  for (const node of nodes) {
    result.push({
      id: node.id,
      code: node.code,
      name: node.name,
      level: node.level,
    });
    if (node.children?.length) {
      flattenAccounts(node.children, result);
    }
  }
  return result;
}

export function useInvoicesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const { isOpen, open, close } = useModalStore();

  const { data: invoicesData, isLoading: isLoadingInvoices } =
    useInvoiceListQuery();
  const { data: summaryData, isLoading: isLoadingSummary } =
    useInvoiceSummaryQuery();
  const { data: customers } = useCustomersQuery();
  const { data: accountsTree } = useAccountTreeQuery();
  const { data: unpaidInvoices, isLoading: isLoadingUnpaid } =
    useUnpaidInvoicesByCustomerQuery(selectedCustomer);

  const createPaymentMutation = useCreatePaymentMutation();

  const form = useForm<CreatePaymentFormData>({
    resolver: yupResolver(createPaymentSchema),
    defaultValues: {
      paymentDate: new Date(),
      customerName: "",
      depositAccountId: "",
      discountAccountId: null,
      discountPercent: null,
      allocations: [],
    },
  });

  const invoices = useMemo(() => {
    if (!invoicesData?.data) return [];

    if (!searchValue.trim()) return invoicesData.data;

    const searchLower = searchValue.toLowerCase();
    return invoicesData.data.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customerName.toLowerCase().includes(searchLower),
    );
  }, [invoicesData, searchValue]);

  const flatAccounts = useMemo(() => {
    if (!accountsTree) return [];
    return flattenAccounts(accountsTree);
  }, [accountsTree]);

  const accountOptions = useMemo(() => {
    return flatAccounts.map((acc) => ({
      value: acc.id,
      label: `${acc.code} - ${acc.name}`,
    }));
  }, [flatAccounts]);

  const discountAccountOptions: DiscountAccountOption[] = useMemo(() => {
    // Filter accounts with code starting with 701.xxx (discount accounts)
    const discountAccounts = flatAccounts.filter(
      (acc) => acc.code.startsWith("701.") && acc.level > 0,
    );

    return discountAccounts.map((acc) => {
      const mockDiscount = DISCOUNT_OPTIONS[acc.code];
      return {
        value: acc.id,
        label: `${acc.code} - ${acc.name}${mockDiscount ? ` (${mockDiscount.percent}%)` : ""}`,
        code: acc.code,
        percent: mockDiscount?.percent ?? 0,
      };
    });
  }, [flatAccounts]);

  const customerOptions = useMemo(() => {
    // Use MOCK_CUSTOMERS as fallback when no customers from API
    const customerList =
      customers && customers.length > 0 ? customers : [...MOCK_CUSTOMERS];
    return customerList.map((customer) => ({
      value: customer,
      label: customer,
    }));
  }, [customers]);

  const openPaymentModal = useCallback(() => {
    form.reset({
      paymentDate: new Date(),
      customerName: "",
      depositAccountId: "",
      discountAccountId: null,
      discountPercent: null,
      allocations: [],
    });
    setSelectedCustomer(null);
    open(MODAL_ID.PAYMENT);
  }, [open, form]);

  const closePaymentModal = useCallback(() => {
    form.reset();
    setSelectedCustomer(null);
    close(MODAL_ID.PAYMENT);
  }, [close, form]);

  const handleCustomerChange = useCallback(
    (customerName: string) => {
      setSelectedCustomer(customerName);
      form.setValue("customerName", customerName);
      form.setValue("allocations", []);
    },
    [form],
  );

  const handleSubmitPayment = useCallback(
    async (data: CreatePaymentFormData) => {
      const payload: CreatePaymentRequest = {
        paymentDate:
          data.paymentDate instanceof Date
            ? data.paymentDate.toISOString()
            : data.paymentDate,
        customerName: data.customerName,
        depositAccountId: data.depositAccountId,
        discountAccountId: data.discountAccountId || null,
        discountPercent: data.discountPercent || null,
        allocations: data.allocations.map((allocation) => ({
          invoiceId: allocation.invoiceId,
          allocatedAmount: allocation.allocatedAmount,
        })),
      };

      await createPaymentMutation.mutateAsync(payload);
      closePaymentModal();
    },
    [createPaymentMutation, closePaymentModal],
  );

  return {
    invoices,
    summary: summaryData,
    isLoading: isLoadingInvoices || isLoadingSummary,
    searchValue,
    setSearchValue,
    isPaymentModalOpen: isOpen(MODAL_ID.PAYMENT),
    openPaymentModal,
    closePaymentModal,
    form,
    accountOptions,
    discountAccountOptions,
    customerOptions,
    unpaidInvoices: unpaidInvoices ?? [],
    isLoadingUnpaid,
    selectedCustomer,
    handleCustomerChange,
    handleSubmitPayment,
    isSubmitting: createPaymentMutation.isPending,
  };
}

export type InvoicesPageContext = ReturnType<typeof useInvoicesPage>;
