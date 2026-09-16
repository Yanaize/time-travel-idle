/**
 * Game content for v0.0.2 — docs/game-design-2026-09-16.md
 *
 * Carried defaults (from v0.0.1):
 * - Reveal: next 5 unpurchased one-time upgrades in order
 * - Knowledge: ((base + additiveFlat) * productOfMults * otherMults) then × crit
 * - Fail = 0 Knowledge, no crit; crit only after success; base crit ×2
 *
 * v0.0.2 assumptions (not invented as new systems — needed to run specified ones):
 * - One Studying and one Reading action at a time; both may run together
 * - Books buyable in any order among currently implemented books
 * - Book #1 has no completion bonus yet (TBD in design)
 * - Book #4 is not offered (effects TBD)
 * - Upgrades #19–#25 omitted (TBD)
 * - Repeatable price `base*scale` = floor(base * scale^ownedLevel)
 * - Repeatables have no cap
 * - Streak resets to 0 on failed Study; bonus = max(0, streak - 5) × (5% + Book6 page bonus)
 * - Book #6 completion: permanent Knowledge mult += 1% × all-time best streak
 * - Critical Reader: 5% chance to finish +1 extra page when a page completes
 */

export const PROLOGUE_FLAVOR =
  "You're an insanely dumb person in the future, who is bored and wants to build a time machine. So you start studying.";

export const STUDY = {
  id: "study",
  name: "Study",
  baseDurationMs: 3000,
  baseKnowledge: 1,
  baseFailChance: 0.2,
  minDurationMs: 100,
} as const;

export const READING = {
  baseDurationMs: 10_000,
  minDurationMs: 100,
} as const;

/** Base Critical Studying multiplier (×2 = double Knowledge). */
export const BASE_CRIT_MULTIPLIER = 2;

export const REVEAL_WINDOW = 5;

/** Streak Knowledge bonus starts after this many consecutive successes. */
export const STREAK_THRESHOLD = 5;
export const STREAK_BONUS_PER_STUDY = 0.05;

export type UpgradeEffect =
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "knowledgeMult"; amount: number }
  | { kind: "studyDurationFlatMs"; amount: number }
  | { kind: "studyDurationDivide"; amount: number }
  | { kind: "readDurationFlatMs"; amount: number }
  | { kind: "failChanceFlat"; amount: number }
  | { kind: "critChance"; amount: number }
  | { kind: "unlockLibrary" }
  | { kind: "unlockStreaks" }
  | { kind: "critReadChance"; amount: number };

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
    description: "+1 Knowledge per Study.",
    effects: [{ kind: "knowledgeAdd", amount: 1 }],
  },
  {
    id: "improved_studying",
    number: 2,
    name: "Improved Studying",
    cost: 7,
    description: "-0.1s Studying time.",
    effects: [{ kind: "studyDurationFlatMs", amount: 100 }],
  },
  {
    id: "better_sources",
    number: 3,
    name: "Better Sources",
    cost: 10,
    description: "×1.5 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: 1.5 }],
  },
  {
    id: "critical_studying",
    number: 4,
    name: "Critical Studying",
    cost: 15,
    description: "5% chance to earn double Knowledge.",
    effects: [{ kind: "critChance", amount: 0.05 }],
  },
  {
    id: "even_better_studying",
    number: 5,
    name: "Even Better Studying",
    cost: 15,
    description: "Divide Studying time by 1.2.",
    effects: [{ kind: "studyDurationDivide", amount: 1.2 }],
  },
  {
    id: "organized_notes",
    number: 6,
    name: "Organized Notes",
    cost: 20,
    description: "+1 Knowledge per Study.",
    effects: [{ kind: "knowledgeAdd", amount: 1 }],
  },
  {
    id: "tough_paper",
    number: 7,
    name: "Tough Paper",
    cost: 22,
    description: "-5 percentage points Study failure chance.",
    effects: [{ kind: "failChanceFlat", amount: 0.05 }],
  },
  {
    id: "verified_sources",
    number: 8,
    name: "Verified Sources",
    cost: 25,
    description: "×1.5 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: 1.5 }],
  },
  {
    id: "very_improved_studying",
    number: 9,
    name: "Very Improved Studying",
    cost: 27,
    description: "-0.1s Studying time.",
    effects: [{ kind: "studyDurationFlatMs", amount: 100 }],
  },
  {
    id: "the_library",
    number: 10,
    name: "The Library",
    cost: 30,
    description: "Unlock The Library.",
    effects: [{ kind: "unlockLibrary" }],
  },
  {
    id: "improved_reading",
    number: 11,
    name: "Improved Reading",
    cost: 40,
    description: "-0.2s Reading time.",
    effects: [{ kind: "readDurationFlatMs", amount: 200 }],
  },
  {
    id: "proven_sources",
    number: 12,
    name: "Proven Sources",
    cost: 45,
    description: "×2 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: 2 }],
  },
  {
    id: "super_studying",
    number: 13,
    name: "Super Studying",
    cost: 60,
    description: "-0.3s Studying time.",
    effects: [{ kind: "studyDurationFlatMs", amount: 300 }],
  },
  {
    id: "even_better_reading",
    number: 14,
    name: "Even Better Reading",
    cost: 80,
    description: "-0.5s Reading time.",
    effects: [{ kind: "readDurationFlatMs", amount: 500 }],
  },
  {
    id: "knowledgeable",
    number: 15,
    name: "Knowledgeable",
    cost: 120,
    description: "×1.5 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: 1.5 }],
  },
  {
    id: "im_not_a_failure",
    number: 16,
    name: "I'm not a failure!",
    cost: 350,
    description: "-5 percentage points Study failure chance.",
    effects: [{ kind: "failChanceFlat", amount: 0.05 }],
  },
  {
    id: "critical_reader",
    number: 17,
    name: "Critical Reader",
    cost: 500,
    description: "Reading has 5% chance to complete an additional page.",
    effects: [{ kind: "critReadChance", amount: 0.05 }],
  },
  {
    id: "streaks",
    number: 18,
    name: "Streaks",
    cost: 1000,
    description:
      "Unlock Streaks; after 5 consecutive successful Studies, +5% Knowledge multiplier per further success.",
    effects: [{ kind: "unlockStreaks" }],
  },
];

export type PageBonus =
  | { kind: "studyDurationFlatMs"; amount: number }
  | { kind: "critMultiplierAdd"; amount: number }
  | { kind: "readDurationFlatMs"; amount: number }
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "streakBonusAdd"; amount: number };

export type CompletionBonus =
  | { kind: "critChanceFlat"; amount: number }
  | { kind: "unlockRepeatables" }
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "bestStreakOutsideMult"; percentPerBest: number }
  | { kind: "none" };

export interface BookDef {
  id: string;
  number: number;
  name: string;
  pages: number;
  cost: number;
  pageBonus: PageBonus;
  completionBonus: CompletionBonus;
  /** If false, book is not offered in the shop (effects unfinished). */
  implemented: boolean;
  /** Player-facing per-page effect text (completion bonuses stay hidden). */
  pageDescription: string;
}

export const BOOKS: BookDef[] = [
  {
    id: "objective_studying_method",
    number: 1,
    name: "The Objective Studying Method",
    pages: 30,
    cost: 50,
    pageBonus: { kind: "studyDurationFlatMs", amount: 20 },
    completionBonus: { kind: "none" },
    implemented: true,
    pageDescription: "-0.02s Studying time per page (-0.6s total).",
  },
  {
    id: "critical_thinking",
    number: 2,
    name: "Critical Thinking",
    pages: 40,
    cost: 100,
    pageBonus: { kind: "critMultiplierAdd", amount: 0.05 },
    completionBonus: { kind: "critChanceFlat", amount: 0.05 },
    implemented: true,
    pageDescription: "+5% Critical Studying multiplier per page (+200% total).",
  },
  {
    id: "practice_makes_perfect",
    number: 3,
    name: "Practice Makes Perfect",
    pages: 30,
    cost: 250,
    pageBonus: { kind: "readDurationFlatMs", amount: 10 },
    completionBonus: { kind: "unlockRepeatables" },
    implemented: true,
    pageDescription: "-0.01s Reading time per page (-0.3s total).",
  },
  {
    id: "art_of_reading_books",
    number: 4,
    name: "The Art of Reading Books",
    pages: 30,
    cost: 750,
    pageBonus: { kind: "knowledgeAdd", amount: 0 },
    completionBonus: { kind: "none" },
    implemented: false,
    pageDescription: "Effects TBD — not available yet.",
  },
  {
    id: "knowledge_101",
    number: 5,
    name: "Knowledge 101",
    pages: 50,
    cost: 1500,
    pageBonus: { kind: "knowledgeAdd", amount: 0.2 },
    completionBonus: { kind: "knowledgeAdd", amount: 5 },
    implemented: true,
    pageDescription: "+0.2 Knowledge per Study per page (+10 total).",
  },
  {
    id: "what_is_streaking",
    number: 6,
    name: "What is Streaking?",
    pages: 20,
    cost: 5000,
    pageBonus: { kind: "streakBonusAdd", amount: 0.005 },
    completionBonus: { kind: "bestStreakOutsideMult", percentPerBest: 0.01 },
    implemented: true,
    pageDescription:
      "Streaks gain an additional +0.5% Knowledge multiplier per successful Study per page.",
  },
];

export interface RepeatableUpgradeDef {
  id: string;
  number: number;
  name: string;
  baseCost: number;
  costScale: number;
  description: string;
  effect:
    | { kind: "knowledgeMultPerLevel"; amount: number }
    | { kind: "readDurationFlatMsPerLevel"; amount: number }
    | { kind: "critMultiplierAddPerLevel"; amount: number };
}

export const REPEATABLE_UPGRADES: RepeatableUpgradeDef[] = [
  {
    id: "rep_knowledge_mult",
    number: 1,
    name: "Knowledge Multiplier",
    baseCost: 50,
    costScale: 2.5,
    description: "+25% Knowledge gain per purchase.",
    effect: { kind: "knowledgeMultPerLevel", amount: 1.25 },
  },
  {
    id: "rep_reading_enhancer",
    number: 2,
    name: "Reading Enhancer",
    baseCost: 150,
    costScale: 3,
    description: "-0.25s Reading time per purchase.",
    effect: { kind: "readDurationFlatMsPerLevel", amount: 250 },
  },
  {
    id: "rep_critical_learner",
    number: 3,
    name: "Critical Learner",
    baseCost: 150,
    costScale: 3,
    description: "+10% Critical Studying multiplier per purchase.",
    effect: { kind: "critMultiplierAddPerLevel", amount: 0.1 },
  },
];

export function getUpgrade(id: string): KnowledgeUpgradeDef | undefined {
  return KNOWLEDGE_UPGRADES.find((u) => u.id === id);
}

export function getBook(id: string): BookDef | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function getRepeatable(id: string): RepeatableUpgradeDef | undefined {
  return REPEATABLE_UPGRADES.find((r) => r.id === id);
}

export function repeatableCost(def: RepeatableUpgradeDef, level: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costScale, level));
}
