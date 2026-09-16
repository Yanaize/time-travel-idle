import {
  availableBooks,
  canBuyBook,
  ownedReadableBooks,
} from "../game/actions";
import { BOOKS } from "../game/content";
import { maxReadingSlots, readDurationMs } from "../game/formulas";
import { formatDuration, formatNumber } from "../game/numbers";
import { getBookProgress, type GameState } from "../game/state";

interface LibraryPageProps {
  state: GameState;
  onBuyBook: (id: string) => void;
  onStartReading: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function LibraryPage({
  state,
  onBuyBook,
  onStartReading,
  onTogglePin,
}: LibraryPageProps) {
  const readDur = readDurationMs(state);
  const shopBooks = availableBooks(state);
  const readable = ownedReadableBooks(state);
  const slotsFull = state.readingSessions.length >= maxReadingSlots(state);

  return (
    <div className="page">
      <section className="panel" aria-label="The Library">
        <h2>The Library</h2>
        <p className="meta">
          Reading takes {formatDuration(readDur)}/page and can run alongside
          Studying. Reading slots: {state.readingSessions.length}/
          {maxReadingSlots(state)}.
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

        {(readable.length > 0 || state.readingSessions.length > 0) && (
          <>
            <h3 className="subhead">Reading</h3>
            <p className="meta">
              Read one page at a time ({formatDuration(readDur)} each).
            </p>
            <ul className="upgrade-list">
              {readable.map((b) => {
                const p = getBookProgress(state, b.id);
                const session = state.readingSessions.find(
                  (s) => s.bookId === b.id,
                );
                const readPct = session
                  ? Math.min(1, session.progressMs / readDur)
                  : 0;
                const pinned = state.pinnedBookIds.includes(b.id);
                return (
                  <li key={b.id} className="upgrade-row">
                    <div className="upgrade-info">
                      <strong>{b.name}</strong>
                      <span className="upgrade-desc">{b.pageDescription}</span>
                      <span className="upgrade-desc">
                        {p.pagesRead}/{b.pages} pages read
                        {session
                          ? ` · Reading ${Math.floor(readPct * 100)}%`
                          : ""}
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
                    <div className="upgrade-actions">
                      {state.bookPinningUnlocked && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => onTogglePin(b.id)}
                        >
                          {pinned ? "Unpin" : "Pin"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={!!session || slotsFull}
                        onClick={() => onStartReading(b.id)}
                      >
                        {session ? "Reading…" : "Read next page"}
                      </button>
                    </div>
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
    </div>
  );
}
