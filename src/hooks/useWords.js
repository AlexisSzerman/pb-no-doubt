import { useState, useEffect, useRef } from "react";

const wordList = [
  { text: "sin duda", type: "good" },
  { text: "sin duda", type: "good" },
  { text: "sin duda", type: "good" },
  { text: "quizás", type: "bad" },
  { text: "nunca", type: "bad" },
  { text: "tal vez", type: "bad" },
  { text: "claro", type: "bad" },
  { text: "obvio", type: "bad" },
];

export default function useWords(player, canvasRef, level, fallSpeed, onWordCaught) {
  const [words, setWords] = useState([]);
  const timeSinceLastWord = useRef(0);
  const wordSpawnIntervalRef = useRef(1500);

  useEffect(() => {
    timeSinceLastWord.current = 0;
    wordSpawnIntervalRef.current = Math.max(500, 1500 - (level - 1) * 100);
  }, [level]);

  function createWord(canvasWidth) {
    const randomWordData = wordList[Math.floor(Math.random() * wordList.length)];
    const wordWidth = 100;
    const wordHeight = 30;
    const x = Math.random() * (canvasWidth - wordWidth);

    return {
      id: Date.now() + Math.random(),
      text: randomWordData.text,
      type: randomWordData.type,
      x,
      y: 0,
      width: wordWidth,
      height: wordHeight,
    };
  }

  // Actualizar palabras: movimiento y colisiones
  function updateWords(deltaTime, canvasWidth, canvasHeight) {
    timeSinceLastWord.current += deltaTime * 16.67;

    if (timeSinceLastWord.current >= wordSpawnIntervalRef.current) {
      setWords((oldWords) => [...oldWords, createWord(canvasWidth)]);
      timeSinceLastWord.current = 0;
    }

    setWords((oldWords) =>
      oldWords
        .map((word) => ({
          ...word,
          y: word.y + fallSpeed * (level * 0.5),
        }))
        .filter((word) => {
          // Colisión con jugador
          const collision =
            word.y + word.height > player.y &&
            word.y < player.y + player.height &&
            word.x + word.width > player.x &&
            word.x < player.x + player.width;

          if (collision) {
            onWordCaught(word);
            return false; // eliminar palabra atrapada
          }

          // Eliminar palabra si sale de pantalla
          return word.y <= canvasHeight;
        }),
    );
  }

  return { words, updateWords };
}
