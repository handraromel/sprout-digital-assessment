-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_number" VARCHAR(30) NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,
    "remaining_balance" DECIMAL(18,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "payment_number" VARCHAR(30) NOT NULL,
    "payment_date" DATE NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,
    "discount_percent" DECIMAL(5,2),
    "discount_amount" DECIMAL(18,2),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deposit_account_id" TEXT NOT NULL,
    "discount_account_id" TEXT,
    "journal_entry_id" TEXT,
    "created_by_id" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "id" TEXT NOT NULL,
    "allocated_amount" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "payment_id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_invoice_number_idx" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_customer_name_idx" ON "invoices"("customer_name");

-- CreateIndex
CREATE INDEX "invoices_due_date_idx" ON "invoices"("due_date");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_created_by_id_idx" ON "invoices"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_number_key" ON "payments"("payment_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_journal_entry_id_key" ON "payments"("journal_entry_id");

-- CreateIndex
CREATE INDEX "payments_payment_number_idx" ON "payments"("payment_number");

-- CreateIndex
CREATE INDEX "payments_customer_name_idx" ON "payments"("customer_name");

-- CreateIndex
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");

-- CreateIndex
CREATE INDEX "payments_deposit_account_id_idx" ON "payments"("deposit_account_id");

-- CreateIndex
CREATE INDEX "payments_created_by_id_idx" ON "payments"("created_by_id");

-- CreateIndex
CREATE INDEX "payment_allocations_payment_id_idx" ON "payment_allocations"("payment_id");

-- CreateIndex
CREATE INDEX "payment_allocations_invoice_id_idx" ON "payment_allocations"("invoice_id");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_deposit_account_id_fkey" FOREIGN KEY ("deposit_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_discount_account_id_fkey" FOREIGN KEY ("discount_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
