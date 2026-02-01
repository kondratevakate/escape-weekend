import { useState, useEffect, useCallback } from 'react';

const SHARES_STORAGE_KEY = 'kola_shares';

// Deterministic hash based on place ID
const getHash = (placeId: string): number => {
  return placeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

// Generate deterministic mock likes count (50-250)
const getBaseLikesCount = (placeId: string): number => {
  const hash = getHash(placeId);
  return 50 + (hash % 200);
};

// Generate deterministic mock shares count (10-80)
const getBaseSharesCount = (placeId: string): number => {
  const hash = getHash(placeId);
  return 10 + ((hash * 7) % 70);
};

// Format large numbers (e.g., 2300 -> "2.3K")
export const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

interface PlaceStats {
  likesCount: number;
  sharesCount: number;
  hasShared: boolean;
}

export const usePlaceStats = (placeId: string) => {
  const [localShares, setLocalShares] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SHARES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(SHARES_STORAGE_KEY, JSON.stringify([...localShares]));
  }, [localShares]);

  const stats: PlaceStats = {
    likesCount: getBaseLikesCount(placeId),
    sharesCount: getBaseSharesCount(placeId) + (localShares.has(placeId) ? 1 : 0),
    hasShared: localShares.has(placeId),
  };

  const recordShare = useCallback(() => {
    setLocalShares(prev => new Set([...prev, placeId]));
  }, [placeId]);

  return { stats, recordShare, formatCount };
};

// Hook for getting all stats at once (for ExploreMode)
export const useAllPlaceStats = () => {
  const [localShares, setLocalShares] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SHARES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(SHARES_STORAGE_KEY, JSON.stringify([...localShares]));
  }, [localShares]);

  const getStats = useCallback((placeId: string): PlaceStats => ({
    likesCount: getBaseLikesCount(placeId),
    sharesCount: getBaseSharesCount(placeId) + (localShares.has(placeId) ? 1 : 0),
    hasShared: localShares.has(placeId),
  }), [localShares]);

  const recordShare = useCallback((placeId: string) => {
    setLocalShares(prev => new Set([...prev, placeId]));
  }, []);

  return { getStats, recordShare, formatCount };
};
