import { useRef, useEffect, useState } from "react";
import GameCanvas from "./GameCanvas";
import usePlayer from "../hooks/usePlayer";
import useGameLoop from "../hooks/useGameLoop";
import usePlayerImages from "../hooks/usePlayerImages";

export default function GameLogic({ score, setScore, level, setLevel }) {
  const canvasRef = useRef(null);
  const [fallSpeed, setFallSpeed] = useState(2);
  const [player, setPlayer] = usePlayer(canvasRef);
  const { images, loaded: imagesLoaded } = usePlayerImages();
  const levelUpPending = useRef(false);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [words, setWords] = useState([]);

  const [collidedWord, setCollidedWord] = useState(null);

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasSize({ width, height });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const scale = canvasSize.width / 800;

  useEffect(() => {
   setPlayer((p) => ({
  ...p,
  width: 220 * scale,
  height: 220 * scale,
  y: canvasSize.height - 220 * scale - 24, // ← margen extra
}));
  }, [scale, canvasSize.height, setPlayer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const margin = 50; // pixeles que puede salirse

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        let newX = e.touches[0].clientX - rect.left - player.width / 2;
        // Permitir que newX vaya desde -margin hasta canvas.width - player.width + margin
        newX = Math.max(-margin, Math.min(newX, canvas.width - player.width + margin));
        setPlayer((p) => ({ ...p, x: newX }));
      }
    };

    canvas.addEventListener("touchmove", handleTouchMove);
    return () => canvas.removeEventListener("touchmove", handleTouchMove);
  }, [player.width, setPlayer]);

  const updateWords = (deltaTime) => {
    setWords((prevWords) => {
      const movedWords = prevWords
        .map((word) => ({
          ...word,
          y: word.y + fallSpeed * (level * 0.5) * deltaTime,
        }))
        .filter((word) => word.y <= canvasSize.height);

      // Si player está fuera del área visible (por izquierda o derecha), no colisiona
      if (player.x < 0 || player.x + player.width > canvasSize.width) {
        return movedWords;
      }

      const collided = movedWords.find(
        (word) =>
          word.y + word.height > player.y &&
          word.y < player.y + player.height &&
          word.x + word.width > player.x &&
          word.x < player.x + player.width
      );

      if (collided && player.state !== "leveling_up") {
        setCollidedWord(collided);
        return movedWords.filter((w) => w !== collided);
      }

      return movedWords;
    });
  };

  useEffect(() => {
    if (!collidedWord) return;

    if (collidedWord.type === "good") {
      setScore((s) => s + 10);
      setPlayer((p) => ({ ...p, state: "happy" }));
      setTimeout(() => setPlayer((p) => ({ ...p, state: "normal" })), 300);
    } else {
      setScore((s) => Math.max(0, s - 5));
      setPlayer((p) => ({ ...p, state: "angry" }));
      setTimeout(() => setPlayer((p) => ({ ...p, state: "normal" })), 300);
    }

    setCollidedWord(null);
  }, [collidedWord, setScore, setPlayer]);

  useEffect(() => {
    let timeoutId;

    const spawnWord = () => {
      const wordList = [
        { text: "sin duda", type: "good" },
        { text: "quizás", type: "bad" },
        { text: "nunca", type: "bad" },
        { text: "tal vez", type: "bad" },
        { text: "claro", type: "bad" },
      ];
      const random = wordList[Math.floor(Math.random() * wordList.length)];
      const x = Math.random() * (canvasSize.width - 100);
      setWords((prev) => [...prev, { ...random, x, y: 0, width: 100, height: 30 }]);

      const minTime = Math.max(300, 1500 - level * 100);
      const nextTime = minTime + Math.random() * 500;

      timeoutId = setTimeout(spawnWord, nextTime);
    };

    spawnWord();

    return () => clearTimeout(timeoutId);
  }, [canvasSize.width, level]);

  useEffect(() => {
    if (score >= level * 50 && !levelUpPending.current) {
      levelUpPending.current = true;
      setLevel((l) => l + 1);
      setFallSpeed((fs) => fs + 0.5);
      setPlayer((p) => ({ ...p, state: "leveling_up" }));
      setTimeout(() => {
        setPlayer((p) => ({ ...p, state: "normal" }));
        levelUpPending.current = false;
      }, 800);
    }
  }, [score, level, setLevel, setPlayer]);

  useGameLoop((deltaTime) => {
    if (imagesLoaded) {
      updateWords(deltaTime);
    }
  });

  return (
    <GameCanvas
      canvasRef={canvasRef}
      canvasWidth={canvasSize.width}
      canvasHeight={canvasSize.height}
      player={player}
      words={words}
      images={images}
      scale={scale}
    />
  );
}
