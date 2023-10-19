import { useRef, useEffect } from "react";

export function useSound(url: string) {
  const audio = useRef<HTMLAudioElement>();
  useEffect(() => {
    audio.current = new Audio(url);
  }, [url]);

  return () => audio.current?.play();
}
