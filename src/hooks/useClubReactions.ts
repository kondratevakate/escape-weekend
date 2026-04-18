import { useState, useCallback, useEffect } from 'react';

const KEY = 'club_fire_v1';
const COUNT_KEY = 'club_fire_counts_v1';

const load = <T>(k: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || 'null') ?? fallback; } catch { return fallback; }
};

// Seed counts so posts don't look dead
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

export const useClubReactions = () => {
  const [fired, setFired] = useState<Record<string, boolean>>(() => load(KEY, {}));
  const [counts, setCounts] = useState<Record<string, number>>(() => ({ ...SEED_COUNTS, ...load(COUNT_KEY, {}) }));

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(fired)); }, [fired]);
  useEffect(() => { localStorage.setItem(COUNT_KEY, JSON.stringify(counts)); }, [counts]);

  const toggleFire = useCallback((postId: string) => {
    setFired(prev => {
      const isOn = !!prev[postId];
      setCounts(c => ({ ...c, [postId]: Math.max(0, (c[postId] || 0) + (isOn ? -1 : 1)) }));
      const next = { ...prev };
      if (isOn) delete next[postId]; else next[postId] = true;
      return next;
    });
  }, []);

  const isFired = useCallback((postId: string) => !!fired[postId], [fired]);
  const fireCount = useCallback((postId: string) => counts[postId] || 0, [counts]);

  return { toggleFire, isFired, fireCount, counts };
};
