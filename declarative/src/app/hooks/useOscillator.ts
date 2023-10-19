import { useEffect, useMemo } from "react";

export function useOscillator(
  isPlaying: boolean,
  type: OscillatorType,
  pitch: number,
  volume: number
) {
  const controls = useMemo(() => {
    if (!isPlaying) return null;

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.type = type;

    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);

    oscillator.start();

    return {
      start: () => oscillator.connect(gain),
      stop: () => oscillator.disconnect(),
      setPitchAndVolume(pitch: number, volume: number) {
        oscillator.frequency.value = pitch;
        gain.gain.value = volume;
        console.log({ isPlaying, type, pitch, volume });
      },
    };
  }, [isPlaying, type]);

  useEffect(() => {
    controls?.setPitchAndVolume(pitch, volume);
    return () => controls?.stop();
  }, [pitch, volume, controls]);

  return controls;
}
