import type { GameState } from "../game/state";

interface SubjectsPageProps {
  state: GameState;
}

/** Stage 1 endpoint stub — Mathematics unlocked; Stage 2 not implemented. */
export function SubjectsPage({ state }: SubjectsPageProps) {
  return (
    <div className="page">
      <section className="panel" aria-label="Subjects">
        <h2>Subjects</h2>
        {state.mathematicsUnlocked ? (
          <>
            <p>
              <strong>Mathematics</strong> unlocked.
            </p>
            <p className="meta">
              Stage 2 begins here. Subject gameplay is not part of v0.0.3.
            </p>
          </>
        ) : (
          <p className="meta">No subjects unlocked yet.</p>
        )}
      </section>
    </div>
  );
}
