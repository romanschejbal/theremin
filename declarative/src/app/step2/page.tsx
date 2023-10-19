"use client";
import { useState } from "react";
import { useOscillator } from "../hooks/useOscillator";
import { useCanvas } from "../hooks/useCanvas";
import { random } from "../helpers/random";

const MAX_FREQUENCY = 6000;
const MAX_VOL = 0.3;

export default function Home() {
  const [ready, setReady] = useState(false);

  const oscillator = useOscillator(ready, "sine", 0, 0);
  const { Canvas, getContext } = useCanvas();

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
      onMouseLeave={() => oscillator?.stop()}
      onMouseEnter={() => oscillator?.start()}
      onMouseMove={(e) => {
        const { top, right, left, bottom } =
          e.currentTarget.getBoundingClientRect();
        const pitch = ((e.clientX - left) / right) * MAX_FREQUENCY;
        const volume = (1 - (e.clientY - top) / bottom) * MAX_VOL;

        oscillator?.setPitchAndVolume(pitch, volume);

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
      }}
    ></Canvas>
  );
}
