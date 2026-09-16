import type { GameState } from "../game/state";

/** Top-level navigation tabs. Add future systems here. */
export type TabId = "study" | "library" | "research" | "subjects";

export interface TabDef {
  id: TabId;
  label: string;
  isUnlocked: (state: GameState) => boolean;
}

export const TABS: TabDef[] = [
  { id: "study", label: "Study", isUnlocked: () => true },
  {
    id: "library",
    label: "Library",
    isUnlocked: (state) => state.libraryUnlocked,
  },
  {
    id: "research",
    label: "Research",
    isUnlocked: (state) => state.researchUnlocked,
  },
  {
    id: "subjects",
    label: "Subjects",
    isUnlocked: (state) => state.mathematicsUnlocked,
  },
];

export function getUnlockedTabs(state: GameState): TabDef[] {
  return TABS.filter((tab) => tab.isUnlocked(state));
}

export function resolveActiveTab(state: GameState, requested: TabId): TabId {
  const unlocked = getUnlockedTabs(state);
  if (unlocked.some((t) => t.id === requested)) return requested;
  return unlocked[0]?.id ?? "study";
}
