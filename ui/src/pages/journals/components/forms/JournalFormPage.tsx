import { Breadcrumb, Button, ConfirmModal } from "@/components/common";
import { DatePicker, Dropdown, TextField } from "@/components/inputs";
import { INVOICE_OPTIONS } from "@/constants/journal";
import { formatCurrency } from "@/utils";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BREADCRUMB_ITEMS } from "../../constants";
import { useJournalForm } from "./useJournalForm";

interface JournalFormPageProps {
  mode: "create" | "edit";
}

export default function JournalFormPage({ mode }: JournalFormPageProps) {
  const {
    control,
    register,
    errors,
    fields,
    totals,
    accountOptions,
    isLoading,
    isSubmitting,
    isCreate,
    addLine,
    removeLine,
    handleSave,
    handleSaveAndPost,
    navigateBack,
    isSuccessModalOpen,
    successMessage,
    closeSuccessModal,
  } = useJournalForm({ mode });

  const breadcrumbItems = isCreate
    ? BREADCRUMB_ITEMS.CREATE
    : BREADCRUMB_ITEMS.EDIT;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
          <div className="space-y-4">
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-64 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-4">
          <button
            type="button"
            onClick={navigateBack}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 cursor-pointer text-gray-600" />
          </button>
          <h1 className="text-foreground text-2xl font-bold">
            {isCreate ? "Tambah Jurnal" : "Edit Jurnal"}
          </h1>
        </div>
        <div className="ml-14">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <form className="space-y-6">
        {/* Top Section - Date, Invoice, Description */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {/* Date Picker - Full Width */}
          <DatePicker
            name="date"
            control={control}
            label="Tanggal Jatuh Tempo"
            required
            error={errors.date}
          />

          {/* Invoice Number Dropdown - Full Width */}
          <div className="mt-4">
            <Dropdown
              label="Pilih Invoice"
              options={INVOICE_OPTIONS}
              control={control}
              name="invoiceReference"
              placeholder="Pilih Invoice"
              error={errors.invoiceReference}
            />
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="text-foreground mb-2 block text-sm font-medium">
              <span className="mr-0.5 text-red-500">*</span>
              Deskripsi
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Masukkan keterangan jurnal"
              className="border-input-border bg-input-background text-input-text placeholder:text-foreground-muted focus:border-input-border-focus focus:ring-input-border-focus/30 w-full rounded-lg border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            />
            {errors.description && (
              <p className="text-error mt-1 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Table Header */}
          <div className="my-3 grid grid-cols-12 gap-4">
            <div className="col-span-5 text-sm font-medium text-gray-600">
              Akun
            </div>
            <div className="col-span-3 text-sm font-medium text-gray-600">
              Debit
            </div>
            <div className="col-span-3 text-sm font-medium text-gray-600">
              Kredit
            </div>
            <div className="col-span-1" />
          </div>

          {/* Journal Lines */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-1">
                <div className="grid grid-cols-12 items-center gap-4">
                  {/* Account Dropdown */}
                  <div className="col-span-5">
                    <Dropdown
                      options={accountOptions}
                      control={control}
                      name={`lines.${index}.accountId`}
                      placeholder="Pilih Akun"
                      hierarchical
                      small
                      hideErrorMessage
                    />
                  </div>

                  {/* Debit Field */}
                  <div className="col-span-3">
                    <TextField
                      control={control}
                      name={`lines.${index}.debit`}
                      placeholder="0"
                      currency={{ symbol: "Rp", position: "prefix" }}
                      small
                    />
                  </div>

                  {/* Credit Field */}
                  <div className="col-span-3">
                    <TextField
                      control={control}
                      name={`lines.${index}.credit`}
                      placeholder="0"
                      currency={{ symbol: "Rp", position: "prefix" }}
                      small
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={fields.length <= 1}
                      className={`rounded p-1.5 transition-colors ${
                        fields.length <= 1
                          ? "cursor-not-allowed text-gray-300"
                          : "text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Line Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={addLine}
              className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
            >
              <span className="text-lg">+</span> Tambah Baris
            </button>
          </div>

          {/* Totals Section */}
          <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end gap-4">
                <span className="text-sm text-gray-600">Total Debit :</span>
                <span className="w-32 font-semibold text-red-600">
                  {formatCurrency(totals.totalDebit)}
                </span>
              </div>
              <div className="flex items-center justify-end gap-4">
                <span className="text-sm text-gray-600">Total Kredit :</span>
                <span className="w-32 font-semibold">
                  {formatCurrency(totals.totalCredit)}
                </span>
              </div>
              {!totals.isBalanced && totals.totalDebit > 0 && (
                <div className="flex items-center justify-end gap-4 text-amber-600">
                  <span className="text-sm">Selisih :</span>
                  <span className="w-32 font-semibold">
                    {formatCurrency(totals.difference)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Validation Errors Section */}
          {(errors.lines?.message ||
            errors.lines?.root?.message ||
            Object.keys(errors).length > 0) && (
            <div className="mt-4 rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Mohon perbaiki kesalahan berikut:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
                {errors.date && <li>{errors.date.message}</li>}
                {errors.description && <li>{errors.description.message}</li>}
                {errors.lines?.message && <li>{errors.lines.message}</li>}
                {errors.lines?.root?.message && (
                  <li>{errors.lines.root.message}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="min-w-32 border border-gray-300"
          >
            Simpan Draft
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={handleSaveAndPost}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="min-w-32"
          >
            Tambah Jurnal
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onConfirm={closeSuccessModal}
        title={successMessage.title}
        description={successMessage.description}
        variant="success"
        confirmText="Kembali"
        showIcon
        buttonLayout="vertical"
        hideCancel
      />
    </div>
  );
}
