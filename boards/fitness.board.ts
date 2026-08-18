import type { BoardConfig, BoardData } from "@/lib/board-types";

function buildAdvicePrompt(data: BoardData): string {
  const sections = Object.entries(data)
    .filter(([, rows]) => rows.length > 0)
    .map(([widgetId, rows]) => `Widget ${widgetId}:\n${JSON.stringify(rows)}`)
    .join("\n\n");

  return [
    "You are a fitness coach. Based on the following workout log data,",
    "give the user concise, practical advice about their training.",
    "",
    sections || "No data has been logged yet.",
  ].join("\n");
}

export const fitnessBoard: BoardConfig = {
  id: "fitness",
  domain: "fitness",
  label: "Fitness",
  widgets: [],
  buildAdvicePrompt,
};
