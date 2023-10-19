import { useEffect, useCallback, useRef, useState } from "react";

export function useScrollToBottom<T extends HTMLElement>(
  thresholdPX = (el: HTMLElement) => el.clientHeight / 2
) {
  const elementRef = useRef<T>(null);
  const [scrolled, setScrolled] = useState<number | null>(null);
  const initialised = useRef(false);
  const scrollToBottom = useCallback(() => {
    elementRef.current?.scrollTo({
      behavior: "smooth",
      top: elementRef.current.scrollHeight - elementRef.current.clientHeight,
    });
  }, []);

  useEffect(() => {
    const element = elementRef.current!;
    const onScroll = function () {
      const { clientHeight, scrollTop, scrollHeight } = element;
      if (
        Math.ceil(scrollHeight - clientHeight) >=
        Math.ceil(scrollTop + thresholdPX(element))
      ) {
        setScrolled(
          Math.ceil(
            scrollHeight - clientHeight - scrollTop - thresholdPX(element)
          )
        );
      } else {
        setScrolled(null);
      }
    };

    const { clientHeight, scrollHeight } = element;
    if (scrolled === null && initialised.current) {
      element.scrollTo({
        behavior: "smooth",
        top: scrollHeight - clientHeight,
      });
    }

    element.addEventListener("scroll", onScroll);
    return () => {
      element.removeEventListener("scroll", onScroll);
    };
  });

  useEffect(() => {
    const id = setTimeout(() => {
      const { clientHeight, scrollHeight } = elementRef.current!;
      elementRef.current!.scrollTo({
        behavior: "instant" as any,
        top: scrollHeight - clientHeight,
      });
      initialised.current = true;
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return { elementRef, scrolled, scrollToBottom };
}
