import { useCallback } from "react";
import { useCanvas } from "./useCanvas";
import { random } from "../helpers/random";

export function useBubbleCanvas() {
  const { Canvas, getContext } = useCanvas();
  const drawBubble = useCallback(
    ({
      x,
      y,
      radius,
      size,
      g,
      b,
    }: {
      x: number;
      y: number;
      radius: number;
      size: number;
      g: number;
      b: number;
    }) => {
      getContext()!.globalAlpha = 0.2;
      for (let i = 1; i <= 15; i = i + 2) {
        getContext()!.beginPath();
        getContext()!.fillStyle = `rgb(${100 + i * 10}, ${g}, ${b})`;
        getContext()!.arc(
          x + random(0, 50) - radius,
          y + random(0, 50) - radius,
          radius / 2 + i,
          (Math.PI / 180) * 0,
          (Math.PI / 180) * 360,
          false
        );
        getContext()!.fill();
        getContext()!.closePath();
      }
    },
    [getContext]
  );
  return { Canvas, drawBubble };
}
