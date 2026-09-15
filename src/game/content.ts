/**
 * Game content for v0.0.1 — sourced from docs/game-design.md.
 *
 * Design defaults used where the plan asked questions (approved via implement):
 * - Reveal: next 5 unpurchased upgrades in order
 * - Knowledge: ((base + additiveFlat) * productOfMults) then × crit if crit
 * - Fail = 0 Knowledge, no crit roll; crit only after success; base crit ×2
 * - Library unlock: empty panel stub (no books yet)
 * - Prologue: flavor line on main screen
 * - Saving: none
 */

export const PROLOGUE_FLAVOR =
  "You're an insanely dumb person in the future, who is bored and wants to build a time machine. So you start learning.";

export const LEARN = {
  id: "learn",
  name: "Learn",
  baseDurationMs: 3000,
  baseKnowledge: 1,
  /** 0–1 probability. */
  baseFailChance: 0.2,
  /** Minimum Learn duration after upgrades. */
  minDurationMs: 100,
} as const;

/** Base Critical Learning multiplier (×2 = “double Knowledge”). */
export const BASE_CRIT_MULTIPLIER = 2;

export const REVEAL_WINDOW = 5;

export type UpgradeEffect =
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "knowledgeMult"; amount: number }
  | { kind: "durationFlatMs"; amount: number }
  | { kind: "durationDivide"; amount: number }
  | { kind: "failChanceFlat"; amount: number }
  | { kind: "critChance"; amount: number }
  | { kind: "unlockLibrary" };

export interface KnowledgeUpgradeDef {
  id: string;
  number: number;
  name: string;
  cost: number;
  description: string;
  effects: UpgradeEffect[];
}

export const KNOWLEDGE_UPGRADES: KnowledgeUpgradeDef[] = [
  {
    id: "take_notes",
    number: 1,
    name: "Take Notes",
    cost: 5,
    description: "Earn +1 Knowledge per study.",
    effects: [{ kind: "knowledgeAdd", amount: 1 }],
  },
  {
    id: "improved_learning",
    number: 2,
    name: "Improved Learning",
    cost: 7,
    description: "Decrease learning time by 0.1s.",
    effects: [{ kind: "durationFlatMs", amount: 100 }],
  },
  {
    id: "better_sources",
    number: 3,
    name: "Better Sources",
    cost: 10,
    description: "×1.5 Knowledge per study.",
    effects: [{ kind: "knowledgeMult", amount: 1.5 }],
  },
  {
    id: "critical_learning",
    number: 4,
    name: "Critical Learning",
    cost: 15,
    description: "Learning now has a 5% chance to earn double Knowledge.",
    effects: [{ kind: "critChance", amount: 0.05 }],
  },
  {
    id: "even_better_learning",
    number: 5,
    name: "Even Better Learning",
    cost: 15,
    description: "Divide learning time by 1.2.",
    effects: [{ kind: "durationDivide", amount: 1.2 }],
  },
  {
    id: "organized_notes",
    number: 6,
    name: "Organized Notes",
    cost: 20,
    description: "Earn +1 Knowledge per study.",
    effects: [{ kind: "knowledgeAdd", amount: 1 }],
  },
  {
    id: "tough_paper",
    number: 7,
    name: "Tough Paper",
    cost: 22,
    description: "Reduce the chance of failing Learning by 5 percentage points.",
    effects: [{ kind: "failChanceFlat", amount: 0.05 }],
  },
  {
    id: "verified_sources",
    number: 8,
    name: "Verified Sources",
    cost: 25,
    description: "×1.5 Knowledge per study.",
    effects: [{ kind: "knowledgeMult", amount: 1.5 }],
  },
  {
    id: "very_improved_learning",
    number: 9,
    name: "Very Improved Learning",
    cost: 27,
    description: "Decrease learning time by 0.1s.",
    effects: [{ kind: "durationFlatMs", amount: 100 }],
  },
  {
    id: "the_library",
    number: 10,
    name: "The Library",
    cost: 30,
    description: "Unlock The Library.",
    effects: [{ kind: "unlockLibrary" }],
  },
];

export function getUpgrade(id: string): KnowledgeUpgradeDef | undefined {
  return KNOWLEDGE_UPGRADES.find((u) => u.id === id);
}
