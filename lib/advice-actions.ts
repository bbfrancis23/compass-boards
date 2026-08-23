"use server";

import { getBoardConfig } from "@/boards";
import type { BoardData } from "./board-types";
import { getClaudeClient } from "./claude-client";
import { ADVICE_ENABLED } from "./feature-flags";
import { requireSession } from "./require-session";
import { queryWidgetData } from "./widget-data-queries";
import { queryBoardWidgets } from "./widget-queries";

export async function getBoardAdvice(boardId: string): Promise<string> {
  const session = await requireSession();

  if (!ADVICE_ENABLED) {
    throw new Error("Advice generation is temporarily disabled until sign-in is added.");
  }

  const config = getBoardConfig(boardId);
  if (!config) {
    throw new Error(`Unknown board: "${boardId}"`);
  }

  const widgets = await queryBoardWidgets(boardId, session.user.id);
  const entries = await Promise.all(
    widgets.map(async (widget) => {
      const rows = await queryWidgetData(boardId, session.user.id, widget.id);
      return [widget.id, { type: widget.type, rows }] as const;
    }),
  );
  const data: BoardData = Object.fromEntries(entries);

  const response = await getClaudeClient().messages.create({
    model: "claude-opus-5",
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    messages: [{ role: "user", content: config.buildAdvicePrompt(data) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) {
    throw new Error("Claude did not return any advice text.");
  }
  return textBlock.text;
}
