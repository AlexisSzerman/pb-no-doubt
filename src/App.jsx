import { useState } from "react";
import GameStartScreen from "./components/GameStartScreen";
import GameLogic from "./components/GameLogic";
import ScoreDisplay from "./components/ScoreDisplay";

function App() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {!started ? (
        <GameStartScreen onStart={() => setStarted(true)} />
      ) : (
        <>
          <ScoreDisplay score={score} level={level} />
          <GameLogic score={score} setScore={setScore} level={level} setLevel={setLevel} />
        </>
      )}
    </div>
  );
}

export default App;
