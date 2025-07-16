import { useState, useEffect } from "react";

export default function usePlayer(canvasRef) {
  // Estado del jugador
  const [player, setPlayer] = useState({
    x: 360, // canvas width 800 - player width 80 / 2 = 360
    y: 510, // canvas height 600 - player height 90
    width: 80,
    height: 80,
    state: "normal", // normal, happy, angry, leveling_up
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      let newX = e.clientX - rect.left - player.width / 2;
      if (newX < 0) newX = 0;
      if (newX > canvas.width - player.width) newX = canvas.width - player.width;

      setPlayer((prev) => ({
        ...prev,
        x: newX,
      }));
    }

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [canvasRef, player.width]);

  // Funciones para cambiar estado (por ejemplo, happy o angry por un tiempo)
  // Esto se puede mejorar con timers en el hook que luego usemos en GameCanvas

  return [player, setPlayer];
}
