// src/components/ScoreDisplay.jsx
export default function ScoreDisplay({ score, level }) {
  return (
    <div
      className="fixed top-0 left-0 w-full text-center text-yellow-400 text-xs sm:text-sm font-bold py-2 px-2 z-50 pointer-events-none"
      style={{
        fontFamily: '"Press Start 2P", monospace',
        background: 'rgba(0, 0, 0, 0.85)',
      }}
    >
      PUNTUACIÓN: {score} | NIVEL: {level}
    </div>
  );
}
