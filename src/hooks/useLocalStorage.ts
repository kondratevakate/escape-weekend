import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic typed `localStorage` hook.
 *
 * Replaces the repeated load → useState → useEffect → save pattern that
 * existed in `useStash`, `useFavorites`, `useClubPosts`, etc.
 *
 * Behavior:
 * - Reads once on mount; falls back to `initialValue` on parse error.
 * - Persists on every change (best-effort; logs to console on quota errors).
 * - Supports functional updates: `setValue(prev => ...)`.
 *
 * @example
 * const [stash, setStash] = useLocalStorage<StashItem[]>(STORAGE_KEYS.stash, []);
 *
 * @param key   localStorage key (use `STORAGE_KEYS.*` from `lib/constants`)
 * @param initialValue value returned when storage is empty or unparseable
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Lazy initializer — runs once.
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Skip the very first effect — value already came from storage.
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Quota exceeded, private mode, etc. We don't crash UX.
      // eslint-disable-next-line no-console
      console.error(`[useLocalStorage] failed to persist "${key}":`, e);
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * Read a value from localStorage outside of React (utility, not a hook).
 */
export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
