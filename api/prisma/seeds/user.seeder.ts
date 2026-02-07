/**
 * User Seeder
 * Seeds the initial administrator user
 */
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { userSeedData } from "./user.seed";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export async function seedUsers(): Promise<void> {
  console.log("🌱 Seeding users...");

  const prisma = createPrismaClient();

  try {
    // Clear existing users (optional - comment out if you want to keep existing users)
    console.log("🧹 Clearing existing users...");
    await prisma.user.deleteMany({});
    console.log("✅ Existing users cleared");

    for (const data of userSeedData) {
      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      const user = await prisma.user.upsert({
        where: { email: data.email },
        update: {
          username: data.username,
          password: hashedPassword,
          fullname: data.fullname ?? null,
          isActive: data.isActive,
        },
        create: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          fullname: data.fullname ?? null,
          isActive: data.isActive,
        },
      });

      console.log(`  ✓ ${user.email} - ${user.fullname || user.username}`);
    }

    console.log(`✅ Seeded ${userSeedData.length} user(s)`);
  } catch (error) {
    console.error("❌ User Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error("❌ User Seeding failed:", e);
      process.exit(1);
    });
}
