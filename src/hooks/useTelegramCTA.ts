import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kola_telegram_cta';
const SAVE_THRESHOLD = 3;

interface TelegramCTAState {
  saveCount: number;
  dismissed: boolean;
  lastShown: number | null;
}

export const useTelegramCTA = () => {
  const [state, setState] = useState<TelegramCTAState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { saveCount: 0, dismissed: false, lastShown: null };
    } catch {
      return { saveCount: 0, dismissed: false, lastShown: null };
    }
  });

  const [shouldShow, setShouldShow] = useState(false);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save telegram CTA state:', e);
    }
  }, [state]);

  // Check if should show CTA
  useEffect(() => {
    if (state.dismissed) {
      setShouldShow(false);
      return;
    }

    // Show after reaching threshold
    if (state.saveCount >= SAVE_THRESHOLD) {
      // Don't show more than once per session
      const lastShown = state.lastShown;
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (!lastShown || (now - lastShown) > oneHour) {
        setShouldShow(true);
      }
    }
  }, [state]);

  const recordSave = useCallback(() => {
    setState(prev => ({
      ...prev,
      saveCount: prev.saveCount + 1,
    }));
  }, []);

  const dismissCTA = useCallback(() => {
    setState(prev => ({
      ...prev,
      dismissed: true,
      lastShown: Date.now(),
    }));
    setShouldShow(false);
  }, []);

  const markShown = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastShown: Date.now(),
    }));
  }, []);

  const resetCTA = useCallback(() => {
    setState({ saveCount: 0, dismissed: false, lastShown: null });
  }, []);

  return {
    shouldShow,
    saveCount: state.saveCount,
    recordSave,
    dismissCTA,
    markShown,
    resetCTA,
  };
};
