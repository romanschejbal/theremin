"use client";
import { useState, useCallback, MouseEvent as ReactMouseEvent } from "react";
import { useBubbleCanvas } from "../hooks/useBubbleCanvas";
import { useTheremin } from "../hooks/useTheremin";
import { Tone } from "@/components/Tone";

const MAX_FREQUENCY = 6000;
const MAX_VOL = 0.3;

export default function Home() {
  const [ready, setReady] = useState(false);
  const { Canvas, drawBubble } = useBubbleCanvas();
  const { state, stop, play, setState } = useTheremin(MAX_FREQUENCY);

  const onMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>) => {
      // Time starts here
      const { top, right, left, bottom } =
        e.currentTarget.getBoundingClientRect();
      const pitch = (e.clientX - left) / right;
      const volume = 1 - (e.clientY - top) / bottom;
      const radius = Math.floor(volume * 30);

      setState((state) => ({
        ...state,
        pitch: pitch * MAX_FREQUENCY,
        volume: volume * MAX_VOL,
      }));
      drawBubble({
        x: e.clientX,
        y: e.clientY,
        radius,
        size: 15,
        g: Math.floor(volume * 255),
        b: Math.floor(pitch * 255),
      });
      // Time ends here
    },
    [setState, drawBubble]
  );

  if (!ready) {
    return (
      <div className="absolute inset-0 flex justify-center items-center text-4xl">
        <button onClick={() => setReady(true)}>Start</button>
      </div>
    );
  }

  return (
    <Canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseLeave={stop}
      onMouseEnter={play}
      onMouseMove={onMouseMove}
    >
      <Tone {...state} type="sine" />
      <Tone {...state} type="square" pitch={state.pitch * 0.3} />
      <Tone {...state} type="triangle" pitch={state.pitch * 0.6} />
    </Canvas>
  );
}
