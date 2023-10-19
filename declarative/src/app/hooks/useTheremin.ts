import { useCallback, useState } from "react";

export function useTheremin(maxFrequency: number) {
  const [state, setState] = useState({
    isPlaying: false,
    pitch: maxFrequency / 2,
    volume: 0,
  });
  const stop = useCallback(
    () => setState((state) => ({ ...state, isPlaying: false })),
    []
  );
  const play = useCallback(
    () => setState((state) => ({ ...state, isPlaying: true })),
    []
  );
  return { state, stop, play, setState };
}
