import { getBook } from "./content";
import { add } from "./numbers";
import {
  critReadChance,
  readDurationMs,
  resolveStudyOutcome,
  studyDurationMs,
} from "./formulas";
import { getBookProgress, type GameState, type ReadingSession } from "./state";

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
  if (state.readingSessions.length === 0) return state;

  const duration = readDurationMs(state);
  let next = state;
  const continuing: ReadingSession[] = [];

  for (const session of state.readingSessions) {
    const progress = session.progressMs + dtMs;
    if (progress < duration) {
      continuing.push({ bookId: session.bookId, progressMs: progress });
    } else {
      next = applyPageCompletion(next, session.bookId, 1);
    }
  }

  return { ...next, readingSessions: continuing };
}

/** Apply finished page(s); does not manage readingSessions. */
function applyPageCompletion(
  state: GameState,
  bookId: string,
  pages: number,
  random = Math.random,
): GameState {
  const def = getBook(bookId);
  if (!def) return state;

  let progress = getBookProgress(state, bookId);
  let pagesToApply = pages;
  if (critReadChance(state) > 0 && random() < critReadChance(state)) {
    pagesToApply += 1;
  }

  let next: GameState = { ...state, books: { ...state.books } };

  for (let i = 0; i < pagesToApply; i++) {
    if (progress.completed) break;
    const pagesRead = progress.pagesRead + 1;
    progress = { ...progress, pagesRead };
    if (pagesRead >= def.pages) {
      progress = { ...progress, completed: true };
      if (def.completionBonus.kind === "unlockRepeatables") {
        next = { ...next, repeatablesUnlocked: true };
      }
      next = {
        ...next,
        pinnedBookIds: next.pinnedBookIds.filter((id) => id !== bookId),
      };
    }
  }

  return {
    ...next,
    books: { ...next.books, [bookId]: progress },
  };
}
