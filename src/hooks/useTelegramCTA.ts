import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, TG_CTA_SAVE_THRESHOLD, TG_CTA_COOLDOWN_MS } from '@/lib/constants';

interface TelegramCTAState {
  saveCount: number;
  dismissed: boolean;
  lastShown: number | null;
}

const INITIAL: TelegramCTAState = { saveCount: 0, dismissed: false, lastShown: null };

/**
 * Tracks the "convert this user to the Telegram bot" CTA state.
 * Shown once the user has saved {@link TG_CTA_SAVE_THRESHOLD} places, with
 * a {@link TG_CTA_COOLDOWN_MS} cooldown between displays.
 */
export const useTelegramCTA = () => {
  const [state, setState] = useLocalStorage<TelegramCTAState>(STORAGE_KEYS.telegramCta, INITIAL);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (state.dismissed) {
      setShouldShow(false);
      return;
    }
    if (state.saveCount >= TG_CTA_SAVE_THRESHOLD) {
      const now = Date.now();
      if (!state.lastShown || now - state.lastShown > TG_CTA_COOLDOWN_MS) {
        setShouldShow(true);
      }
    }
  }, [state]);

  const recordSave = useCallback(
    () => setState((prev) => ({ ...prev, saveCount: prev.saveCount + 1 })),
    [setState]
  );

  const dismissCTA = useCallback(() => {
    setState((prev) => ({ ...prev, dismissed: true, lastShown: Date.now() }));
    setShouldShow(false);
  }, [setState]);

  const markShown = useCallback(
    () => setState((prev) => ({ ...prev, lastShown: Date.now() })),
    [setState]
  );

  const resetCTA = useCallback(() => setState(INITIAL), [setState]);

  return {
    shouldShow,
    saveCount: state.saveCount,
    recordSave,
    dismissCTA,
    markShown,
    resetCTA,
  };
};
