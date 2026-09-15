import { canBuyUpgrade } from "../game/actions";
import { KNOWLEDGE_UPGRADES, PROLOGUE_FLAVOR } from "../game/content";
import { computeLearnStats, getVisibleUpgrades } from "../game/formulas";
import {
  formatDuration,
  formatNumber,
  formatPercent,
} from "../game/numbers";
import type { GameState } from "../game/state";
import { ownsUpgrade } from "../game/state";

interface GameScreenProps {
  state: GameState;
  onLearn: () => void;
  onBuyUpgrade: (id: string) => void;
}

function lastResultLabel(result: GameState["lastLearnResult"]): string | null {
  if (result === "fail") return "Failed — no Knowledge gained.";
  if (result === "crit") return "Critical Learning!";
  if (result === "success") return "Learned successfully.";
  return null;
}

export function GameScreen({ state, onLearn, onBuyUpgrade }: GameScreenProps) {
  const stats = computeLearnStats(state);
  const visible = getVisibleUpgrades(state);
  const learnPct = state.isLearning
    ? Math.min(1, state.learnProgressMs / stats.durationMs)
    : 0;
  const feedback = lastResultLabel(state.lastLearnResult);
  const ownedCount = state.ownedUpgradeIds.length;

  return (
    <div className="game">
      <header className="game-header">
        <h1>Time Travel Idle</h1>
        <p className="flavor">{PROLOGUE_FLAVOR}</p>
      </header>

      <section className="panel resource-panel" aria-label="Resources">
        <div className="resource">
          <span className="resource-label">Knowledge</span>
          <span className="resource-value">{formatNumber(state.knowledge)}</span>
        </div>
      </section>

      <section className="panel" aria-label="Actions">
        <h2>Actions</h2>
        <button
          type="button"
          className="btn"
          disabled={state.isLearning}
          onClick={onLearn}
        >
          {state.isLearning
            ? `Learning… ${Math.floor(learnPct * 100)}%`
            : `Learn (+${formatNumber(stats.baseGrant)} Knowledge, ${formatDuration(stats.durationMs)})`}
        </button>
        {state.isLearning && (
          <div
            className="bar"
            role="progressbar"
            aria-valuenow={Math.floor(learnPct * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="bar-fill" style={{ width: `${learnPct * 100}%` }} />
          </div>
        )}
        <p className="meta">
          Fail chance {formatPercent(stats.failChance)}
          {stats.critChance > 0
            ? ` · Crit ${formatPercent(stats.critChance)} (×${stats.critMultiplier})`
            : ""}
        </p>
        {feedback && <p className={`feedback feedback-${state.lastLearnResult}`}>{feedback}</p>}
      </section>

      <section className="panel" aria-label="Upgrades">
        <h2>Knowledge upgrades</h2>
        <p className="meta">
          Showing next {visible.length} of {KNOWLEDGE_UPGRADES.length - ownedCount} remaining
          ({ownedCount} owned)
        </p>
        <ul className="upgrade-list">
          {visible.map((u) => {
            const affordable = canBuyUpgrade(state, u.id);
            return (
              <li key={u.id} className="upgrade-row">
                <div className="upgrade-info">
                  <strong>
                    #{u.number} {u.name}
                  </strong>
                  <span className="upgrade-desc">{u.description}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={!affordable}
                  onClick={() => onBuyUpgrade(u.id)}
                >
                  Buy ({formatNumber(u.cost)})
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="upgrade-empty">All designed Knowledge upgrades owned.</li>
          )}
        </ul>
        {ownedCount > 0 && (
          <details className="owned-details">
            <summary>Owned upgrades</summary>
            <ul>
              {KNOWLEDGE_UPGRADES.filter((u) => ownsUpgrade(state, u.id)).map(
                (u) => (
                  <li key={u.id}>
                    #{u.number} {u.name}
                  </li>
                ),
              )}
            </ul>
          </details>
        )}
      </section>

      {state.libraryUnlocked && (
        <section className="panel" aria-label="The Library">
          <h2>The Library</h2>
          <p className="meta">
            Unlocked. Books are designed next — reading is not available in
            v0.0.1.
          </p>
        </section>
      )}
    </div>
  );
}
