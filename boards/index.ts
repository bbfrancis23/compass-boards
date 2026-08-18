import type { BoardConfig } from "@/lib/board-types";
import { financialBoard } from "./financial.board";
import { fitnessBoard } from "./fitness.board";

const boardConfigs: BoardConfig[] = [financialBoard, fitnessBoard];

export function getBoardConfig(boardId: string): BoardConfig | undefined {
  return boardConfigs.find((config) => config.id === boardId);
}

export function listBoardConfigs(): BoardConfig[] {
  return [...boardConfigs];
}

export interface BoardNavItem {
  id: string;
  label: string;
}

/** Serializable board metadata for client components like the nav sidebar. */
export function listBoardNavItems(): BoardNavItem[] {
  return boardConfigs.map(({ id, label }) => ({ id, label }));
}
