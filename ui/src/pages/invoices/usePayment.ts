import type { Invoice } from "@/types/invoice";
import { useCallback, useMemo, useState } from "react";

export interface PaymentAllocation {
  invoiceId: string;
  allocatedAmount: number;
}

interface UsePaymentOptions {
  unpaidInvoices: Invoice[];
}

export function usePayment({ unpaidInvoices }: UsePaymentOptions) {
  const [allocations, setAllocations] = useState<PaymentAllocation[]>([]);

  const toggleInvoice = useCallback((invoice: Invoice, checked: boolean) => {
    if (checked) {
      const maxAmount = parseFloat(invoice.remainingBalance);
      setAllocations((prev) => {
        if (prev.some((a) => a.invoiceId === invoice.id)) {
          return prev;
        }
        return [...prev, { invoiceId: invoice.id, allocatedAmount: maxAmount }];
      });
    } else {
      setAllocations((prev) => prev.filter((a) => a.invoiceId !== invoice.id));
    }
  }, []);

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const newAllocations = unpaidInvoices.map((invoice) => ({
          invoiceId: invoice.id,
          allocatedAmount: parseFloat(invoice.remainingBalance),
        }));
        setAllocations(newAllocations);
      } else {
        setAllocations([]);
      }
    },
    [unpaidInvoices],
  );

  const updateAllocationAmount = useCallback(
    (invoiceId: string, amount: number) => {
      setAllocations((prev) =>
        prev.map((a) =>
          a.invoiceId === invoiceId ? { ...a, allocatedAmount: amount } : a,
        ),
      );
    },
    [],
  );

  const removeAllocation = useCallback((invoiceId: string) => {
    setAllocations((prev) => prev.filter((a) => a.invoiceId !== invoiceId));
  }, []);

  const resetAllocations = useCallback(() => {
    setAllocations([]);
  }, []);

  const totalAllocated = useMemo(
    () => allocations.reduce((sum, a) => sum + a.allocatedAmount, 0),
    [allocations],
  );

  const getInvoiceStatus = useCallback(
    (invoiceId: string): "LUNAS" | "BELUM LUNAS" | null => {
      const invoice = unpaidInvoices.find((i) => i.id === invoiceId);
      if (!invoice) return null;

      const allocation = allocations.find((a) => a.invoiceId === invoiceId);
      if (!allocation) return null;

      const remainingBalance = parseFloat(invoice.remainingBalance);
      return allocation.allocatedAmount >= remainingBalance
        ? "LUNAS"
        : "BELUM LUNAS";
    },
    [unpaidInvoices, allocations],
  );

  const isInvoiceSelected = useCallback(
    (invoiceId: string) => allocations.some((a) => a.invoiceId === invoiceId),
    [allocations],
  );

  const getAllocationAmount = useCallback(
    (invoiceId: string) => {
      const allocation = allocations.find((a) => a.invoiceId === invoiceId);
      return allocation?.allocatedAmount ?? 0;
    },
    [allocations],
  );

  const isAllSelected = useMemo(
    () =>
      unpaidInvoices.length > 0 &&
      unpaidInvoices.every((invoice) => isInvoiceSelected(invoice.id)),
    [unpaidInvoices, isInvoiceSelected],
  );

  return {
    allocations,
    totalAllocated,
    isAllSelected,
    toggleInvoice,
    toggleSelectAll,
    updateAllocationAmount,
    removeAllocation,
    resetAllocations,
    getInvoiceStatus,
    isInvoiceSelected,
    getAllocationAmount,
  };
}
