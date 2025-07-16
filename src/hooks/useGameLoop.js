import { useEffect, useRef } from "react";

export default function useGameLoop(callback) {
  const requestIdRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    function loop(currentTime) {
      // deltaTime normalizado para que 1 = un frame a 60fps (16.67 ms)
      const deltaTime = (currentTime - lastTimeRef.current) / 16.67;
      lastTimeRef.current = currentTime;

      callback(deltaTime);

      requestIdRef.current = requestAnimationFrame(loop);
    }

    requestIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [callback]);
}
