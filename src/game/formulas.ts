import {
  BASE_CRIT_MULTIPLIER,
  BOOKS,
  KNOWLEDGE_UPGRADES,
  READING,
  REVEAL_WINDOW,
  REPEATABLE_UPGRADES,
  STREAK_BONUS_PER_STUDY,
  STREAK_THRESHOLD,
  STUDY,
  type BookDef,
  type KnowledgeUpgradeDef,
} from "./content";
import {
  getBookProgress,
  ownsUpgrade,
  repeatableLevel,
  type GameState,
} from "./state";

export interface StudyStats {
  durationMs: number;
  failChance: number;
  critChance: number;
  baseGrant: number;
  critMultiplier: number;
  streakMult: number;
  currentStreak: number;
}

function ownedDefs(state: GameState): KnowledgeUpgradeDef[] {
  return KNOWLEDGE_UPGRADES.filter((u) => ownsUpgrade(state, u.id));
}

function ownedBooks(state: GameState): { def: BookDef; pagesRead: number; completed: boolean }[] {
  return BOOKS.filter((b) => b.implemented && getBookProgress(state, b.id).owned).map(
    (def) => {
      const progress = getBookProgress(state, def.id);
      return { def, pagesRead: progress.pagesRead, completed: progress.completed };
    },
  );
}

export function studyDurationMs(state: GameState): number {
  let flatMs = 0;
  let divide = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "studyDurationFlatMs") flatMs += effect.amount;
      if (effect.kind === "studyDurationDivide") divide *= effect.amount;
    }
  }
  for (const { def, pagesRead } of ownedBooks(state)) {
    if (def.pageBonus.kind === "studyDurationFlatMs") {
      flatMs += def.pageBonus.amount * pagesRead;
    }
  }
  const raw = (STUDY.baseDurationMs - flatMs) / divide;
  return Math.max(STUDY.minDurationMs, raw);
}

export function readDurationMs(state: GameState): number {
  let flatMs = 0;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "readDurationFlatMs") flatMs += effect.amount;
    }
  }
  for (const { def, pagesRead } of ownedBooks(state)) {
    if (def.pageBonus.kind === "readDurationFlatMs") {
      flatMs += def.pageBonus.amount * pagesRead;
    }
  }
  for (const rep of REPEATABLE_UPGRADES) {
    const level = repeatableLevel(state, rep.id);
    if (level > 0 && rep.effect.kind === "readDurationFlatMsPerLevel") {
      flatMs += rep.effect.amount * level;
    }
  }
  return Math.max(READING.minDurationMs, READING.baseDurationMs - flatMs);
}

export function failChance(state: GameState): number {
  let chance = STUDY.baseFailChance;
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
  for (const { def, completed } of ownedBooks(state)) {
    if (completed && def.completionBonus.kind === "critChanceFlat") {
      chance += def.completionBonus.amount;
    }
  }
  return Math.max(0, Math.min(1, chance));
}

export function critReadChance(state: GameState): number {
  let chance = 0;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "critReadChance") chance += effect.amount;
    }
  }
  return Math.max(0, Math.min(1, chance));
}

export function critMultiplier(state: GameState): number {
  let mult = BASE_CRIT_MULTIPLIER;
  for (const { def, pagesRead } of ownedBooks(state)) {
    if (def.pageBonus.kind === "critMultiplierAdd") {
      mult += def.pageBonus.amount * pagesRead;
    }
  }
  for (const rep of REPEATABLE_UPGRADES) {
    const level = repeatableLevel(state, rep.id);
    if (level > 0 && rep.effect.kind === "critMultiplierAddPerLevel") {
      mult += rep.effect.amount * level;
    }
  }
  return mult;
}

function bookKnowledgeAdd(state: GameState): number {
  let add = 0;
  for (const { def, pagesRead, completed } of ownedBooks(state)) {
    if (def.pageBonus.kind === "knowledgeAdd") {
      add += def.pageBonus.amount * pagesRead;
    }
    if (completed && def.completionBonus.kind === "knowledgeAdd") {
      add += def.completionBonus.amount;
    }
  }
  return add;
}

function upgradeKnowledgeParts(state: GameState): { additive: number; mult: number } {
  let additive = 0;
  let mult = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "knowledgeAdd") additive += effect.amount;
      if (effect.kind === "knowledgeMult") mult *= effect.amount;
    }
  }
  return { additive, mult };
}

function repeatableKnowledgeMult(state: GameState): number {
  let mult = 1;
  for (const rep of REPEATABLE_UPGRADES) {
    const level = repeatableLevel(state, rep.id);
    if (level > 0 && rep.effect.kind === "knowledgeMultPerLevel") {
      mult *= Math.pow(rep.effect.amount, level);
    }
  }
  return mult;
}

/** Extra streak bonus rate from Book #6 pages. */
export function streakBonusPerStudy(state: GameState): number {
  let bonus = STREAK_BONUS_PER_STUDY;
  for (const { def, pagesRead } of ownedBooks(state)) {
    if (def.pageBonus.kind === "streakBonusAdd") {
      bonus += def.pageBonus.amount * pagesRead;
    }
  }
  return bonus;
}

/**
 * Active streak multiplier for a given streak count.
 * Bonus starts after STREAK_THRESHOLD consecutive successes.
 */
export function streakMultiplierFor(state: GameState, streak: number): number {
  if (!state.streaksUnlocked) return 1;
  const stacks = Math.max(0, streak - STREAK_THRESHOLD);
  if (stacks <= 0) return 1;
  return 1 + stacks * streakBonusPerStudy(state);
}

/** Permanent mult from Book #6 completion using all-time best streak. */
export function outsideStreakMultiplier(state: GameState): number {
  for (const { def, completed } of ownedBooks(state)) {
    if (completed && def.completionBonus.kind === "bestStreakOutsideMult") {
      return 1 + state.bestStreak * def.completionBonus.percentPerBest;
    }
  }
  return 1;
}

/**
 * Knowledge on success before crit:
 * (base + additives) * upgradeMults * repeatableMult * streakMult * outsideMult
 */
export function knowledgeGrantBeforeCrit(state: GameState, streakForBonus: number): number {
  const { additive, mult } = upgradeKnowledgeParts(state);
  const base =
    (STUDY.baseKnowledge + additive + bookKnowledgeAdd(state)) *
    mult *
    repeatableKnowledgeMult(state) *
    streakMultiplierFor(state, streakForBonus) *
    outsideStreakMultiplier(state);
  return base;
}

export function computeStudyStats(state: GameState): StudyStats {
  const previewStreak = state.streaksUnlocked
    ? state.currentStreak + 1
    : state.currentStreak;
  return {
    durationMs: studyDurationMs(state),
    failChance: failChance(state),
    critChance: critChance(state),
    baseGrant: knowledgeGrantBeforeCrit(state, previewStreak),
    critMultiplier: critMultiplier(state),
    streakMult: streakMultiplierFor(state, previewStreak),
    currentStreak: state.currentStreak,
  };
}

export function getVisibleUpgrades(state: GameState): KnowledgeUpgradeDef[] {
  return KNOWLEDGE_UPGRADES.filter((u) => !ownsUpgrade(state, u.id)).slice(
    0,
    REVEAL_WINDOW,
  );
}

export function resolveStudyOutcome(
  state: GameState,
  random = Math.random,
): {
  knowledgeGained: number;
  result: "success" | "fail" | "crit";
  nextStreak: number;
  nextBestStreak: number;
} {
  const stats = computeStudyStats(state);
  if (random() < stats.failChance) {
    return {
      knowledgeGained: 0,
      result: "fail",
      nextStreak: 0,
      nextBestStreak: state.bestStreak,
    };
  }

  const nextStreak = state.streaksUnlocked ? state.currentStreak + 1 : state.currentStreak;
  const nextBestStreak = Math.max(state.bestStreak, nextStreak);
  let grant = knowledgeGrantBeforeCrit(state, nextStreak);

  if (stats.critChance > 0 && random() < stats.critChance) {
    grant *= critMultiplier(state);
    return {
      knowledgeGained: grant,
      result: "crit",
      nextStreak,
      nextBestStreak,
    };
  }

  return {
    knowledgeGained: grant,
    result: "success",
    nextStreak,
    nextBestStreak,
  };
}

export function implementedBooks(): BookDef[] {
  return BOOKS.filter((b) => b.implemented);
}
