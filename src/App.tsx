import { useGame } from "./hooks/useGame";
import { GameScreen } from "./ui/GameScreen";
import "./App.css";

export default function App() {
  const game = useGame();

  return (
    <div className="app">
      <GameScreen
        state={game.state}
        onLearn={game.startLearn}
        onBuyUpgrade={game.buyUpgrade}
      />
      <footer className="app-footer">
        <span>Version 0.0.1 — Stage 1</span>
        <button type="button" className="link-btn" onClick={game.reset}>
          Reset
        </button>
      </footer>
    </div>
  );
}
