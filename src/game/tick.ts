import { resolveLearnOutcome, learnDurationMs } from "./formulas";
import { add } from "./numbers";
import type { GameState } from "./state";

/** Cap a single tick so a long pause does not dump huge progress. */
const MAX_DT_MS = 1000;

export function tick(state: GameState, now = Date.now()): GameState {
  const rawDt = now - state.lastTickAt;
  const dtMs = Math.min(Math.max(rawDt, 0), MAX_DT_MS);

  let next: GameState = { ...state, lastTickAt: now };
  next = tickLearn(next, dtMs);
  return next;
}

function tickLearn(state: GameState, dtMs: number): GameState {
  if (!state.isLearning) return state;

  const duration = learnDurationMs(state);
  const progress = state.learnProgressMs + dtMs;
  if (progress >= duration) {
    const outcome = resolveLearnOutcome(state);
    return {
      ...state,
      isLearning: false,
      learnProgressMs: 0,
      knowledge: add(state.knowledge, outcome.knowledgeGained),
      lastLearnResult: outcome.result,
    };
  }

  return { ...state, learnProgressMs: progress };
}
