import {
  canBuyRepeatable,
  canBuyUpgrade,
} from "../game/actions";
import {
  getBook,
  KNOWLEDGE_UPGRADES,
  PROLOGUE_FLAVOR,
  REPEATABLE_UPGRADES,
  repeatableCost,
} from "../game/content";
import {
  computeStudyStats,
  getVisibleUpgrades,
  maxReadingSlots,
  readDurationMs,
} from "../game/formulas";
import {
  formatDuration,
  formatNumber,
  formatPercent,
} from "../game/numbers";
import {
  getBookProgress,
  ownsUpgrade,
  repeatableLevel,
  type GameState,
} from "../game/state";

interface StudyPageProps {
  state: GameState;
  onStudy: () => void;
  onBuyUpgrade: (id: string) => void;
  onBuyRepeatable: (id: string) => void;
  onStartReading: (id: string) => void;
}

function lastResultLabel(result: GameState["lastStudyResult"]): string | null {
  if (result === "fail") return "Failed — no Knowledge gained.";
  if (result === "crit") return "Critical Studying!";
  if (result === "success") return "Studied successfully.";
  return null;
}

export function StudyPage({
  state,
  onStudy,
  onBuyUpgrade,
  onBuyRepeatable,
  onStartReading,
}: StudyPageProps) {
  const stats = computeStudyStats(state);
  const visible = getVisibleUpgrades(state);
  const studyPct = state.isStudying
    ? Math.min(1, state.studyProgressMs / stats.durationMs)
    : 0;
  const feedback = lastResultLabel(state.lastStudyResult);
  const ownedCount = state.ownedUpgradeIds.length;
  const readDur = readDurationMs(state);
  const slotsFull = state.readingSessions.length >= maxReadingSlots(state);

  const pinnedReadable = state.pinnedBookIds
    .map((id) => getBook(id))
    .filter((b): b is NonNullable<typeof b> => {
      if (!b) return false;
      const p = getBookProgress(state, b.id);
      return p.owned && !p.completed;
    });

  return (
    <div className="page">
      <p className="flavor">{PROLOGUE_FLAVOR}</p>

      <section className="panel" aria-label="Actions">
        <h2>Actions</h2>
        <button
          type="button"
          className="btn"
          disabled={state.isStudying}
          onClick={onStudy}
        >
          {state.isStudying
            ? `Studying… ${Math.floor(studyPct * 100)}%`
            : `Study (+${formatNumber(stats.baseGrant)} Knowledge, ${formatDuration(stats.durationMs)})`}
        </button>
        {state.isStudying && (
          <div
            className="bar"
            role="progressbar"
            aria-valuenow={Math.floor(studyPct * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="bar-fill" style={{ width: `${studyPct * 100}%` }} />
          </div>
        )}
        <p className="meta">
          Fail chance {formatPercent(stats.failChance)}
          {stats.critChance > 0
            ? ` · Crit ${formatPercent(stats.critChance)} (×${stats.critMultiplier.toFixed(2)})`
            : ""}
        </p>
        {feedback && (
          <p className={`feedback feedback-${state.lastStudyResult}`}>{feedback}</p>
        )}
      </section>

      {pinnedReadable.length > 0 && (
        <section className="panel" aria-label="Pinned books">
          <h2>Pinned books</h2>
          <p className="meta">
            Read one page at a time ({formatDuration(readDur)}). Slots:{" "}
            {state.readingSessions.length}/{maxReadingSlots(state)}.
          </p>
          <ul className="upgrade-list">
            {pinnedReadable.map((b) => {
              const p = getBookProgress(state, b.id);
              const session = state.readingSessions.find((s) => s.bookId === b.id);
              const readPct = session
                ? Math.min(1, session.progressMs / readDur)
                : 0;
              return (
                <li key={b.id} className="upgrade-row">
                  <div className="upgrade-info">
                    <strong>{b.name}</strong>
                    <span className="upgrade-desc">{b.pageDescription}</span>
                    <span className="upgrade-desc">
                      {p.pagesRead}/{b.pages} pages
                      {session ? ` · Reading ${Math.floor(readPct * 100)}%` : ""}
                    </span>
                    {session && (
                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{ width: `${readPct * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={!!session || slotsFull}
                    onClick={() => onStartReading(b.id)}
                  >
                    {session ? "Reading…" : "Read next page"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="panel" aria-label="Upgrades">
        <h2>Knowledge upgrades</h2>
        <p className="meta">
          Showing next {visible.length} available ({ownedCount} owned)
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
            <li className="upgrade-empty">
              No more Knowledge upgrades available right now.
            </li>
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

      {state.repeatablesUnlocked && (
        <section className="panel" aria-label="Repeatable upgrades">
          <h2>Repeatable upgrades</h2>
          <ul className="upgrade-list">
            {REPEATABLE_UPGRADES.map((r) => {
              const level = repeatableLevel(state, r.id);
              const cost = repeatableCost(r, level);
              return (
                <li key={r.id} className="upgrade-row">
                  <div className="upgrade-info">
                    <strong>
                      #{r.number} {r.name}
                    </strong>
                    <span className="upgrade-desc">
                      {r.description} · Level {level}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={!canBuyRepeatable(state, r.id)}
                    onClick={() => onBuyRepeatable(r.id)}
                  >
                    Buy ({formatNumber(cost)})
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
