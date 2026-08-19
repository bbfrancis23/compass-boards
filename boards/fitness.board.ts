import { findWidgetRows, type BoardConfig, type BoardData } from "@/lib/board-types";

function buildAdvicePrompt(data: BoardData): string {
  const workouts = findWidgetRows(data, "workout-log");

  if (workouts.length === 0) {
    return [
      "You are a fitness coach for the user's Compass Boards fitness dashboard.",
      "The user hasn't logged any workouts yet.",
      "In 2-3 sentences, encourage them to log their first workout, and briefly explain what",
      "kind of advice you'll be able to give once they do (training consistency, variety,",
      "trends in duration or calories over time).",
    ].join(" ");
  }

  const today = new Date().toISOString().slice(0, 10);

  const workoutsSection = `## Workout Log (${workouts.length} logged)\n${workouts
    .map((w) => {
      const distance = typeof w.distanceMi === "number" ? `, ${w.distanceMi} mi` : "";
      return `- ${w.date}: ${w.type} — ${w.durationMin} min, ${w.calories} cal${distance}`;
    })
    .join("\n")}`;

  return [
    "You are a fitness coach reviewing a user's Compass Boards workout log.",
    `Today's date is ${today}.`,
    "",
    workoutsSection,
    "",
    "Instructions:",
    "- Ground every recommendation in the specific workouts above (cite actual dates, workout",
    "  types, durations, or calorie figures) — do not give generic fitness advice that could",
    "  apply to anyone.",
    "- Note real patterns: workout frequency and consistency, variety across workout types, and",
    "  any trends or gaps in duration or calories over time.",
    "- Prioritize the 2-4 most impactful, specific suggestions for what to do next, not an",
    "  exhaustive training plan.",
    "- If the log looks sparse or inconsistent, say so explicitly rather than assuming a",
    "  complete picture.",
    "- Keep it concise — a few short paragraphs or a tight bulleted list, not a full program.",
  ].join("\n");
}

export const fitnessBoard: BoardConfig = {
  id: "fitness",
  domain: "fitness",
  label: "Fitness",
  widgets: [],
  buildAdvicePrompt,
};
