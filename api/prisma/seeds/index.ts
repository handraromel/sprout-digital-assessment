/**
 * Main Seed Runner
 * Orchestrates database seeding for all modules
 *
 * Usage:
 *   npx ts-node prisma/seeds/index.ts           # Run all seeds
 *   npx ts-node prisma/seeds/index.ts account   # Run specific module
 */

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { seedAccounts } from "./account.seeder";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedModule = "account" | "all";

const seeders: Record<Exclude<SeedModule, "all">, () => Promise<void>> = {
  account: seedAccounts,
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const module = (args[0] as SeedModule) || "all";

  console.log("🚀 Starting database seeding...\n");

  if (module === "all") {
    // Run all seeders in order
    for (const [name, seeder] of Object.entries(seeders)) {
      console.log(`\n📦 Running ${name} seeder...`);
      await seeder();
    }
  } else if (module in seeders) {
    console.log(`📦 Running ${module} seeder...`);
    await seeders[module]();
  } else {
    console.error(`❌ Unknown module: ${module}`);
    console.log(`Available modules: ${Object.keys(seeders).join(", ")}, all`);
    process.exit(1);
  }

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
