import { useState, useEffect, useCallback } from 'react';

export type PlannedSeason = 'this-winter' | 'this-spring' | 'this-summer' | 'this-autumn' | 'someday';

export interface StashItem {
  id: string;
  name: string;
  planned_season: PlannedSeason;
  saved_at: string;
}

const STORAGE_KEY = 'kola_stash';

export const SEASON_LABELS: Record<PlannedSeason, { ru: string; en: string; emoji: string }> = {
  'this-winter': { ru: 'Этой зимой', en: 'This winter', emoji: '❄️' },
  'this-spring': { ru: 'Этой весной', en: 'This spring', emoji: '🌱' },
  'this-summer': { ru: 'Этим летом', en: 'This summer', emoji: '☀️' },
  'this-autumn': { ru: 'Этой осенью', en: 'This autumn', emoji: '🍂' },
  'someday': { ru: 'Когда-нибудь', en: 'Someday', emoji: '✨' },
};

export const useStash = () => {
  const [items, setItems] = useState<StashItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save stash:', e);
    }
  }, [items]);

  const addToStash = useCallback((id: string, name: string, planned_season: PlannedSeason) => {
    setItems(prev => {
      if (prev.some(item => item.id === id)) {
        return prev.map(item => item.id === id ? { ...item, planned_season } : item);
      }
      return [...prev, { id, name, planned_season, saved_at: new Date().toISOString() }];
    });
  }, []);

  const removeFromStash = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const isInStash = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const getStashItem = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  return {
    items,
    addToStash,
    removeFromStash,
    isInStash,
    getStashItem,
    count: items.length,
  };
};
