import {
  BASE_CRIT_MULTIPLIER,
  BOOKS,
  KNOWLEDGE_UPGRADES,
  READING,
  REVEAL_WINDOW,
  REPEATABLE_UPGRADES,
  RESEARCH,
  STREAK_BONUS_PER_STUDY,
  STREAK_THRESHOLD_DEFAULT,
  STUDY,
  type BookDef,
  type KnowledgeUpgradeDef,
  type ResearchDef,
} from "./content";
import {
  getBookProgress,
  ownsResearch,
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

function ownedBooks(state: GameState): {
  def: BookDef;
  pagesRead: number;
  completed: boolean;
}[] {
  return BOOKS.filter((b) => b.implemented && getBookProgress(state, b.id).owned).map(
    (def) => {
      const progress = getBookProgress(state, def.id);
      return { def, pagesRead: progress.pagesRead, completed: progress.completed };
    },
  );
}

/** Global multiplier on book page-bonus magnitudes (Art of Reading completion). */
export function pageBonusMagnitudeMult(state: GameState): number {
  let mult = 1;
  for (const { def, completed } of ownedBooks(state)) {
    if (completed && def.completionBonus.kind === "pageBonusMult") {
      mult *= def.completionBonus.amount;
    }
  }
  return mult;
}

function scalePageAmount(state: GameState, amount: number): number {
  return amount * pageBonusMagnitudeMult(state);
}

export function actionSpeedMult(state: GameState): number {
  let mult = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "actionSpeedMult") mult *= effect.amount;
    }
  }
  return mult;
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
      flatMs += scalePageAmount(state, def.pageBonus.amount) * pagesRead;
    }
  }
  const raw = ((STUDY.baseDurationMs - flatMs) / divide) * actionSpeedMult(state);
  return Math.max(STUDY.minDurationMs, raw);
}

export function readDurationMs(state: GameState): number {
  let flatMs = 0;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "readDurationFlatMs") flatMs += effect.amount;
    }
  }
  for (const rep of REPEATABLE_UPGRADES) {
    const level = repeatableLevel(state, rep.id);
    if (level > 0 && rep.effect.kind === "readDurationFlatMsPerLevel") {
      flatMs += rep.effect.amount * level;
    }
  }
  const raw = (READING.baseDurationMs - flatMs) * actionSpeedMult(state);
  return Math.max(READING.minDurationMs, raw);
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
      mult += scalePageAmount(state, def.pageBonus.amount) * pagesRead;
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

export function maxReadingSlots(state: GameState): number {
  let slots = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "maxReadingSlots") {
        slots = Math.max(slots, effect.amount);
      }
    }
  }
  return slots;
}

export function streakThreshold(state: GameState): number {
  let threshold = STREAK_THRESHOLD_DEFAULT;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "streakThreshold") {
        threshold = Math.min(threshold, effect.amount);
      }
    }
  }
  return threshold;
}

export function critStreakGain(state: GameState): number {
  let gain = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "critStreakGain") {
        gain = Math.max(gain, effect.amount);
      }
    }
  }
  return gain;
}

export function researchCostMult(state: GameState): number {
  let mult = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "researchCostMult") mult *= effect.amount;
    }
  }
  return mult;
}

export function researchCost(state: GameState, def: ResearchDef): number {
  return Math.floor(def.cost * researchCostMult(state));
}

function bookKnowledgeAdd(state: GameState): number {
  let add = 0;
  for (const { def, pagesRead, completed } of ownedBooks(state)) {
    if (def.pageBonus.kind === "knowledgeAdd") {
      add += scalePageAmount(state, def.pageBonus.amount) * pagesRead;
    }
    if (completed && def.completionBonus.kind === "knowledgeAdd") {
      add += def.completionBonus.amount;
    }
  }
  return add;
}

function bookKnowledgeMultAdd(state: GameState): number {
  let add = 0;
  for (const { def, pagesRead } of ownedBooks(state)) {
    if (def.pageBonus.kind === "knowledgeMultAdd") {
      add += scalePageAmount(state, def.pageBonus.amount) * pagesRead;
    }
  }
  return add;
}

function bookCompletionKnowledgeMult(state: GameState): number {
  let mult = 1;
  for (const { def, completed } of ownedBooks(state)) {
    if (completed && def.completionBonus.kind === "knowledgeMult") {
      mult *= def.completionBonus.amount;
    }
  }
  return mult;
}

function completedBookCount(state: GameState): number {
  return ownedBooks(state).filter((b) => b.completed).length;
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

function readingIsHealthyMult(state: GameState): number {
  let perBook = 1;
  for (const def of ownedDefs(state)) {
    for (const effect of def.effects) {
      if (effect.kind === "knowledgeMultPerCompletedBook") {
        perBook = effect.amount;
      }
    }
  }
  if (perBook === 1) return 1;
  return Math.pow(perBook, completedBookCount(state));
}

export function streakBonusPerStudy(state: GameState): number {
  let bonus = STREAK_BONUS_PER_STUDY;
  for (const { def, pagesRead } of ownedBooks(state)) {
    if (def.pageBonus.kind === "streakBonusAdd") {
      bonus += scalePageAmount(state, def.pageBonus.amount) * pagesRead;
    }
  }
  return bonus;
}

export function streakMultiplierFor(state: GameState, streak: number): number {
  if (!state.streaksUnlocked) return 1;
  const stacks = Math.max(0, streak - streakThreshold(state));
  if (stacks <= 0) return 1;
  return 1 + stacks * streakBonusPerStudy(state);
}

export function outsideStreakMultiplier(state: GameState): number {
  for (const { def, completed } of ownedBooks(state)) {
    if (completed && def.completionBonus.kind === "bestStreakOutsideMult") {
      return 1 + state.bestStreak * def.completionBonus.percentPerBest;
    }
  }
  return 1;
}

export function knowledgeGrantBeforeCrit(state: GameState, streakForBonus: number): number {
  const { additive, mult } = upgradeKnowledgeParts(state);
  const multAdd = bookKnowledgeMultAdd(state);
  return (
    (STUDY.baseKnowledge + additive + bookKnowledgeAdd(state)) *
    mult *
    (1 + multAdd) *
    repeatableKnowledgeMult(state) *
    streakMultiplierFor(state, streakForBonus) *
    outsideStreakMultiplier(state) *
    bookCompletionKnowledgeMult(state) *
    readingIsHealthyMult(state)
  );
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

export function isUpgradeAvailable(state: GameState, def: KnowledgeUpgradeDef): boolean {
  if (!def.requiresResearchId) return true;
  return ownsResearch(state, def.requiresResearchId);
}

/** Next unpurchased upgrades that are unlocked, limited to REVEAL_WINDOW. */
export function getVisibleUpgrades(state: GameState): KnowledgeUpgradeDef[] {
  return KNOWLEDGE_UPGRADES.filter(
    (u) => isUpgradeAvailable(state, u) && !ownsUpgrade(state, u.id),
  ).slice(0, REVEAL_WINDOW);
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

  const isCrit = stats.critChance > 0 && random() < stats.critChance;
  let nextStreak = state.currentStreak;
  if (state.streaksUnlocked) {
    nextStreak += isCrit ? critStreakGain(state) : 1;
  }
  const nextBestStreak = Math.max(state.bestStreak, nextStreak);
  let grant = knowledgeGrantBeforeCrit(state, nextStreak);
  if (isCrit) {
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

export function implementedShopBooks(state: GameState): BookDef[] {
  return BOOKS.filter((b) => {
    if (!b.implemented) return false;
    if (b.requiresResearchId && !ownsResearch(state, b.requiresResearchId)) {
      return false;
    }
    return true;
  });
}

/** Purchased research + the next unpurchased one (linear reveal). */
export function getVisibleResearch(state: GameState): ResearchDef[] {
  const owned = new Set(state.ownedResearchIds);
  const visible: ResearchDef[] = [];
  for (const def of RESEARCH) {
    if (owned.has(def.id)) {
      visible.push(def);
      continue;
    }
    visible.push(def);
    break;
  }
  return visible;
}

export function nextResearch(state: GameState): ResearchDef | undefined {
  return RESEARCH.find((r) => !ownsResearch(state, r.id));
}
