import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

export type PlannedSeason =
  | 'this-winter'
  | 'this-spring'
  | 'this-summer'
  | 'this-autumn'
  | 'someday';

export interface StashItem {
  id: string;
  name: string;
  planned_season: PlannedSeason;
  saved_at: string;
}

export const SEASON_LABELS: Record<PlannedSeason, { ru: string; en: string; emoji: string }> = {
  'this-winter': { ru: 'Этой зимой', en: 'This winter', emoji: '❄️' },
  'this-spring': { ru: 'Этой весной', en: 'This spring', emoji: '🌱' },
  'this-summer': { ru: 'Этим летом', en: 'This summer', emoji: '☀️' },
  'this-autumn': { ru: 'Этой осенью', en: 'This autumn', emoji: '🍂' },
  someday: { ru: 'Когда-нибудь', en: 'Someday', emoji: '✨' },
};

/**
 * User's saved places (the "Stash" 🔖) with the season they plan to visit.
 * Persisted in `localStorage` under {@link STORAGE_KEYS.stash}.
 */
export const useStash = () => {
  const [items, setItems] = useLocalStorage<StashItem[]>(STORAGE_KEYS.stash, []);

  const addToStash = useCallback(
    (id: string, name: string, planned_season: PlannedSeason) => {
      setItems((prev) => {
        if (prev.some((item) => item.id === id)) {
          return prev.map((item) => (item.id === id ? { ...item, planned_season } : item));
        }
        return [...prev, { id, name, planned_season, saved_at: new Date().toISOString() }];
      });
    },
    [setItems]
  );

  const removeFromStash = useCallback(
    (id: string) => setItems((prev) => prev.filter((item) => item.id !== id)),
    [setItems]
  );

  const isInStash = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const getStashItem = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items]
  );

  return {
    items,
    addToStash,
    removeFromStash,
    isInStash,
    getStashItem,
    count: items.length,
  };
};
