"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { random } from "../helpers/random";

const MAX_FREQUENCY = 6000;
const MAX_VOL = 0.3;

export default function Home() {
  const [ready, setReady] = useState(false);

  const [oscillator, gain] = useMemo(() => {
    if (!ready) return [];

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0;
    oscillator.start();
    return [oscillator, gain];
  }, [ready]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context2d = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    context2d.current = canvasRef.current.getContext("2d");
  }, [ready]);

  if (!ready) {
    return (
      <div className="absolute inset-0 flex justify-center items-center text-4xl">
        <button onClick={() => setReady(true)}>Start</button>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseLeave={() => (gain!.gain.value = 0)}
      onMouseMove={(e) => {
        const { top, right, left, bottom } =
          e.currentTarget.getBoundingClientRect();
        const pitch = ((e.clientX - left) / right) * MAX_FREQUENCY;
        const volume = (1 - (e.clientY - top) / bottom) * MAX_VOL;

        oscillator!.frequency.value = pitch;
        gain!.gain.value = volume;

        const radius = Math.floor((gain!.gain.value / MAX_VOL) * 30);

        context2d.current!.globalAlpha = 0.2;

        for (let i = 1; i <= 15; i = i + 2) {
          context2d.current!.beginPath();
          context2d.current!.fillStyle =
            "rgb(" +
            100 +
            i * 10 +
            "," +
            Math.floor((gain!.gain.value / MAX_VOL) * 255) +
            "," +
            Math.floor((oscillator!.frequency.value / MAX_FREQUENCY) * 255) +
            ")";
          context2d.current!.arc(
            e.clientX + random(0, 50) - radius,
            e.clientY + random(0, 50) - radius,
            radius / 2 + i,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
          );
          context2d.current!.fill();
          context2d.current!.closePath();
        }
      }}
    ></canvas>
  );
}
