import type { GameNumber } from "./numbers";

export interface GameState {
  knowledge: GameNumber;
  learnProgressMs: number;
  isLearning: boolean;
  /** Owned one-time Knowledge upgrade ids. */
  ownedUpgradeIds: string[];
  libraryUnlocked: boolean;
  /** Result of the last completed Learn attempt (for UI feedback). */
  lastLearnResult: "success" | "fail" | "crit" | null;
  lastTickAt: number;
}

export function createInitialState(now = Date.now()): GameState {
  return {
    knowledge: 0,
    learnProgressMs: 0,
    isLearning: false,
    ownedUpgradeIds: [],
    libraryUnlocked: false,
    lastLearnResult: null,
    lastTickAt: now,
  };
}

export function ownsUpgrade(state: GameState, id: string): boolean {
  return state.ownedUpgradeIds.includes(id);
}
