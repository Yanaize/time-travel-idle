import {
  getBook,
  getRepeatable,
  getResearch,
  getUpgrade,
  repeatableCost,
} from "./content";
import {
  implementedShopBooks,
  maxReadingSlots,
  nextResearch,
  researchCost,
} from "./formulas";
import { gte, sub } from "./numbers";
import {
  createInitialState,
  emptyBookProgress,
  getBookProgress,
  isReadingBook,
  ownsResearch,
  ownsUpgrade,
  repeatableLevel,
  type GameState,
} from "./state";

export function startStudy(state: GameState): GameState {
  if (state.isStudying) return state;
  return {
    ...state,
    isStudying: true,
    studyProgressMs: 0,
    lastStudyResult: null,
  };
}

export function buyUpgrade(state: GameState, upgradeId: string): GameState {
  const def = getUpgrade(upgradeId);
  if (!def) return state;
  if (ownsUpgrade(state, upgradeId)) return state;
  if (def.requiresResearchId && !ownsResearch(state, def.requiresResearchId)) {
    return state;
  }
  if (!gte(state.knowledge, def.cost)) return state;

  let next: GameState = {
    ...state,
    knowledge: sub(state.knowledge, def.cost),
    ownedUpgradeIds: [...state.ownedUpgradeIds, upgradeId],
  };

  for (const effect of def.effects) {
    if (effect.kind === "unlockLibrary") next = { ...next, libraryUnlocked: true };
    if (effect.kind === "unlockStreaks") next = { ...next, streaksUnlocked: true };
    if (effect.kind === "unlockRepeatables") {
      next = { ...next, repeatablesUnlocked: true };
    }
    if (effect.kind === "unlockResearch") {
      next = { ...next, researchUnlocked: true };
    }
    if (effect.kind === "unlockBookPinning") {
      next = { ...next, bookPinningUnlocked: true };
    }
  }

  return next;
}

export function canBuyUpgrade(state: GameState, upgradeId: string): boolean {
  const def = getUpgrade(upgradeId);
  if (!def) return false;
  if (ownsUpgrade(state, upgradeId)) return false;
  if (def.requiresResearchId && !ownsResearch(state, def.requiresResearchId)) {
    return false;
  }
  return gte(state.knowledge, def.cost);
}

export function buyBook(state: GameState, bookId: string): GameState {
  if (!state.libraryUnlocked) return state;
  const def = getBook(bookId);
  if (!def || !def.implemented) return state;
  if (def.requiresResearchId && !ownsResearch(state, def.requiresResearchId)) {
    return state;
  }
  const progress = getBookProgress(state, bookId);
  if (progress.owned) return state;
  if (!gte(state.knowledge, def.cost)) return state;

  return {
    ...state,
    knowledge: sub(state.knowledge, def.cost),
    books: {
      ...state.books,
      [bookId]: { ...emptyBookProgress(), owned: true },
    },
  };
}

export function canBuyBook(state: GameState, bookId: string): boolean {
  if (!state.libraryUnlocked) return false;
  const def = getBook(bookId);
  if (!def || !def.implemented) return false;
  if (def.requiresResearchId && !ownsResearch(state, def.requiresResearchId)) {
    return false;
  }
  if (getBookProgress(state, bookId).owned) return false;
  return gte(state.knowledge, def.cost);
}

/** Start reading the next page of a book (respects max reading slots). */
export function startReading(state: GameState, bookId: string): GameState {
  if (isReadingBook(state, bookId)) return state;
  if (state.readingSessions.length >= maxReadingSlots(state)) return state;

  const def = getBook(bookId);
  if (!def || !def.implemented) return state;
  const progress = getBookProgress(state, bookId);
  if (!progress.owned || progress.completed) return state;

  return {
    ...state,
    readingSessions: [
      ...state.readingSessions,
      { bookId, progressMs: 0 },
    ],
  };
}

export function togglePinBook(state: GameState, bookId: string): GameState {
  if (!state.bookPinningUnlocked) return state;
  const progress = getBookProgress(state, bookId);
  if (!progress.owned || progress.completed) return state;

  const pinned = state.pinnedBookIds.includes(bookId);
  return {
    ...state,
    pinnedBookIds: pinned
      ? state.pinnedBookIds.filter((id) => id !== bookId)
      : [...state.pinnedBookIds, bookId],
  };
}

export function buyRepeatable(state: GameState, id: string): GameState {
  if (!state.repeatablesUnlocked) return state;
  const def = getRepeatable(id);
  if (!def) return state;
  const level = repeatableLevel(state, id);
  const cost = repeatableCost(def, level);
  if (!gte(state.knowledge, cost)) return state;

  return {
    ...state,
    knowledge: sub(state.knowledge, cost),
    repeatableLevels: {
      ...state.repeatableLevels,
      [id]: level + 1,
    },
  };
}

export function canBuyRepeatable(state: GameState, id: string): boolean {
  if (!state.repeatablesUnlocked) return false;
  const def = getRepeatable(id);
  if (!def) return false;
  return gte(state.knowledge, repeatableCost(def, repeatableLevel(state, id)));
}

export function buyResearch(state: GameState, researchId: string): GameState {
  if (!state.researchUnlocked) return state;
  const def = getResearch(researchId);
  if (!def) return state;
  if (ownsResearch(state, researchId)) return state;

  const next = nextResearch(state);
  if (!next || next.id !== researchId) return state;

  const cost = researchCost(state, def);
  if (!gte(state.knowledge, cost)) return state;

  let result: GameState = {
    ...state,
    knowledge: sub(state.knowledge, cost),
    ownedResearchIds: [...state.ownedResearchIds, researchId],
  };

  if (def.reward.kind === "unlockMathematics") {
    result = { ...result, mathematicsUnlocked: true };
  }

  return result;
}

export function canBuyResearch(state: GameState, researchId: string): boolean {
  if (!state.researchUnlocked) return false;
  const def = getResearch(researchId);
  if (!def) return false;
  if (ownsResearch(state, researchId)) return false;
  const next = nextResearch(state);
  if (!next || next.id !== researchId) return false;
  return gte(state.knowledge, researchCost(state, def));
}

export function availableBooks(state: GameState) {
  return implementedShopBooks(state).filter(
    (b) => !getBookProgress(state, b.id).owned,
  );
}

export function ownedReadableBooks(state: GameState) {
  return implementedShopBooks(state).filter((b) => {
    const p = getBookProgress(state, b.id);
    return p.owned && !p.completed;
  });
}

export function resetGame(now = Date.now()): GameState {
  return createInitialState(now);
}
