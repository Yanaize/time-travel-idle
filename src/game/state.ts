import type { GameNumber } from "./numbers";

export interface BookProgress {
  owned: boolean;
  pagesRead: number;
  completed: boolean;
}

export interface GameState {
  knowledge: GameNumber;
  studyProgressMs: number;
  isStudying: boolean;
  ownedUpgradeIds: string[];
  libraryUnlocked: boolean;
  streaksUnlocked: boolean;
  repeatablesUnlocked: boolean;
  lastStudyResult: "success" | "fail" | "crit" | null;
  books: Record<string, BookProgress>;
  /** Book currently being read, if any. */
  readingBookId: string | null;
  readProgressMs: number;
  repeatableLevels: Record<string, number>;
  currentStreak: number;
  bestStreak: number;
  lastTickAt: number;
}

export function emptyBookProgress(): BookProgress {
  return { owned: false, pagesRead: 0, completed: false };
}

export function createInitialState(now = Date.now()): GameState {
  return {
    knowledge: 0,
    studyProgressMs: 0,
    isStudying: false,
    ownedUpgradeIds: [],
    libraryUnlocked: false,
    streaksUnlocked: false,
    repeatablesUnlocked: false,
    lastStudyResult: null,
    books: {},
    readingBookId: null,
    readProgressMs: 0,
    repeatableLevels: {},
    currentStreak: 0,
    bestStreak: 0,
    lastTickAt: now,
  };
}

export function ownsUpgrade(state: GameState, id: string): boolean {
  return state.ownedUpgradeIds.includes(id);
}

export function getBookProgress(state: GameState, bookId: string): BookProgress {
  return state.books[bookId] ?? emptyBookProgress();
}

export function repeatableLevel(state: GameState, id: string): number {
  return state.repeatableLevels[id] ?? 0;
}
