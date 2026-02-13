import { Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { DatePicker, Dropdown } from "@/components/inputs";
import type { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/utils";
import type { CreatePaymentFormData } from "@/validations/schemas/invoice.schema";
import type { UseFormReturn } from "react-hook-form";
import type { DiscountAccountOption } from "../constants";
import { AllocationTable } from "./AllocationTable";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<CreatePaymentFormData>;
  customerOptions: { value: string; label: string }[];
  accountOptions: { value: string; label: string }[];
  discountAccountOptions: DiscountAccountOption[];
  unpaidInvoices: Invoice[];
  isLoadingUnpaid: boolean;
  selectedCustomer: string | null;
  onCustomerChange: (customerName: string) => void;
  onSubmit: (data: CreatePaymentFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  form,
  customerOptions,
  accountOptions,
  discountAccountOptions,
  unpaidInvoices,
  isLoadingUnpaid,
  selectedCustomer,
  onCustomerChange,
  onSubmit,
  isSubmitting,
}: PaymentModalProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const allocations = watch("allocations") || [];
  const discountPercent = watch("discountPercent") || 0;

  const handleDiscountChange = (discountAccountId: string) => {
    if (discountAccountId) {
      setValue("discountAccountId", discountAccountId);
      // Find the selected discount option to get its percent
      const selectedDiscount = discountAccountOptions.find(
        (opt) => opt.value === discountAccountId,
      );
      if (selectedDiscount) {
        setValue("discountPercent", selectedDiscount.percent, {
          shouldValidate: true,
        });
      }
    } else {
      setValue("discountAccountId", null);
      setValue("discountPercent", null, { shouldValidate: true });
    }
  };

  const toggleInvoice = (invoice: Invoice, checked: boolean) => {
    const currentAllocations = [...allocations];

    if (checked) {
      const remainingBalance = parseFloat(invoice.remainingBalance);
      currentAllocations.push({
        invoiceId: invoice.id,
        allocatedAmount: remainingBalance,
      });
    } else {
      const idx = currentAllocations.findIndex(
        (a) => a.invoiceId === invoice.id,
      );
      if (idx >= 0) {
        currentAllocations.splice(idx, 1);
      }
    }

    setValue("allocations", currentAllocations, { shouldValidate: true });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newAllocations = unpaidInvoices.map((invoice) => ({
        invoiceId: invoice.id,
        allocatedAmount: parseFloat(invoice.remainingBalance),
      }));
      setValue("allocations", newAllocations, { shouldValidate: true });
    } else {
      setValue("allocations", [], { shouldValidate: true });
    }
  };

  const updateAllocationAmount = (invoiceId: string, amount: number) => {
    const currentAllocations = [...allocations];
    const idx = currentAllocations.findIndex((a) => a.invoiceId === invoiceId);
    if (idx >= 0) {
      currentAllocations[idx].allocatedAmount = amount;
      setValue("allocations", currentAllocations, { shouldValidate: true });
    }
  };

  const removeAllocation = (invoiceId: string) => {
    const currentAllocations = allocations.filter(
      (a) => a.invoiceId !== invoiceId,
    );
    setValue("allocations", currentAllocations, { shouldValidate: true });
  };

  const totalAllocated = allocations.reduce(
    (sum, a) => sum + (a.allocatedAmount || 0),
    0,
  );

  // Total remaining balance for SELECTED invoices only
  const isInvoiceSelected = (invoiceId: string) =>
    allocations.some((a) => a.invoiceId === invoiceId);

  const selectedInvoicesRemainingTotal = unpaidInvoices
    .filter((invoice) => isInvoiceSelected(invoice.id))
    .reduce((sum, invoice) => sum + parseFloat(invoice.remainingBalance), 0);

  // Sisa Alokasi = Total Allocated - Total Remaining for selected invoices
  const sisaAlokasi = totalAllocated - selectedInvoicesRemainingTotal;

  const formatSisaAlokasi = (amount: number) => {
    if (amount >= 0) {
      return `+${formatCurrency(amount.toString())}`;
    }
    return `-${formatCurrency(Math.abs(amount).toString())}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pembayaran Pelanggan"
      size="5xl"
      stickyHeader
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nama Pelanggan - Full Width */}
        <Dropdown
          control={control}
          name="customerName"
          label="Nama Pelanggan"
          options={customerOptions}
          placeholder="Pilih pelanggan"
          error={errors.customerName}
          onChange={(value: string) => onCustomerChange(value)}
          required
          hierarchical
        />

        {/* Row 2: Tanggal Pembayaran | Setor ke Akun | Diskon */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DatePicker
            control={control}
            name="paymentDate"
            label="Tanggal Pembayaran"
            error={errors.paymentDate}
            required
          />

          <Dropdown
            control={control}
            name="depositAccountId"
            label="Setor ke Akun"
            options={accountOptions}
            placeholder="Pilih akun"
            error={errors.depositAccountId}
            required
            hierarchical
          />

          <Dropdown
            control={control}
            name="discountAccountId"
            label="Diskon"
            options={discountAccountOptions}
            placeholder="Pilih diskon"
            error={errors.discountAccountId}
            onChange={(value: string) => handleDiscountChange(value)}
            hierarchical
          />
        </div>

        {/* Alokasi Pembayaran Section */}
        <div>
          <h4 className="mb-3 font-medium text-gray-900">Alokasi Pembayaran</h4>

          <AllocationTable
            unpaidInvoices={unpaidInvoices}
            allocations={allocations}
            isLoading={isLoadingUnpaid}
            selectedCustomer={selectedCustomer}
            onToggleInvoice={toggleInvoice}
            onToggleSelectAll={toggleSelectAll}
            onUpdateAmount={updateAllocationAmount}
            onRemoveAllocation={removeAllocation}
          />

          {errors.allocations && (
            <p className="mt-2 text-sm text-red-600">
              {errors.allocations.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Summary row */}
          <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
            <div className="flex flex-wrap gap-6">
              <div>
                <span className="text-gray-500">Diskon</span>{" "}
                <span className="font-medium">{discountPercent || 0}%</span>
              </div>
              <div>
                <span className="text-gray-500">Total Dialokasikan</span>{" "}
                <span className="font-medium">
                  {formatCurrency(totalAllocated.toString())}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Sisa Alokasi</span>{" "}
                <span
                  className={`font-medium ${sisaAlokasi < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatSisaAlokasi(sisaAlokasi)}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons row */}
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 justify-center"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || allocations.length === 0}
              className="flex-1 justify-center"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Pembayaran"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
