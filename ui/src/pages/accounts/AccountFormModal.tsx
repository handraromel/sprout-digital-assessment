import { Button } from "@/components/common";
import { Modal } from "@/components/common/Modal";
import { Dropdown, TextField } from "@/components/inputs";
import type { Account, AccountTreeNode } from "@/types";
import { useAccountForm } from "./useAccountForm";

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  account?: Account | null;
  accountTree: AccountTreeNode[];
  onSuccess: (title: string, description: string) => void;
}

export function AccountFormModal({
  isOpen,
  onClose,
  mode,
  account,
  accountTree,
  onSuccess,
}: AccountFormModalProps) {
  const { form, parentOptions, isSubmitting, handleSubmit } = useAccountForm({
    mode,
    account,
    accountTree,
    onSuccess,
    onClose,
    isOpen,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const isCreate = mode === "create";
  const title = isCreate ? "Tambah Akun Baru" : "Edit Akun";
  const submitLabel = isCreate ? "Tambah Jurnal" : "Simpan Perubahan";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Nama Akun"
          placeholder="Contoh : Pemasukan"
          register={register("name")}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Akun Induk"
            options={parentOptions}
            control={control}
            name="parentId"
            placeholder="Pilih akun induk"
            hierarchical
            error={errors.parentId}
          />

          {isCreate ? (
            <TextField
              label="Nomor Akun"
              placeholder="Contoh : 120.000"
              register={register("code")}
              error={"code" in errors ? errors.code : undefined}
            />
          ) : (
            <TextField
              label="Nomor Akun"
              value={account?.code || ""}
              disabled
            />
          )}
        </div>

        <TextField
          label="Saldo"
          placeholder="0"
          control={control}
          name="balance"
          currency={{ symbol: "Rp", position: "prefix" }}
          error={errors.balance}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full justify-center"
        >
          {submitLabel}
        </Button>
      </form>
    </Modal>
  );
}
