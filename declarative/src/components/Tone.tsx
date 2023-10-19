import { useOscillator } from "@/app/hooks/useOscillator";
import { useEffect } from "react";

interface ToneProps {
  type: OscillatorType;
  isPlaying: boolean;
  pitch: number;
  volume: number;
}

export function Tone(props: ToneProps) {
  const { type, isPlaying, pitch, volume } = props;
  const oscillator = useOscillator(isPlaying, type, 0, 0);
  useEffect(() => {
    if (isPlaying) {
      oscillator?.start();
    } else {
      oscillator?.stop();
    }
    oscillator?.setPitchAndVolume(pitch, volume);
  }, [isPlaying, pitch, volume, oscillator]);
  return null;
}
