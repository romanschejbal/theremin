import { useState, useEffect } from "react";

export function useQueryState<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(key);
    const value = encoded ? JSON.parse(atob(encoded)) : null;
    if (value) {
      setValue(value as any);
    }
  }, [key]);

  return [
    value,
    (value: T) => {
      setValue(value);
      const encoded = btoa(JSON.stringify(value));
      const params = new URLSearchParams(window.location.search);
      params.set(key, encoded);
      window.history.pushState({}, "", `${window.location.pathname}?${params}`);
    },
  ] as const;
}
