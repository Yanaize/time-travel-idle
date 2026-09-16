import { canBuyResearch } from "../game/actions";
import { RESEARCH } from "../game/content";
import { getVisibleResearch, researchCost } from "../game/formulas";
import { formatNumber } from "../game/numbers";
import { ownsResearch, type GameState } from "../game/state";

interface ResearchPageProps {
  state: GameState;
  onBuyResearch: (id: string) => void;
}

export function ResearchPage({ state, onBuyResearch }: ResearchPageProps) {
  const visible = getVisibleResearch(state);

  return (
    <div className="page">
      <section className="panel" aria-label="Research">
        <h2>Research</h2>
        <p className="meta">
          Linear tree — only completed Research and the next one are shown.
        </p>
        <ul className="upgrade-list">
          {visible.map((r) => {
            const owned = ownsResearch(state, r.id);
            const cost = researchCost(state, r);
            const affordable = canBuyResearch(state, r.id);
            return (
              <li key={r.id} className="upgrade-row">
                <div className="upgrade-info">
                  <strong>
                    #{r.number} {r.name}
                    {owned ? " ✓" : ""}
                  </strong>
                  <span className="upgrade-desc">{r.description}</span>
                </div>
                {owned ? (
                  <span className="meta">Done</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={!affordable}
                    onClick={() => onBuyResearch(r.id)}
                  >
                    Research ({formatNumber(cost)})
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {state.ownedResearchIds.length === RESEARCH.length && (
          <p className="meta">All Stage 1 Research complete.</p>
        )}
      </section>
    </div>
  );
}
