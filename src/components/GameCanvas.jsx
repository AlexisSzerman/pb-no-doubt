// src/components/GameCanvas.jsx
import { useEffect } from "react";

export default function GameCanvas({ canvasRef, canvasWidth, canvasHeight, player, words, images, scale }) {
  useEffect(() => {
    if (!canvasRef.current || !images.normal) return;
    const ctx = canvasRef.current.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const img = images[player.state] || images.normal;
      ctx.drawImage(img, player.x, player.y, player.width, player.height);

      ctx.font = `${20 * scale}px 'Press Start 2P'`;
      ctx.textAlign = "center";
      words.forEach((word) => {
        ctx.fillStyle = word.type === "good" ? "lime" : "red";
        ctx.fillText(word.text.toUpperCase(), word.x + word.width / 2, word.y + word.height / 2);
      });
    };

    draw();
  }, [canvasRef, canvasWidth, canvasHeight, player, words, images, scale]);

  if (canvasWidth === 0 || canvasHeight === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="block mx-auto border-4 border-yellow-500 bg-black touch-none w-full h-full"
    />
  );
}
