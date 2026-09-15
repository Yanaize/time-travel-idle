import { useCallback, useEffect, useState } from "react";
import { buyUpgrade, resetGame, startLearn } from "../game/actions";
import { createInitialState, type GameState } from "../game/state";
import { tick } from "../game/tick";

const TICK_MS = 50;

/** React glue only — rules live in src/game/. */
export function useGame() {
  const [state, setState] = useState<GameState>(() => createInitialState());

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((s) => tick(s));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const wrap = useCallback((fn: (s: GameState) => GameState) => {
    setState((s) => fn(s));
  }, []);

  return {
    state,
    startLearn: () => wrap(startLearn),
    buyUpgrade: (id: string) => wrap((s) => buyUpgrade(s, id)),
    reset: () => setState(resetGame()),
  };
}
