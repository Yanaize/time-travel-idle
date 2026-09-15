import {
  BASE_CRIT_MULTIPLIER,
  LEARN,
  REVEAL_WINDOW,
  type KnowledgeUpgradeDef,
  KNOWLEDGE_UPGRADES,
} from "./content";
import type { GameState } from "./state";
import { ownsUpgrade } from "./state";

export interface LearnStats {
  durationMs: number;
  failChance: number;
  critChance: number;
  /** Expected Knowledge on a non-crit success (before crit roll). */
  baseGrant: number;
  critMultiplier: number;
}

function ownedDefs(state: GameState): KnowledgeUpgradeDef[] {
  return KNOWLEDGE_UPGRADES.filter((u) => ownsUpgrade(state, u.id));
}

/**
 * Duration: (base - flatMs reductions) / product(divisors), floored at min.
 */
export function learnDurationMs(state: GameState): number {
  let flatMs = 0;
  let divide = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "durationFlatMs") flatMs += effect.amount;
      if (effect.kind === "durationDivide") divide *= effect.amount;
    }
  }
  const raw = (LEARN.baseDurationMs - flatMs) / divide;
  return Math.max(LEARN.minDurationMs, raw);
}

export function failChance(state: GameState): number {
  let chance = LEARN.baseFailChance;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "failChanceFlat") chance -= effect.amount;
    }
  }
  return Math.max(0, Math.min(1, chance));
}

export function critChance(state: GameState): number {
  let chance = 0;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "critChance") chance += effect.amount;
    }
  }
  return Math.max(0, Math.min(1, chance));
}

/**
 * Knowledge on success (before crit):
 * ((base + additiveFlat) * productOfMults)
 * On crit: that value × critMultiplier (base ×2).
 */
export function knowledgeGrantBeforeCrit(state: GameState): number {
  let additive = 0;
  let mult = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "knowledgeAdd") additive += effect.amount;
      if (effect.kind === "knowledgeMult") mult *= effect.amount;
    }
  }
  return (LEARN.baseKnowledge + additive) * mult;
}

export function critMultiplier(_state: GameState): number {
  return BASE_CRIT_MULTIPLIER;
}

export function computeLearnStats(state: GameState): LearnStats {
  return {
    durationMs: learnDurationMs(state),
    failChance: failChance(state),
    critChance: critChance(state),
    baseGrant: knowledgeGrantBeforeCrit(state),
    critMultiplier: critMultiplier(state),
  };
}

/** Next unpurchased upgrades in design order, limited to REVEAL_WINDOW. */
export function getVisibleUpgrades(state: GameState): KnowledgeUpgradeDef[] {
  return KNOWLEDGE_UPGRADES.filter((u) => !ownsUpgrade(state, u.id)).slice(
    0,
    REVEAL_WINDOW,
  );
}

export function resolveLearnOutcome(
  state: GameState,
  random = Math.random,
): { knowledgeGained: number; result: "success" | "fail" | "crit" } {
  const stats = computeLearnStats(state);
  if (random() < stats.failChance) {
    return { knowledgeGained: 0, result: "fail" };
  }
  let grant = stats.baseGrant;
  if (stats.critChance > 0 && random() < stats.critChance) {
    grant *= stats.critMultiplier;
    return { knowledgeGained: grant, result: "crit" };
  }
  return { knowledgeGained: grant, result: "success" };
}
