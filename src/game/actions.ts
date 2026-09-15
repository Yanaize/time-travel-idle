import { getUpgrade } from "./content";
import { gte, sub } from "./numbers";
import { createInitialState, ownsUpgrade, type GameState } from "./state";

/** Start Learn (one at a time). */
export function startLearn(state: GameState): GameState {
  if (state.isLearning) return state;
  return {
    ...state,
    isLearning: true,
    learnProgressMs: 0,
    lastLearnResult: null,
  };
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  const def = getUpgrade(upgradeId);
  if (!def) return state;
  if (ownsUpgrade(state, upgradeId)) return state;
  if (!gte(state.knowledge, def.cost)) return state;

  const unlockLibrary = def.effects.some((e) => e.kind === "unlockLibrary");

  return {
    ...state,
    knowledge: sub(state.knowledge, def.cost),
    ownedUpgradeIds: [...state.ownedUpgradeIds, upgradeId],
    libraryUnlocked: state.libraryUnlocked || unlockLibrary,
  };
}

export function canBuyUpgrade(state: GameState, upgradeId: string): boolean {
  const def = getUpgrade(upgradeId);
  if (!def) return false;
  if (ownsUpgrade(state, upgradeId)) return false;
  return gte(state.knowledge, def.cost);
}

export function resetGame(now = Date.now()): GameState {
  return createInitialState(now);
}
