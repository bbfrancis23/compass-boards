import { findWidgetRows, type BoardConfig, type BoardData } from "@/lib/board-types";

function formatCurrency(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function buildAdvicePrompt(data: BoardData): string {
  const accounts = findWidgetRows(data, "account-balances");
  const transactions = findWidgetRows(data, "transaction-input");

  if (accounts.length === 0 && transactions.length === 0) {
    return [
      "You are a personal finance advisor for the user's Compass Boards financial dashboard.",
      "The user hasn't logged any account balances or transactions yet.",
      "In 2-3 sentences, encourage them to add their first account balance and a few recent",
      "transactions, and briefly explain what kind of advice you'll be able to give once they",
      "do (spending patterns, savings rate, net worth trends).",
    ].join(" ");
  }

  const today = new Date().toISOString().slice(0, 10);

  const accountsSection = accounts.length
    ? `## Account Balances (current)\n${accounts
        .map((a) => `- ${a.name}: ${formatCurrency(a.balance)}`)
        .join("\n")}`
    : "## Account Balances\nNone logged yet.";

  const transactionsSection = transactions.length
    ? `## Transactions (${transactions.length} logged)\n${transactions
        .map((t) => `- ${t.date}: ${t.category} — ${t.merchant} — ${formatCurrency(t.amount)}`)
        .join("\n")}`
    : "## Transactions\nNone logged yet.";

  return [
    "You are a personal finance advisor reviewing a user's Compass Boards financial dashboard.",
    `Today's date is ${today}.`,
    "",
    accountsSection,
    "",
    transactionsSection,
    "",
    "Instructions:",
    "- Ground every recommendation in the specific numbers above (cite actual dollar amounts,",
    "  account names, categories, or dates) — do not give generic advice that could apply to",
    "  anyone.",
    "- Calculate and mention concrete figures where useful: total income vs. spending, spending",
    "  by category, an emergency fund runway in months, or net worth.",
    "- Prioritize the 2-4 most impactful, specific actions this user should take next, not an",
    "  exhaustive checklist.",
    "- If the data looks incomplete (e.g. very few transactions, missing categories like rent or",
    "  insurance), say so explicitly rather than assuming the picture is complete.",
    "- Keep it concise — a few short paragraphs or a tight bulleted list, not an exhaustive",
    "  financial plan.",
  ].join("\n");
}

export const financialBoard: BoardConfig = {
  id: "financial",
  domain: "financial",
  label: "Financial",
  widgets: [],
  buildAdvicePrompt,
};
