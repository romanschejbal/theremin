import { useEffect, useMemo, useRef } from "react";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context2d = useRef<CanvasRenderingContext2D | null>(null);

  return useMemo(
    () => ({
      Canvas: function Canvas(
        canvasProps: React.CanvasHTMLAttributes<HTMLCanvasElement>
      ) {
        useEffect(() => {
          context2d.current = canvasRef.current!.getContext("2d");
        }, []);
        return <canvas ref={canvasRef} {...canvasProps}></canvas>;
      },
      getContext() {
        return context2d.current;
      },
    }),
    []
  );
}
