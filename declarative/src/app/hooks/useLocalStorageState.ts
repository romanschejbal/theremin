import { useCallback, useState, useEffect } from "react";

function getValueFromLocalStorage<T>(key: string, defaultValue: T) {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
  return defaultValue;
}

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(
    typeof window === "undefined"
      ? defaultValue
      : getValueFromLocalStorage(key, defaultValue)
  );

  useEffect(() => {
    setState(getValueFromLocalStorage(key, defaultValue));
  }, [key, defaultValue]);

  const setStateWithLocalStorage = useCallback(
    (stateOrCallback: T | ((p: T) => T)) => {
      if (typeof stateOrCallback === "function") {
        setState((prev) => {
          const newState = (stateOrCallback as (prev: T) => T)(prev);
          localStorage.setItem(key, JSON.stringify(newState));
          return newState;
        });
      } else {
        localStorage.setItem(key, JSON.stringify(stateOrCallback));
        setState(stateOrCallback);
      }
    },
    [key, setState]
  );
  return [state, setStateWithLocalStorage] as const;
}
