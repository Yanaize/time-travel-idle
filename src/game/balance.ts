/**
 * =============================================================================
 * BALANCE CONFIG — v0.0.3
 * =============================================================================
 * Tweak Stage 1 numbers HERE. Content definitions and formulas read from this
 * file so you do not need to hunt through UI or purchase logic.
 *
 * Source: docs/game-design-v0.0.3.md
 * Values marked TBD in the design doc are omitted (not invented).
 * =============================================================================
 */

// --- Core Study / Reading ---------------------------------------------------

/** Default Study duration in milliseconds (3s). */
export const STUDY_BASE_DURATION_MS = 3000;
/** Knowledge granted by a successful Study before upgrades/books. */
export const STUDY_BASE_KNOWLEDGE = 1;
/** Chance to fail a Study (0–1). Failure grants 0 Knowledge. */
export const STUDY_BASE_FAIL_CHANCE = 0.2;
/** Floor for Study duration after all reductions. */
export const STUDY_MIN_DURATION_MS = 100;

/** Default Reading duration per page (10s). */
export const READ_BASE_DURATION_MS = 10_000;
/** Floor for Reading duration after all reductions. */
export const READ_MIN_DURATION_MS = 100;

/** How many unpurchased Knowledge upgrades are shown at once. */
export const UPGRADE_REVEAL_WINDOW = 5;

/** Base Critical Studying multiplier (×2 = double Knowledge). */
export const CRIT_BASE_MULTIPLIER = 2;

/** Default Streak threshold: bonus starts after this many consecutive successes. */
export const STREAK_THRESHOLD_DEFAULT = 5;
/** Knowledge multiplier added per qualifying Study past the threshold (5% = 0.05). */
export const STREAK_BONUS_PER_STUDY = 0.05;

// --- Knowledge upgrades: prices ---------------------------------------------

export const UPGRADE_PRICES = {
  1: 5,
  2: 7,
  3: 10,
  4: 15,
  5: 15,
  6: 20,
  7: 22,
  8: 25,
  9: 27,
  10: 30,
  11: 40,
  12: 45,
  13: 60,
  14: 80,
  15: 120,
  16: 250,
  17: 350,
  18: 500,
  19: 1000,
  20: 1200,
  21: 1500,
  22: 2000,
  23: 3000,
  24: 5000,
  25: 7500,
  26: 10000,
  27: 15000,
  28: 25000,
  29: 50000,
  30: 75000,
} as const;

// --- Knowledge upgrades: effect magnitudes ----------------------------------

/** Flat Knowledge added per Study (Take Notes / Organized Notes). */
export const EFF_KNOWLEDGE_ADD_SMALL = 1;
/** Study time flat reduction: Improved / Very Improved / Sturdier (0.1s). */
export const EFF_STUDY_FLAT_0_1_S_MS = 100;
/** Study time flat reduction: Super Studying (0.3s). */
export const EFF_STUDY_FLAT_0_3_S_MS = 300;
/** Divide Study time by this (Even Better Studying). */
export const EFF_STUDY_DIVIDE_1_2 = 1.2;
/** Knowledge multiplicative upgrades (Better/Verified/Knowledgeable/More!). */
export const EFF_KNOWLEDGE_MULT_1_5 = 1.5;
/** Proven Sources multiplier. */
export const EFF_KNOWLEDGE_MULT_2 = 2;
/** Critical Studying base chance. */
export const EFF_CRIT_CHANCE = 0.05;
/** Tough Paper / I'm not a failure — fail chance reduction (5pp). */
export const EFF_FAIL_CHANCE_FLAT = 0.05;
/** Improved Reading (0.2s). */
export const EFF_READ_FLAT_0_2_S_MS = 200;
/** Even Better Reading (0.5s). */
export const EFF_READ_FLAT_0_5_S_MS = 500;
/** Super Reader (1s). */
export const EFF_READ_FLAT_1_S_MS = 1000;
/** Critical Reader extra-page chance. */
export const EFF_CRIT_READ_CHANCE = 0.05;
/** Consistency is Key — streak threshold after purchase. */
export const EFF_STREAK_THRESHOLD_CONSISTENCY = 4;
/** Double Reading — max simultaneous book reads. */
export const EFF_MAX_READING_SLOTS = 2;
/** Critical Streaker — streak gain on a Critical Study. */
export const EFF_CRIT_STREAK_GAIN = 2;
/** Even Faster — Study & Reading duration multiplier (10% faster → ×0.9). */
export const EFF_SPEED_MULT = 0.9;
/** Efficient Research — Research price multiplier (20% less → ×0.8). */
export const EFF_RESEARCH_COST_MULT = 0.8;
/** Reading is Healthy — Knowledge mult per completed book. */
export const EFF_KNOWLEDGE_MULT_PER_COMPLETED_BOOK = 1.5;

// --- Repeatable upgrades ----------------------------------------------------
// Cost at owned level L = floor(baseCost * costScale^L)

export const REPEATABLE_DEFS = {
  knowledge_multiplier: {
    baseCost: 150,
    costScale: 3,
    /** Multiplies Knowledge gain by this per purchase (1.25 = +25%). */
    knowledgeMultPerLevel: 1.25,
  },
  reading_enhancer: {
    baseCost: 50,
    costScale: 2,
    /** Reading time reduction per purchase (0.25s). */
    readFlatMsPerLevel: 250,
  },
  critical_learner: {
    baseCost: 150,
    costScale: 3,
    /** Added to Critical Study multiplier per purchase (+10% → +0.1). */
    critMultAddPerLevel: 0.1,
  },
} as const;

// --- Books ------------------------------------------------------------------

export const BOOK_DEFS = {
  objective_studying_method: {
    pages: 50,
    cost: 50,
    /** Study time reduction per page (0.01s). Completion bonus: TBD. */
    studyFlatMsPerPage: 10,
  },
  critical_thinking: {
    pages: 70,
    cost: 100,
    /** Critical Study multiplier add per page (+3% → +0.03). */
    critMultAddPerPage: 0.03,
    /** Completion: +5 percentage points Critical Study chance. */
    completionCritChance: 0.05,
  },
  practice_makes_perfect: {
    pages: 60,
    cost: 250,
    /** Page bonus: TBD in design — no numeric effect until designed. */
    /** Completion: unlock Repeatable Upgrades. */
  },
  art_of_reading_books: {
    pages: 30,
    cost: 750,
    /** Page bonus: TBD. */
    /** Completion: all book page bonuses × this factor (10% stronger). */
    completionPageBonusMult: 1.1,
  },
  knowledge_101: {
    pages: 50,
    cost: 1500,
    knowledgeAddPerPage: 0.2,
    completionKnowledgeAdd: 5,
  },
  what_is_streaking: {
    pages: 60,
    cost: 5000,
    /** Extra streak Knowledge mult per success per page (+0.2% → +0.002). */
    streakBonusAddPerPage: 0.002,
    /** Completion: outside-streak Knowledge mult += 1% × best streak. */
    bestStreakOutsidePercent: 0.01,
  },
  pages_are_more_powerful: {
    pages: 50,
    cost: 15_000,
    /**
     * Knowledge multiplier add per page.
     * Design: 0.002% → 0.00002 as a fractional multiplier add.
     */
    knowledgeMultAddPerPage: 0.00002,
    /** Completion: TBD. */
  },
  hundred_reasons: {
    pages: 100,
    cost: 20_000,
    /** +0.1% Knowledge per Study per page → +0.001 additive Knowledge fraction?
     * Design says "+0.1% Knowledge per Study per page" — treated as +0.001
     * flat Knowledge per Study per page (0.1% of 1 base = 0.001).
     * Actually "+0.1% Knowledge" often means multiplicative. Spec says
     * "+0.1% Knowledge per Study per page" and completion "+5% Knowledge per Study".
     * Completion +5 Knowledge/Study in book 5 style was flat; here "+5% Knowledge"
     * suggests multiplicative 1.05. For page: +0.1% per page → mult add 0.001
     * stacked as additive to a knowledge% pool, OR flat 0.001 knowledge.
     * Using knowledgeMultAdd of 0.001 per page (so 100 pages = +10% mult = ×1.10
     * if additive to mult pool as +0.001 each → total +0.1 → ×1.1).
     */
    knowledgeMultAddPerPage: 0.001,
    /** Completion: +5% Knowledge per Study → ×1.05. */
    completionKnowledgeMult: 1.05,
  },
} as const;

// --- Research ---------------------------------------------------------------

export const RESEARCH_PRICES = {
  1: 1500,
  2: 2000,
  3: 5000,
  4: 15000,
  5: 150_000,
} as const;

/** Mathematics breakthrough — endpoint of Stage 1 / v0.0.3. */
export const RESEARCH_MATHEMATICS_COST = RESEARCH_PRICES[5];
