import { useCallback, useEffect, useState } from "react";
import {
  buyBook,
  buyRepeatable,
  buyResearch,
  buyUpgrade,
  resetGame,
  startReading,
  startStudy,
  togglePinBook,
} from "../game/actions";
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
    startStudy: () => wrap(startStudy),
    buyUpgrade: (id: string) => wrap((s) => buyUpgrade(s, id)),
    buyBook: (id: string) => wrap((s) => buyBook(s, id)),
    startReading: (id: string) => wrap((s) => startReading(s, id)),
    buyRepeatable: (id: string) => wrap((s) => buyRepeatable(s, id)),
    buyResearch: (id: string) => wrap((s) => buyResearch(s, id)),
    togglePin: (id: string) => wrap((s) => togglePinBook(s, id)),
    reset: () => setState(resetGame()),
  };
}
