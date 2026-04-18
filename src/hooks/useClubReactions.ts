import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Seed 🔥 counts so seed posts don't look dead on first visit.
 * Real user reactions are merged on top via the `counts` state.
 */
const SEED_COUNTS: Record<string, number> = {
  'p-aurora-teriberka': 24,
  'p-route-khibiny-3day': 31,
  'p-ask-rybachy-may': 8,
  'p-meetup-aurora-night': 17,
  'p-guide-sami-respect': 42,
  'p-spot-scallops': 19,
  'p-route-skitour-aikuayvenchorr': 14,
  'p-spot-birds-kandalaksha': 11,
};

/**
 * 🔥 reactions on club posts.
 * One reaction per (user × post) — toggling removes it.
 * Counts are seeded to avoid empty-feed feeling.
 */
export const useClubReactions = () => {
  const [fired, setFired] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.clubFire, {});
  const [storedCounts, setStoredCounts] = useLocalStorage<Record<string, number>>(
    STORAGE_KEYS.clubFireCounts,
    {}
  );

  const counts = { ...SEED_COUNTS, ...storedCounts };

  const toggleFire = useCallback(
    (postId: string) => {
      setFired((prev) => {
        const isOn = !!prev[postId];
        setStoredCounts((c) => ({
          ...c,
          [postId]: Math.max(0, (c[postId] ?? SEED_COUNTS[postId] ?? 0) + (isOn ? -1 : 1)),
        }));
        const next = { ...prev };
        if (isOn) delete next[postId];
        else next[postId] = true;
        return next;
      });
    },
    [setFired, setStoredCounts]
  );

  const isFired = useCallback((postId: string) => !!fired[postId], [fired]);
  const fireCount = useCallback((postId: string) => counts[postId] || 0, [counts]);

  return { toggleFire, isFired, fireCount, counts };
};
