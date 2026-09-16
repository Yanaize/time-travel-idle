/**
 * Content definitions for v0.0.3 — built from balance.ts.
 * Do not put tweakable numbers here; edit balance.ts instead.
 *
 * Assumptions (needed to run specified systems; not inventing TBD content):
 * - Reveal: next 5 unpurchased upgrades that are currently unlocked by Research gates
 * - Knowledge: (base + flat) * product(mults) * otherMults, then × crit if crit
 * - Fail = 0 Knowledge; crit only after success
 * - Study + up to maxReadingSlots Readings can run together; each page is manual
 * - Books buyable in any order among those unlocked
 * - Repeatables unlock via Upgrade #16 OR completing Practice Makes Perfect
 * - Streak resets on fail; bonus stacks = max(0, streak - threshold)
 * - Research is linear; only purchased + next unpurchased are shown
 * - Book #9 / #10 / Repeatables #4–#5 omitted (TBD)
 */

import * as B from "./balance";

export const PROLOGUE_FLAVOR =
  "You're an insanely dumb person in the future, who is bored and wants to build a time machine. So you start studying.";

export const STUDY = {
  id: "study",
  name: "Study",
  baseDurationMs: B.STUDY_BASE_DURATION_MS,
  baseKnowledge: B.STUDY_BASE_KNOWLEDGE,
  baseFailChance: B.STUDY_BASE_FAIL_CHANCE,
  minDurationMs: B.STUDY_MIN_DURATION_MS,
} as const;

export const READING = {
  baseDurationMs: B.READ_BASE_DURATION_MS,
  minDurationMs: B.READ_MIN_DURATION_MS,
} as const;

export const BASE_CRIT_MULTIPLIER = B.CRIT_BASE_MULTIPLIER;
export const REVEAL_WINDOW = B.UPGRADE_REVEAL_WINDOW;
export const STREAK_THRESHOLD_DEFAULT = B.STREAK_THRESHOLD_DEFAULT;
export const STREAK_BONUS_PER_STUDY = B.STREAK_BONUS_PER_STUDY;

export type UpgradeEffect =
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "knowledgeMult"; amount: number }
  | { kind: "studyDurationFlatMs"; amount: number }
  | { kind: "studyDurationDivide"; amount: number }
  | { kind: "readDurationFlatMs"; amount: number }
  | { kind: "failChanceFlat"; amount: number }
  | { kind: "critChance"; amount: number }
  | { kind: "critReadChance"; amount: number }
  | { kind: "unlockLibrary" }
  | { kind: "unlockRepeatables" }
  | { kind: "unlockStreaks" }
  | { kind: "unlockResearch" }
  | { kind: "streakThreshold"; amount: number }
  | { kind: "unlockBookPinning" }
  | { kind: "maxReadingSlots"; amount: number }
  | { kind: "critStreakGain"; amount: number }
  | { kind: "actionSpeedMult"; amount: number }
  | { kind: "researchCostMult"; amount: number }
  | { kind: "knowledgeMultPerCompletedBook"; amount: number };

export interface KnowledgeUpgradeDef {
  id: string;
  number: number;
  name: string;
  cost: number;
  description: string;
  effects: UpgradeEffect[];
  /** Research id that must be owned before this upgrade appears. */
  requiresResearchId?: string;
}

export const KNOWLEDGE_UPGRADES: KnowledgeUpgradeDef[] = [
  {
    id: "take_notes",
    number: 1,
    name: "Take Notes",
    cost: B.UPGRADE_PRICES[1],
    description: "+1 Knowledge per Study.",
    effects: [{ kind: "knowledgeAdd", amount: B.EFF_KNOWLEDGE_ADD_SMALL }],
  },
  {
    id: "improved_studying",
    number: 2,
    name: "Improved Studying",
    cost: B.UPGRADE_PRICES[2],
    description: "-0.1s Study time.",
    effects: [{ kind: "studyDurationFlatMs", amount: B.EFF_STUDY_FLAT_0_1_S_MS }],
  },
  {
    id: "better_sources",
    number: 3,
    name: "Better Sources",
    cost: B.UPGRADE_PRICES[3],
    description: "×1.5 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: B.EFF_KNOWLEDGE_MULT_1_5 }],
  },
  {
    id: "critical_studying",
    number: 4,
    name: "Critical Studying",
    cost: B.UPGRADE_PRICES[4],
    description: "5% chance to earn double Knowledge.",
    effects: [{ kind: "critChance", amount: B.EFF_CRIT_CHANCE }],
  },
  {
    id: "even_better_studying",
    number: 5,
    name: "Even Better Studying",
    cost: B.UPGRADE_PRICES[5],
    description: "Divide Study time by 1.2.",
    effects: [{ kind: "studyDurationDivide", amount: B.EFF_STUDY_DIVIDE_1_2 }],
  },
  {
    id: "organized_notes",
    number: 6,
    name: "Organized Notes",
    cost: B.UPGRADE_PRICES[6],
    description: "+1 Knowledge per Study.",
    effects: [{ kind: "knowledgeAdd", amount: B.EFF_KNOWLEDGE_ADD_SMALL }],
  },
  {
    id: "tough_paper",
    number: 7,
    name: "Tough Paper",
    cost: B.UPGRADE_PRICES[7],
    description: "-5 percentage points failure chance.",
    effects: [{ kind: "failChanceFlat", amount: B.EFF_FAIL_CHANCE_FLAT }],
  },
  {
    id: "verified_sources",
    number: 8,
    name: "Verified Sources",
    cost: B.UPGRADE_PRICES[8],
    description: "×1.5 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: B.EFF_KNOWLEDGE_MULT_1_5 }],
  },
  {
    id: "very_improved_studying",
    number: 9,
    name: "Very Improved Studying",
    cost: B.UPGRADE_PRICES[9],
    description: "-0.1s Study time.",
    effects: [{ kind: "studyDurationFlatMs", amount: B.EFF_STUDY_FLAT_0_1_S_MS }],
  },
  {
    id: "the_library",
    number: 10,
    name: "The Library",
    cost: B.UPGRADE_PRICES[10],
    description: "Unlock Library.",
    effects: [{ kind: "unlockLibrary" }],
  },
  {
    id: "improved_reading",
    number: 11,
    name: "Improved Reading",
    cost: B.UPGRADE_PRICES[11],
    description: "-0.2s Reading time.",
    effects: [{ kind: "readDurationFlatMs", amount: B.EFF_READ_FLAT_0_2_S_MS }],
  },
  {
    id: "proven_sources",
    number: 12,
    name: "Proven Sources",
    cost: B.UPGRADE_PRICES[12],
    description: "×2 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: B.EFF_KNOWLEDGE_MULT_2 }],
  },
  {
    id: "super_studying",
    number: 13,
    name: "Super Studying",
    cost: B.UPGRADE_PRICES[13],
    description: "-0.3s Study time.",
    effects: [{ kind: "studyDurationFlatMs", amount: B.EFF_STUDY_FLAT_0_3_S_MS }],
  },
  {
    id: "even_better_reading",
    number: 14,
    name: "Even Better Reading",
    cost: B.UPGRADE_PRICES[14],
    description: "-0.5s Reading time.",
    effects: [{ kind: "readDurationFlatMs", amount: B.EFF_READ_FLAT_0_5_S_MS }],
  },
  {
    id: "knowledgeable",
    number: 15,
    name: "Knowledgeable",
    cost: B.UPGRADE_PRICES[15],
    description: "×1.5 Knowledge per Study.",
    effects: [{ kind: "knowledgeMult", amount: B.EFF_KNOWLEDGE_MULT_1_5 }],
  },
  {
    id: "repeatable_upgrades",
    number: 16,
    name: "Repeatable Upgrades",
    cost: B.UPGRADE_PRICES[16],
    description: "Unlock Repeatable Upgrades.",
    effects: [{ kind: "unlockRepeatables" }],
  },
  {
    id: "im_not_a_failure",
    number: 17,
    name: "I'm not a failure!",
    cost: B.UPGRADE_PRICES[17],
    description: "-5 percentage points failure chance.",
    effects: [{ kind: "failChanceFlat", amount: B.EFF_FAIL_CHANCE_FLAT }],
  },
  {
    id: "critical_reader",
    number: 18,
    name: "Critical Reader",
    cost: B.UPGRADE_PRICES[18],
    description: "5% chance for Reading to complete an additional page.",
    effects: [{ kind: "critReadChance", amount: B.EFF_CRIT_READ_CHANCE }],
  },
  {
    id: "streaks",
    number: 19,
    name: "Streaks",
    cost: B.UPGRADE_PRICES[19],
    description: "Unlock Streaks.",
    effects: [{ kind: "unlockStreaks" }],
  },
  {
    id: "sturdier_studying",
    number: 20,
    name: "Sturdier Studying",
    cost: B.UPGRADE_PRICES[20],
    description: "-0.1s Study time.",
    effects: [{ kind: "studyDurationFlatMs", amount: B.EFF_STUDY_FLAT_0_1_S_MS }],
  },
  {
    id: "research",
    number: 21,
    name: "Research",
    cost: B.UPGRADE_PRICES[21],
    description: "Unlock Research.",
    effects: [{ kind: "unlockResearch" }],
  },
  {
    id: "super_reader",
    number: 22,
    name: "Super Reader",
    cost: B.UPGRADE_PRICES[22],
    description: "-1s Reading time.",
    effects: [{ kind: "readDurationFlatMs", amount: B.EFF_READ_FLAT_1_S_MS }],
    requiresResearchId: "knowledgeable_research",
  },
  {
    id: "more_more_more",
    number: 23,
    name: "More, More, More!",
    cost: B.UPGRADE_PRICES[23],
    description: "×1.5 Knowledge gain.",
    effects: [{ kind: "knowledgeMult", amount: B.EFF_KNOWLEDGE_MULT_1_5 }],
    requiresResearchId: "knowledgeable_research",
  },
  {
    id: "book_pinning",
    number: 24,
    name: "Book Pinning",
    cost: B.UPGRADE_PRICES[24],
    description: "Pin books to Study tab.",
    effects: [{ kind: "unlockBookPinning" }],
    requiresResearchId: "knowledgeable_research",
  },
  {
    id: "consistency_is_key",
    number: 25,
    name: "Consistency is Key",
    cost: B.UPGRADE_PRICES[25],
    description: "Streak bonus begins after 4 successful Studies.",
    effects: [
      { kind: "streakThreshold", amount: B.EFF_STREAK_THRESHOLD_CONSISTENCY },
    ],
    requiresResearchId: "knowledgeable_research",
  },
  {
    id: "double_reading",
    number: 26,
    name: "Double Reading",
    cost: B.UPGRADE_PRICES[26],
    description: "Read 2 books simultaneously.",
    effects: [{ kind: "maxReadingSlots", amount: B.EFF_MAX_READING_SLOTS }],
    requiresResearchId: "knowledgeable_research",
  },
  {
    id: "critical_streaker",
    number: 27,
    name: "Critical Streaker",
    cost: B.UPGRADE_PRICES[27],
    description: "Critical Studies increase Streak by +2.",
    effects: [{ kind: "critStreakGain", amount: B.EFF_CRIT_STREAK_GAIN }],
    requiresResearchId: "mega_brain",
  },
  {
    id: "even_faster",
    number: 28,
    name: "Even Faster",
    cost: B.UPGRADE_PRICES[28],
    description: "Studying and Reading 10% faster.",
    effects: [{ kind: "actionSpeedMult", amount: B.EFF_SPEED_MULT }],
    requiresResearchId: "mega_brain",
  },
  {
    id: "efficient_research",
    number: 29,
    name: "Efficient Research",
    cost: B.UPGRADE_PRICES[29],
    description: "Research costs 20% less Knowledge.",
    effects: [{ kind: "researchCostMult", amount: B.EFF_RESEARCH_COST_MULT }],
    requiresResearchId: "mega_brain",
  },
  {
    id: "reading_is_healthy",
    number: 30,
    name: "Reading is Healthy",
    cost: B.UPGRADE_PRICES[30],
    description: "×1.5 Knowledge multiplier per completed Book.",
    effects: [
      {
        kind: "knowledgeMultPerCompletedBook",
        amount: B.EFF_KNOWLEDGE_MULT_PER_COMPLETED_BOOK,
      },
    ],
    requiresResearchId: "mega_brain",
  },
];

export type PageBonus =
  | { kind: "none" }
  | { kind: "studyDurationFlatMs"; amount: number }
  | { kind: "critMultiplierAdd"; amount: number }
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "knowledgeMultAdd"; amount: number }
  | { kind: "streakBonusAdd"; amount: number };

export type CompletionBonus =
  | { kind: "none" }
  | { kind: "critChanceFlat"; amount: number }
  | { kind: "unlockRepeatables" }
  | { kind: "pageBonusMult"; amount: number }
  | { kind: "knowledgeAdd"; amount: number }
  | { kind: "knowledgeMult"; amount: number }
  | { kind: "bestStreakOutsideMult"; percentPerBest: number };

export interface BookDef {
  id: string;
  number: number;
  name: string;
  pages: number;
  cost: number;
  pageBonus: PageBonus;
  completionBonus: CompletionBonus;
  /** Offered in shop only when true and research gate (if any) is met. */
  implemented: boolean;
  /** Research that unlocks this book in the shop (Books #7+). */
  requiresResearchId?: string;
  pageDescription: string;
}

export const BOOKS: BookDef[] = [
  {
    id: "objective_studying_method",
    number: 1,
    name: "The Objective Studying Method",
    pages: B.BOOK_DEFS.objective_studying_method.pages,
    cost: B.BOOK_DEFS.objective_studying_method.cost,
    pageBonus: {
      kind: "studyDurationFlatMs",
      amount: B.BOOK_DEFS.objective_studying_method.studyFlatMsPerPage,
    },
    completionBonus: { kind: "none" },
    implemented: true,
    pageDescription: "-0.01s Study time per page.",
  },
  {
    id: "critical_thinking",
    number: 2,
    name: "Critical Thinking",
    pages: B.BOOK_DEFS.critical_thinking.pages,
    cost: B.BOOK_DEFS.critical_thinking.cost,
    pageBonus: {
      kind: "critMultiplierAdd",
      amount: B.BOOK_DEFS.critical_thinking.critMultAddPerPage,
    },
    completionBonus: {
      kind: "critChanceFlat",
      amount: B.BOOK_DEFS.critical_thinking.completionCritChance,
    },
    implemented: true,
    pageDescription: "+3% Critical Study multiplier per page.",
  },
  {
    id: "practice_makes_perfect",
    number: 3,
    name: "Practice Makes Perfect",
    pages: B.BOOK_DEFS.practice_makes_perfect.pages,
    cost: B.BOOK_DEFS.practice_makes_perfect.cost,
    pageBonus: { kind: "none" },
    completionBonus: { kind: "unlockRepeatables" },
    implemented: true,
    pageDescription: "Page bonus TBD — completion unlocks Repeatable Upgrades.",
  },
  {
    id: "art_of_reading_books",
    number: 4,
    name: "The Art of Reading Books",
    pages: B.BOOK_DEFS.art_of_reading_books.pages,
    cost: B.BOOK_DEFS.art_of_reading_books.cost,
    pageBonus: { kind: "none" },
    completionBonus: {
      kind: "pageBonusMult",
      amount: B.BOOK_DEFS.art_of_reading_books.completionPageBonusMult,
    },
    implemented: true,
    pageDescription:
      "Page bonus TBD — completion makes book page bonuses 10% stronger.",
  },
  {
    id: "knowledge_101",
    number: 5,
    name: "Knowledge 101",
    pages: B.BOOK_DEFS.knowledge_101.pages,
    cost: B.BOOK_DEFS.knowledge_101.cost,
    pageBonus: {
      kind: "knowledgeAdd",
      amount: B.BOOK_DEFS.knowledge_101.knowledgeAddPerPage,
    },
    completionBonus: {
      kind: "knowledgeAdd",
      amount: B.BOOK_DEFS.knowledge_101.completionKnowledgeAdd,
    },
    implemented: true,
    pageDescription: "+0.2 Knowledge per Study per page.",
  },
  {
    id: "what_is_streaking",
    number: 6,
    name: "What is Streaking?",
    pages: B.BOOK_DEFS.what_is_streaking.pages,
    cost: B.BOOK_DEFS.what_is_streaking.cost,
    pageBonus: {
      kind: "streakBonusAdd",
      amount: B.BOOK_DEFS.what_is_streaking.streakBonusAddPerPage,
    },
    completionBonus: {
      kind: "bestStreakOutsideMult",
      percentPerBest: B.BOOK_DEFS.what_is_streaking.bestStreakOutsidePercent,
    },
    implemented: true,
    pageDescription:
      "+0.2% additional Streak Knowledge multiplier per successful Study per page.",
  },
  {
    id: "pages_are_more_powerful",
    number: 7,
    name: "Pages Are More Powerful Than You Think",
    pages: B.BOOK_DEFS.pages_are_more_powerful.pages,
    cost: B.BOOK_DEFS.pages_are_more_powerful.cost,
    pageBonus: {
      kind: "knowledgeMultAdd",
      amount: B.BOOK_DEFS.pages_are_more_powerful.knowledgeMultAddPerPage,
    },
    completionBonus: { kind: "none" },
    implemented: true,
    requiresResearchId: "even_more_books",
    pageDescription: "+0.002% Knowledge multiplier per page. Completion TBD.",
  },
  {
    id: "hundred_reasons",
    number: 8,
    name: "100 Reasons Why You Shouldn't Bother",
    pages: B.BOOK_DEFS.hundred_reasons.pages,
    cost: B.BOOK_DEFS.hundred_reasons.cost,
    pageBonus: {
      kind: "knowledgeMultAdd",
      amount: B.BOOK_DEFS.hundred_reasons.knowledgeMultAddPerPage,
    },
    completionBonus: {
      kind: "knowledgeMult",
      amount: B.BOOK_DEFS.hundred_reasons.completionKnowledgeMult,
    },
    implemented: true,
    requiresResearchId: "even_more_books",
    pageDescription: "+0.1% Knowledge per Study per page.",
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
    baseCost: B.REPEATABLE_DEFS.knowledge_multiplier.baseCost,
    costScale: B.REPEATABLE_DEFS.knowledge_multiplier.costScale,
    description: "+25% Knowledge gain per purchase.",
    effect: {
      kind: "knowledgeMultPerLevel",
      amount: B.REPEATABLE_DEFS.knowledge_multiplier.knowledgeMultPerLevel,
    },
  },
  {
    id: "rep_reading_enhancer",
    number: 2,
    name: "Reading Enhancer",
    baseCost: B.REPEATABLE_DEFS.reading_enhancer.baseCost,
    costScale: B.REPEATABLE_DEFS.reading_enhancer.costScale,
    description: "-0.25s Reading time per purchase.",
    effect: {
      kind: "readDurationFlatMsPerLevel",
      amount: B.REPEATABLE_DEFS.reading_enhancer.readFlatMsPerLevel,
    },
  },
  {
    id: "rep_critical_learner",
    number: 3,
    name: "Critical Learner",
    baseCost: B.REPEATABLE_DEFS.critical_learner.baseCost,
    costScale: B.REPEATABLE_DEFS.critical_learner.costScale,
    description: "+10% Critical Study multiplier per purchase.",
    effect: {
      kind: "critMultiplierAddPerLevel",
      amount: B.REPEATABLE_DEFS.critical_learner.critMultAddPerLevel,
    },
  },
];

export type ResearchReward =
  | { kind: "unlockKnowledgeBand"; note: string }
  | { kind: "unlockRepeatablesBand"; note: string }
  | { kind: "unlockBooksBand"; note: string }
  | { kind: "unlockMathematics" };

export interface ResearchDef {
  id: string;
  number: number;
  name: string;
  cost: number;
  description: string;
  reward: ResearchReward;
}

export const RESEARCH: ResearchDef[] = [
  {
    id: "knowledgeable_research",
    number: 1,
    name: "Knowledgeable",
    cost: B.RESEARCH_PRICES[1],
    description: "Unlock Knowledge upgrades #22–#26.",
    reward: { kind: "unlockKnowledgeBand", note: "22-26" },
  },
  {
    id: "repeat_it_twice_more",
    number: 2,
    name: "Repeat it Twice More",
    cost: B.RESEARCH_PRICES[2],
    description: "Unlock Repeatables #4–#5 (TBD — not implemented yet).",
    reward: { kind: "unlockRepeatablesBand", note: "4-5 TBD" },
  },
  {
    id: "even_more_books",
    number: 3,
    name: "Even More Books!",
    cost: B.RESEARCH_PRICES[3],
    description: "Unlock Books #7–#10 (#9–#10 TBD).",
    reward: { kind: "unlockBooksBand", note: "7-10" },
  },
  {
    id: "mega_brain",
    number: 4,
    name: "Mega Brain",
    cost: B.RESEARCH_PRICES[4],
    description: "Unlock Knowledge upgrades #27–#30.",
    reward: { kind: "unlockKnowledgeBand", note: "27-30" },
  },
  {
    id: "mathematics",
    number: 5,
    name: "Mathematics",
    cost: B.RESEARCH_PRICES[5],
    description: "Unlock first Subject: Mathematics.",
    reward: { kind: "unlockMathematics" },
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

export function getResearch(id: string): ResearchDef | undefined {
  return RESEARCH.find((r) => r.id === id);
}

export function repeatableCost(def: RepeatableUpgradeDef, level: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costScale, level));
}
