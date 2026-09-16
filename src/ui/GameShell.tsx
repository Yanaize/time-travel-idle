import { useState } from "react";
import { computeStudyStats } from "../game/formulas";
import { formatNumber } from "../game/numbers";
import type { GameState } from "../game/state";
import { LibraryPage } from "./LibraryPage";
import { ResearchPage } from "./ResearchPage";
import { StudyPage } from "./StudyPage";
import { SubjectsPage } from "./SubjectsPage";
import { TabNav } from "./TabNav";
import { getUnlockedTabs, resolveActiveTab, type TabId } from "./tabs";

interface GameShellProps {
  state: GameState;
  onStudy: () => void;
  onBuyUpgrade: (id: string) => void;
  onBuyBook: (id: string) => void;
  onStartReading: (id: string) => void;
  onBuyRepeatable: (id: string) => void;
  onBuyResearch: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function GameShell({
  state,
  onStudy,
  onBuyUpgrade,
  onBuyBook,
  onStartReading,
  onBuyRepeatable,
  onBuyResearch,
  onTogglePin,
}: GameShellProps) {
  const [requestedTab, setRequestedTab] = useState<TabId>("study");
  const activeTab = resolveActiveTab(state, requestedTab);
  const tabs = getUnlockedTabs(state);
  const stats = computeStudyStats(state);

  return (
    <div className="game">
      <header className="game-header">
        <h1>Time Travel Idle</h1>
      </header>

      <section className="panel resource-panel" aria-label="Resources">
        <div className="resource">
          <span className="resource-label">Knowledge</span>
          <span className="resource-value">{formatNumber(state.knowledge)}</span>
        </div>
        {state.streaksUnlocked && (
          <div className="resource-sub">
            Streak {state.currentStreak}
            {stats.streakMult > 1
              ? ` · Knowledge ×${stats.streakMult.toFixed(2)}`
              : " (bonus after threshold)"}
            {state.bestStreak > 0 ? ` · Best ${state.bestStreak}` : ""}
          </div>
        )}
      </section>

      <TabNav tabs={tabs} activeTab={activeTab} onSelect={setRequestedTab} />

      {activeTab === "study" && (
        <StudyPage
          state={state}
          onStudy={onStudy}
          onBuyUpgrade={onBuyUpgrade}
          onBuyRepeatable={onBuyRepeatable}
          onStartReading={onStartReading}
        />
      )}
      {activeTab === "library" && (
        <LibraryPage
          state={state}
          onBuyBook={onBuyBook}
          onStartReading={onStartReading}
          onTogglePin={onTogglePin}
        />
      )}
      {activeTab === "research" && (
        <ResearchPage state={state} onBuyResearch={onBuyResearch} />
      )}
      {activeTab === "subjects" && <SubjectsPage state={state} />}
    </div>
  );
}
