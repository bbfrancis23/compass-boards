import type { BoardConfig } from "@/lib/board-types";

// Add each board's config here as boards/<id>.board.ts files are created.
const boardConfigs: BoardConfig[] = [];

export function getBoardConfig(boardId: string): BoardConfig | undefined {
  return boardConfigs.find((config) => config.id === boardId);
}

export function listBoardConfigs(): BoardConfig[] {
  return boardConfigs;
}
