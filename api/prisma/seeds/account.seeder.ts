/**
 * Account Seeder
 * Seeds the Chart of Accounts (Daftar Akun)
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { accountSeedData } from "./account.seed";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export async function seedAccounts(): Promise<void> {
  console.log("🌱 Seeding accounts...");

  const prisma = createPrismaClient();

  // Create a map to store created accounts by code for parent reference
  const accountMap = new Map<string, string>();

  try {
    // Clear existing accounts
    console.log("🧹 Clearing existing accounts...");
    await prisma.account.deleteMany({});
    console.log("✅ Existing accounts cleared");

    // Sort by code to ensure parents are created before children
    const sortedData = [...accountSeedData].sort((a, b) =>
      a.code.localeCompare(b.code),
    );

    for (const data of sortedData) {
      const parentId = data.parentCode ? accountMap.get(data.parentCode) : null;
      const level =
        data.code.split(".")[0].length === 3
          ? 0
          : data.parentCode
            ? accountMap.get(data.parentCode)
              ? data.code.split(".").filter((s) => s !== "000").length
              : 0
            : 0;

      // Calculate level based on parent
      let calculatedLevel = 0;
      if (data.parentCode && accountMap.has(data.parentCode)) {
        const parentCode = data.parentCode;
        const parentLevel =
          parentCode === "100.000" ||
          parentCode === "200.000" ||
          parentCode === "300.000" ||
          parentCode === "400.000" ||
          parentCode === "500.000"
            ? 0
            : parentCode.endsWith("0.000")
              ? 1
              : 2;
        calculatedLevel = parentLevel + 1;
      }

      const account = await prisma.account.upsert({
        where: { code: data.code },
        update: {
          name: data.name,
          type: data.type,
          level: calculatedLevel,
          balance: data.balance ?? 0,
          isSystem: data.isSystem ?? false,
          isControl: data.isControl ?? false,
          parentId: parentId ?? null,
        },
        create: {
          code: data.code,
          name: data.name,
          type: data.type,
          level: calculatedLevel,
          balance: data.balance ?? 0,
          isSystem: data.isSystem ?? false,
          isControl: data.isControl ?? false,
          parentId: parentId ?? null,
        },
      });

      accountMap.set(data.code, account.id);
      console.log(`  ✓ ${data.code} - ${data.name}`);
    }

    console.log(`✅ Seeded ${sortedData.length} accounts`);
  } catch (error) {
    console.error("❌ Account Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  seedAccounts()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error("❌ Account Seeding failed:", e);
      process.exit(1);
    });
}
