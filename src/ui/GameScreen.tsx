import {
  availableBooks,
  canBuyBook,
  canBuyRepeatable,
  canBuyUpgrade,
  ownedReadableBooks,
} from "../game/actions";
import {
  BOOKS,
  getBook,
  KNOWLEDGE_UPGRADES,
  PROLOGUE_FLAVOR,
  REPEATABLE_UPGRADES,
  repeatableCost,
} from "../game/content";
import {
  computeStudyStats,
  getVisibleUpgrades,
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

interface GameScreenProps {
  state: GameState;
  onStudy: () => void;
  onBuyUpgrade: (id: string) => void;
  onBuyBook: (id: string) => void;
  onStartReading: (id: string) => void;
  onBuyRepeatable: (id: string) => void;
}

function lastResultLabel(result: GameState["lastStudyResult"]): string | null {
  if (result === "fail") return "Failed — no Knowledge gained.";
  if (result === "crit") return "Critical Studying!";
  if (result === "success") return "Studied successfully.";
  return null;
}

export function GameScreen({
  state,
  onStudy,
  onBuyUpgrade,
  onBuyBook,
  onStartReading,
  onBuyRepeatable,
}: GameScreenProps) {
  const stats = computeStudyStats(state);
  const visible = getVisibleUpgrades(state);
  const studyPct = state.isStudying
    ? Math.min(1, state.studyProgressMs / stats.durationMs)
    : 0;
  const readDur = readDurationMs(state);
  const readPct = state.readingBookId
    ? Math.min(1, state.readProgressMs / readDur)
    : 0;
  const feedback = lastResultLabel(state.lastStudyResult);
  const ownedCount = state.ownedUpgradeIds.length;
  const shopBooks = availableBooks(state);
  const readable = ownedReadableBooks(state);
  const activeBook = state.readingBookId
    ? getBook(state.readingBookId)
    : undefined;
  const activeProgress = state.readingBookId
    ? getBookProgress(state, state.readingBookId)
    : undefined;

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
        {state.streaksUnlocked && (
          <div className="resource-sub">
            Streak {state.currentStreak}
            {stats.streakMult > 1
              ? ` · Knowledge ×${stats.streakMult.toFixed(2)}`
              : " (bonus after 5)"}
            {state.bestStreak > 0 ? ` · Best ${state.bestStreak}` : ""}
          </div>
        )}
      </section>

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

      <section className="panel" aria-label="Upgrades">
        <h2>Knowledge upgrades</h2>
        <p className="meta">
          Showing next {visible.length} of{" "}
          {KNOWLEDGE_UPGRADES.length - ownedCount} remaining ({ownedCount} owned)
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
              All currently designed Knowledge upgrades owned.
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

      {state.libraryUnlocked && (
        <section className="panel" aria-label="The Library">
          <h2>The Library</h2>
          <p className="meta">
            Reading takes {formatDuration(readDur)}/page and can run alongside
            Studying.
          </p>

          {shopBooks.length > 0 && (
            <>
              <h3 className="subhead">Buy books</h3>
              <ul className="upgrade-list">
                {shopBooks.map((b) => (
                  <li key={b.id} className="upgrade-row">
                    <div className="upgrade-info">
                      <strong>
                        #{b.number} {b.name}
                      </strong>
                      <span className="upgrade-desc">
                        {b.pages} pages · {b.pageDescription}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={!canBuyBook(state, b.id)}
                      onClick={() => onBuyBook(b.id)}
                    >
                      Buy ({formatNumber(b.cost)})
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {(readable.length > 0 || state.readingBookId) && (
            <>
              <h3 className="subhead">Reading</h3>
              <p className="meta">
                Read one page at a time ({formatDuration(readDur)} each).
              </p>
              {activeBook && activeProgress && (
                <div className="reading-active">
                  <strong>{activeBook.name}</strong>
                  <p className="upgrade-desc">{activeBook.pageDescription}</p>
                  <p className="meta">
                    Page {Math.min(activeProgress.pagesRead + 1, activeBook.pages)} of{" "}
                    {activeBook.pages} · {Math.floor(readPct * 100)}%
                  </p>
                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${readPct * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <ul className="upgrade-list">
                {readable.map((b) => {
                  const p = getBookProgress(state, b.id);
                  const isActive = state.readingBookId === b.id;
                  return (
                    <li key={b.id} className="upgrade-row">
                      <div className="upgrade-info">
                        <strong>{b.name}</strong>
                        <span className="upgrade-desc">{b.pageDescription}</span>
                        <span className="upgrade-desc">
                          {p.pagesRead}/{b.pages} pages read
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={!!state.readingBookId}
                        onClick={() => onStartReading(b.id)}
                      >
                        {isActive ? "Reading…" : "Read next page"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {Object.values(state.books).some((b) => b.completed) && (
            <details className="owned-details">
              <summary>Completed books</summary>
              <ul>
                {BOOKS.filter((b) => getBookProgress(state, b.id).completed).map(
                  (b) => (
                    <li key={b.id}>
                      #{b.number} {b.name}
                    </li>
                  ),
                )}
              </ul>
            </details>
          )}
        </section>
      )}

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
