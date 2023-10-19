"use client";
import { useState, useCallback, MouseEvent as ReactMouseEvent } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { useTheremin } from "../hooks/useTheremin";
import { random } from "../helpers/random";
import { Tone } from "@/components/Tone";

const MAX_FREQUENCY = 6000;
const MAX_VOL = 0.3;

export default function Home() {
  const [ready, setReady] = useState(false);
  const { Canvas, getContext } = useCanvas();
  const { state, stop, play, setState } = useTheremin(MAX_FREQUENCY);

  const onMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const { top, right, left, bottom } =
        e.currentTarget.getBoundingClientRect();
      const pitch = ((e.clientX - left) / right) * MAX_FREQUENCY;
      const volume = (1 - (e.clientY - top) / bottom) * MAX_VOL;

      setState((state) => ({ ...state, pitch, volume }));

      const radius = Math.floor((volume / MAX_VOL) * 30);

      getContext()!.globalAlpha = 0.2;

      for (let i = 1; i <= 15; i = i + 2) {
        getContext()!.beginPath();
        getContext()!.fillStyle =
          "rgb(" +
          100 +
          i * 10 +
          "," +
          Math.floor((volume / MAX_VOL) * 255) +
          "," +
          Math.floor((pitch / MAX_FREQUENCY) * 255) +
          ")";
        getContext()!.arc(
          e.clientX + random(0, 50) - radius,
          e.clientY + random(0, 50) - radius,
          radius / 2 + i,
          (Math.PI / 180) * 0,
          (Math.PI / 180) * 360,
          false
        );
        getContext()!.fill();
        getContext()!.closePath();
      }
    },
    [getContext, setState]
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
      <Tone {...state} type="square" pitch={state.pitch * 0.2} />
      <Tone {...state} type="triangle" pitch={state.pitch * 0.3} />
    </Canvas>
  );
}
