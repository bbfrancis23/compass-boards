export type BoardKey = "financial" | "fitness" | "habits" | "focus";

export interface BoardPreview {
  title: string;
  chips: string[];
  insight: string;
}

export const BOARD_PREVIEWS: Record<BoardKey, BoardPreview> = {
  financial: {
    title: "Financial",
    chips: ["Balances (input)", "Net worth chart (output)"],
    insight:
      "Dining spend is up 18% this month — three subscriptions haven't been used since June.",
  },
  fitness: {
    title: "Fitness",
    chips: ["Workout log (input)", "Progress chart (output)"],
    insight:
      "Squat volume has plateaued for three weeks. A deload week before pushing weight again.",
  },
  habits: {
    title: "Habits",
    chips: ["Daily check-in (input)", "Streak heatmap (output)"],
    insight: "Reading happens on 4 of the last 7 days, always after 9pm — mornings are still open.",
  },
  focus: {
    title: "Focus",
    chips: ["Session timer (input)", "Weekly hours (output)"],
    insight:
      "Deep-work sessions run longest on Tuesdays. Worth blocking that slot before meetings fill it.",
  },
};

export const BOARD_ANGLES: Record<BoardKey, number> = {
  financial: 0,
  fitness: 90,
  habits: 180,
  focus: 270,
};

export const COMPASS_POINTS: { key: BoardKey; label: string; position: "n" | "e" | "s" | "w" }[] = [
  { key: "financial", label: "Financial", position: "n" },
  { key: "fitness", label: "Fitness", position: "e" },
  { key: "habits", label: "Habits", position: "s" },
  { key: "focus", label: "Focus", position: "w" },
];
