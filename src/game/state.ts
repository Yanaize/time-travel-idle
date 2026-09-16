import type { GameNumber } from "./numbers";

export interface BookProgress {
  owned: boolean;
  pagesRead: number;
  completed: boolean;
}

/** One active page-reading session. */
export interface ReadingSession {
  bookId: string;
  progressMs: number;
}

export interface GameState {
  knowledge: GameNumber;
  studyProgressMs: number;
  isStudying: boolean;
  ownedUpgradeIds: string[];
  libraryUnlocked: boolean;
  researchUnlocked: boolean;
  streaksUnlocked: boolean;
  repeatablesUnlocked: boolean;
  bookPinningUnlocked: boolean;
  mathematicsUnlocked: boolean;
  lastStudyResult: "success" | "fail" | "crit" | null;
  books: Record<string, BookProgress>;
  /** Active reading sessions (1 by default, 2 with Double Reading). */
  readingSessions: ReadingSession[];
  /** Book ids pinned to the Study tab. */
  pinnedBookIds: string[];
  ownedResearchIds: string[];
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
    researchUnlocked: false,
    streaksUnlocked: false,
    repeatablesUnlocked: false,
    bookPinningUnlocked: false,
    mathematicsUnlocked: false,
    lastStudyResult: null,
    books: {},
    readingSessions: [],
    pinnedBookIds: [],
    ownedResearchIds: [],
    repeatableLevels: {},
    currentStreak: 0,
    bestStreak: 0,
    lastTickAt: now,
  };
}

export function ownsUpgrade(state: GameState, id: string): boolean {
  return state.ownedUpgradeIds.includes(id);
}

export function ownsResearch(state: GameState, id: string): boolean {
  return state.ownedResearchIds.includes(id);
}

export function getBookProgress(state: GameState, bookId: string): BookProgress {
  return state.books[bookId] ?? emptyBookProgress();
}

export function repeatableLevel(state: GameState, id: string): number {
  return state.repeatableLevels[id] ?? 0;
}

export function isReadingBook(state: GameState, bookId: string): boolean {
  return state.readingSessions.some((s) => s.bookId === bookId);
}
