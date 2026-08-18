import type { BoardConfig, BoardData } from "@/lib/board-types";

function buildAdvicePrompt(data: BoardData): string {
  const sections = Object.entries(data)
    .filter(([, rows]) => rows.length > 0)
    .map(([widgetId, rows]) => `Widget ${widgetId}:\n${JSON.stringify(rows)}`)
    .join("\n\n");

  return [
    "You are a personal finance advisor. Based on the following account",
    "balance and transaction data, give the user concise, practical advice",
    "about their finances.",
    "",
    sections || "No data has been logged yet.",
  ].join("\n");
}

export const financialBoard: BoardConfig = {
  id: "financial",
  domain: "financial",
  label: "Financial",
  widgets: [],
  buildAdvicePrompt,
};
