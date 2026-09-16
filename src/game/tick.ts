import { getBook } from "./content";
import { add } from "./numbers";
import {
  critReadChance,
  readDurationMs,
  resolveStudyOutcome,
  studyDurationMs,
} from "./formulas";
import { getBookProgress, type GameState } from "./state";

const MAX_DT_MS = 1000;

export function tick(state: GameState, now = Date.now()): GameState {
  const rawDt = now - state.lastTickAt;
  const dtMs = Math.min(Math.max(rawDt, 0), MAX_DT_MS);

  let next: GameState = { ...state, lastTickAt: now };
  next = tickStudy(next, dtMs);
  next = tickReading(next, dtMs);
  return next;
}

function tickStudy(state: GameState, dtMs: number): GameState {
  if (!state.isStudying) return state;

  const duration = studyDurationMs(state);
  const progress = state.studyProgressMs + dtMs;
  if (progress >= duration) {
    const outcome = resolveStudyOutcome(state);
    return {
      ...state,
      isStudying: false,
      studyProgressMs: 0,
      knowledge: add(state.knowledge, outcome.knowledgeGained),
      lastStudyResult: outcome.result,
      currentStreak: outcome.nextStreak,
      bestStreak: outcome.nextBestStreak,
    };
  }

  return { ...state, studyProgressMs: progress };
}

function tickReading(state: GameState, dtMs: number): GameState {
  if (!state.readingBookId) return state;

  const duration = readDurationMs(state);
  const progress = state.readProgressMs + dtMs;
  if (progress < duration) {
    return { ...state, readProgressMs: progress };
  }

  return completePages(state, 1);
}

/** Finish at least one page; Critical Reader may finish an extra page. */
function completePages(state: GameState, pages: number, random = Math.random): GameState {
  const bookId = state.readingBookId;
  if (!bookId) return state;
  const def = getBook(bookId);
  if (!def) {
    return { ...state, readingBookId: null, readProgressMs: 0 };
  }

  let progress = getBookProgress(state, bookId);
  let pagesToApply = pages;
  const critChance = critReadChance(state);
  if (critChance > 0 && random() < critChance) {
    pagesToApply += 1;
  }

  let next: GameState = {
    ...state,
    books: { ...state.books },
    readProgressMs: 0,
  };

  for (let i = 0; i < pagesToApply; i++) {
    if (progress.completed) break;
    const pagesRead = progress.pagesRead + 1;
    progress = { ...progress, pagesRead };
    if (pagesRead >= def.pages) {
      progress = { ...progress, completed: true };
      if (def.completionBonus.kind === "unlockRepeatables") {
        next = { ...next, repeatablesUnlocked: true };
      }
    }
  }

  // Always stop after this page action — player must start the next page manually.
  return {
    ...next,
    books: { ...next.books, [bookId]: progress },
    readingBookId: null,
    readProgressMs: 0,
  };
}
