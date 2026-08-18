import { config } from "dotenv";
config({ path: ".env.local" });

// Not importing db/client.ts here: it imports "server-only", which throws
// when loaded outside a Next.js server context (this script runs standalone
// via tsx). Build a plain client instead.
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { boards, widgetData, widgetInstances } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required (e.g. file:./local.db for local dev)");
}

const db = drizzle(
  createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  }),
);

const DAY_MS = 24 * 60 * 60 * 1000;
// YYYY-MM-DD, matching what an <input type="date"> field submits (see
// InputFieldType "date" in lib/form-widget.tsx), so seeded rows use the same
// date format as rows a user adds through the form.
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString().slice(0, 10);

async function seedFinancial() {
  await db
    .insert(boards)
    .values({ id: "financial", domain: "financial", label: "Financial" })
    .onConflictDoNothing();

  const [accountsWidget] = await db
    .insert(widgetInstances)
    .values({
      boardId: "financial",
      type: "account-balances",
      x: 0,
      y: 0,
      w: 4,
      h: 3,
      config: {
        title: "Add Account Balance",
        disclaimer: "Mock data only — not connected to any real bank account.",
        submitLabel: "Add",
        fields: [
          { key: "name", label: "Account name", type: "text", required: true },
          { key: "balance", label: "Balance", type: "number", required: true },
        ],
      },
    })
    .returning();

  const [transactionInputWidget] = await db
    .insert(widgetInstances)
    .values({
      boardId: "financial",
      type: "transaction-input",
      x: 0,
      y: 3,
      w: 4,
      h: 3,
      config: {
        title: "Add Transaction",
        disclaimer: "Mock data only — not connected to any real bank account.",
        submitLabel: "Add",
        fields: [
          { key: "category", label: "Category", type: "text", required: true },
          { key: "merchant", label: "Merchant", type: "text", required: true },
          { key: "amount", label: "Amount", type: "number", required: true },
          { key: "date", label: "Date", type: "date", required: true },
        ],
      },
    })
    .returning();

  await db.insert(widgetInstances).values({
    boardId: "financial",
    type: "net-worth-chart",
    x: 4,
    y: 0,
    w: 8,
    h: 3,
    config: {
      title: "Net Worth",
      dataKey: "name",
      series: [{ name: "balance", label: "Balance" }],
      sourceWidgetId: String(accountsWidget.id),
    },
  });

  await db.insert(widgetInstances).values({
    boardId: "financial",
    type: "spending-chart",
    x: 4,
    y: 3,
    w: 8,
    h: 3,
    config: {
      title: "Spending",
      dataKey: "date",
      series: [{ name: "amount", label: "Amount" }],
      sourceWidgetId: String(transactionInputWidget.id),
    },
  });

  await db.insert(widgetData).values([
    { widgetInstanceId: accountsWidget.id, data: { name: "Checking", balance: 4250.32 } },
    { widgetInstanceId: accountsWidget.id, data: { name: "Savings", balance: 12800.0 } },
    { widgetInstanceId: accountsWidget.id, data: { name: "Credit Card", balance: -1240.55 } },
    { widgetInstanceId: accountsWidget.id, data: { name: "Investment", balance: 28430.1 } },
  ]);

  const transactions = [
    { category: "Income", merchant: "Paycheck", amount: 3200.0, daysAgo: 28 },
    { category: "Rent", merchant: "Landlord", amount: -1600.0, daysAgo: 27 },
    { category: "Groceries", merchant: "Trader Joe's", amount: -84.12, daysAgo: 25 },
    { category: "Dining", merchant: "Ramen House", amount: -22.5, daysAgo: 24 },
    { category: "Transport", merchant: "Shell Gas", amount: -41.3, daysAgo: 22 },
    { category: "Entertainment", merchant: "Netflix", amount: -15.49, daysAgo: 20 },
    { category: "Groceries", merchant: "Whole Foods", amount: -63.77, daysAgo: 18 },
    { category: "Utilities", merchant: "PG&E", amount: -110.2, daysAgo: 16 },
    { category: "Dining", merchant: "Corner Cafe", amount: -18.4, daysAgo: 14 },
    { category: "Transport", merchant: "Uber", amount: -27.85, daysAgo: 12 },
    { category: "Groceries", merchant: "Safeway", amount: -71.03, daysAgo: 9 },
    { category: "Entertainment", merchant: "AMC Theatres", amount: -32.0, daysAgo: 7 },
    { category: "Dining", merchant: "Pizza Place", amount: -29.6, daysAgo: 5 },
    { category: "Transport", merchant: "Shell Gas", amount: -38.9, daysAgo: 3 },
    { category: "Groceries", merchant: "Trader Joe's", amount: -76.44, daysAgo: 1 },
  ];

  await db.insert(widgetData).values(
    transactions.map((t) => ({
      widgetInstanceId: transactionInputWidget.id,
      data: {
        category: t.category,
        merchant: t.merchant,
        amount: t.amount,
        date: daysAgo(t.daysAgo),
      },
    })),
  );

  await db.insert(widgetInstances).values({
    boardId: "financial",
    type: "advice",
    x: 0,
    y: 6,
    w: 12,
    h: 4,
  });
}

async function seedFitness() {
  await db
    .insert(boards)
    .values({ id: "fitness", domain: "fitness", label: "Fitness" })
    .onConflictDoNothing();

  const [workoutLogWidget] = await db
    .insert(widgetInstances)
    .values({
      boardId: "fitness",
      type: "workout-log",
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      config: {
        title: "Log Workout",
        submitLabel: "Add",
        fields: [
          { key: "type", label: "Type", type: "text", required: true },
          { key: "durationMin", label: "Duration (min)", type: "number", required: true },
          { key: "calories", label: "Calories", type: "number", required: true },
          { key: "distanceMi", label: "Distance (mi)", type: "number" },
          { key: "date", label: "Date", type: "date", required: true },
        ],
      },
    })
    .returning();

  await db.insert(widgetInstances).values({
    boardId: "fitness",
    type: "progress-chart",
    x: 6,
    y: 0,
    w: 6,
    h: 4,
    config: {
      title: "Progress",
      dataKey: "date",
      series: [{ name: "calories", label: "Calories Burned" }],
      sourceWidgetId: String(workoutLogWidget.id),
    },
  });

  const workouts = [
    { type: "Run", durationMin: 32, calories: 340, distanceMi: 3.5, daysAgo: 20 },
    { type: "Strength", durationMin: 50, calories: 280, daysAgo: 18 },
    { type: "Yoga", durationMin: 40, calories: 150, daysAgo: 16 },
    { type: "Run", durationMin: 28, calories: 300, distanceMi: 3.0, daysAgo: 14 },
    { type: "Cycling", durationMin: 45, calories: 400, distanceMi: 12.0, daysAgo: 12 },
    { type: "Strength", durationMin: 55, calories: 310, daysAgo: 10 },
    { type: "Run", durationMin: 35, calories: 380, distanceMi: 4.0, daysAgo: 8 },
    { type: "Yoga", durationMin: 40, calories: 150, daysAgo: 6 },
    { type: "Strength", durationMin: 60, calories: 330, daysAgo: 4 },
    { type: "Run", durationMin: 30, calories: 320, distanceMi: 3.3, daysAgo: 2 },
  ];

  await db.insert(widgetData).values(
    workouts.map(({ daysAgo: workoutDaysAgo, ...rest }) => ({
      widgetInstanceId: workoutLogWidget.id,
      data: { ...rest, date: daysAgo(workoutDaysAgo) },
    })),
  );

  await db.insert(widgetInstances).values({
    boardId: "fitness",
    type: "advice",
    x: 0,
    y: 4,
    w: 12,
    h: 4,
  });
}

async function main() {
  await seedFinancial();
  await seedFitness();
  console.log("Seeded mock Financial and Fitness data.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
