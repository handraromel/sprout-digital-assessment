/**
 * Invoice Seeder
 * Seeds the Penagihan (A/R Management) invoices
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { Decimal } from "@prisma/client/runtime/client";
import { PrismaClient } from "../../generated/prisma/client";
import { invoiceSeedData } from "./invoice.seed";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export async function seedInvoices(): Promise<void> {
  console.log("🌱 Seeding invoices...");

  const prisma = createPrismaClient();

  try {
    console.log("🧹 Clearing existing payment allocations...");
    await prisma.paymentAllocation.deleteMany({});
    console.log("✅ Existing payment allocations cleared");

    console.log("🧹 Clearing existing payments...");
    await prisma.payment.deleteMany({});
    console.log("✅ Existing payments cleared");

    console.log("🧹 Clearing existing invoices...");
    await prisma.invoice.deleteMany({});
    console.log("✅ Existing invoices cleared");

    console.log("📝 Creating invoices...");

    for (const data of invoiceSeedData) {
      await prisma.invoice.create({
        data: {
          invoiceNumber: data.invoiceNumber,
          customerName: data.customerName,
          date: data.date,
          dueDate: data.dueDate,
          totalAmount: new Decimal(data.totalAmount),
          remainingBalance: new Decimal(data.remainingBalance),
          status: data.status,
        },
      });
    }

    console.log(`✅ Created ${invoiceSeedData.length} invoices`);

    const statusCounts = await prisma.invoice.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    console.log("📊 Invoice status breakdown:");
    for (const item of statusCounts) {
      console.log(`   - ${item.status}: ${item._count.status}`);
    }
  } catch (error) {
    console.error("❌ Error seeding invoices:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
