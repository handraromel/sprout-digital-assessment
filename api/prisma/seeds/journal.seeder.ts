/**
 * Journal Entry Seeder
 * Seeds the Jurnal Umum (General Journal) entries
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { Decimal } from "@prisma/client/runtime/client";
import { PrismaClient } from "../../generated/prisma/client";
import { journalSeedData } from "./journal.seed";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export async function seedJournals(): Promise<void> {
  console.log("🌱 Seeding journal entries...");

  const prisma = createPrismaClient();

  try {
    console.log("🧹 Clearing existing journal entries...");
    await prisma.journalEntryLine.deleteMany({});
    await prisma.journalEntry.deleteMany({});
    console.log("✅ Existing journal entries cleared");

    const accountMap = new Map<string, string>();
    const accounts = await prisma.account.findMany({
      select: { id: true, code: true },
    });
    for (const account of accounts) {
      accountMap.set(account.code, account.id);
    }

    for (const data of journalSeedData) {
      let totalDebit = new Decimal(0);
      let totalCredit = new Decimal(0);

      for (const line of data.lines) {
        totalDebit = totalDebit.add(new Decimal(line.debit));
        totalCredit = totalCredit.add(new Decimal(line.credit));
      }

      const linesData = data.lines.map((line) => {
        const accountId = accountMap.get(line.accountCode);
        if (!accountId) {
          throw new Error(`Account not found for code: ${line.accountCode}`);
        }
        return {
          accountId,
          debit: new Decimal(line.debit),
          credit: new Decimal(line.credit),
        };
      });

      await prisma.journalEntry.create({
        data: {
          entryNumber: data.entryNumber,
          date: data.date,
          description: data.description,
          invoiceReference: data.invoiceReference ?? null,
          status: data.status,
          totalDebit,
          totalCredit,
          reversalReason: data.reversalReason ?? null,
          lines: {
            create: linesData,
          },
        },
      });

      console.log(`  ✓ ${data.entryNumber}: ${data.description}`);
    }

    console.log(`✅ Seeded ${journalSeedData.length} journal entries`);
  } finally {
    await prisma.$disconnect();
  }
}
