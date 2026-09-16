import { useGame } from "./hooks/useGame";
import { GameShell } from "./ui/GameShell";
import "./App.css";

export default function App() {
  const game = useGame();

  return (
    <div className="app">
      <GameShell
        state={game.state}
        onStudy={game.startStudy}
        onBuyUpgrade={game.buyUpgrade}
        onBuyBook={game.buyBook}
        onStartReading={game.startReading}
        onBuyRepeatable={game.buyRepeatable}
        onBuyResearch={game.buyResearch}
        onTogglePin={game.togglePin}
      />
      <footer className="app-footer">
        <span>Version 0.0.3 — Stage 1</span>
        <button type="button" className="link-btn" onClick={game.reset}>
          Reset
        </button>
      </footer>
    </div>
  );
}
