import {
  getBook,
  getRepeatable,
  getUpgrade,
  repeatableCost,
} from "./content";
import { gte, sub } from "./numbers";
import {
  createInitialState,
  emptyBookProgress,
  getBookProgress,
  ownsUpgrade,
  repeatableLevel,
  type GameState,
} from "./state";
import { implementedBooks } from "./formulas";

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
  if (!gte(state.knowledge, def.cost)) return state;

  let next: GameState = {
    ...state,
    knowledge: sub(state.knowledge, def.cost),
    ownedUpgradeIds: [...state.ownedUpgradeIds, upgradeId],
  };

  for (const effect of def.effects) {
    if (effect.kind === "unlockLibrary") next = { ...next, libraryUnlocked: true };
    if (effect.kind === "unlockStreaks") next = { ...next, streaksUnlocked: true };
  }

  return next;
}

export function canBuyUpgrade(state: GameState, upgradeId: string): boolean {
  const def = getUpgrade(upgradeId);
  if (!def) return false;
  if (ownsUpgrade(state, upgradeId)) return false;
  return gte(state.knowledge, def.cost);
}

export function buyBook(state: GameState, bookId: string): GameState {
  if (!state.libraryUnlocked) return state;
  const def = getBook(bookId);
  if (!def || !def.implemented) return state;
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
  if (getBookProgress(state, bookId).owned) return false;
  return gte(state.knowledge, def.cost);
}

/** Start reading the next page of an owned unfinished book (one page at a time). */
export function startReading(state: GameState, bookId: string): GameState {
  if (state.readingBookId) return state;
  const def = getBook(bookId);
  if (!def || !def.implemented) return state;
  const progress = getBookProgress(state, bookId);
  if (!progress.owned || progress.completed) return state;

  return {
    ...state,
    readingBookId: bookId,
    readProgressMs: 0,
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

export function availableBooks(state: GameState) {
  return implementedBooks().filter((b) => !getBookProgress(state, b.id).owned);
}

export function ownedReadableBooks(state: GameState) {
  return implementedBooks().filter((b) => {
    const p = getBookProgress(state, b.id);
    return p.owned && !p.completed;
  });
}

export function resetGame(now = Date.now()): GameState {
  return createInitialState(now);
}
