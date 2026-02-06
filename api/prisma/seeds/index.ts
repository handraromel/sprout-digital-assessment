/**
 * Main Seed Runner
 * Orchestrates database seeding for all modules
 *
 * Usage:
 *   npx ts-node prisma/seeds/index.ts           # Run all seeds
 *   npx ts-node prisma/seeds/index.ts account   # Run specific module
 */

import "dotenv/config";
import { seedAccounts } from "./account.seeder";

type SeedModule = "account" | "all";

const seeders: Record<Exclude<SeedModule, "all">, () => Promise<void>> = {
  account: seedAccounts,
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const module = (args[0] as SeedModule) || "all";

  console.log("🚀 Starting database seeding...\n");
  console.log(`Module: ${module}\n`);

  try {
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
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
