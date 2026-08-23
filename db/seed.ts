import { config } from "dotenv";
config({ path: ".env.local" });

// Not importing db/client.ts here: it imports "server-only", which throws
// when loaded outside a Next.js server context (this script runs standalone
// via tsx). Build a plain client instead.
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { seedFinancialDemo, seedFitnessDemo } from "../lib/demo-seed";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required (e.g. file:./local.db for local dev)");
}

if (!process.env.SEED_OWNER_GITHUB_ID) {
  throw new Error(
    "SEED_OWNER_GITHUB_ID is required — the numeric GitHub user id to own the seeded boards " +
      "(matches session.user.id once signed in). Find it at https://api.github.com/users/<login>.",
  );
}
const ownerUserId: string = process.env.SEED_OWNER_GITHUB_ID;

const db = drizzle(
  createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  }),
);

async function main() {
  await seedFinancialDemo(db, ownerUserId);
  await seedFitnessDemo(db, ownerUserId);
  console.log("Seeded mock Financial and Fitness data.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
