import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Liked / favorited place IDs. Persisted in `localStorage`.
 * Distinct from {@link useStash} — favorites have no planned season.
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);

  const addFavorite = useCallback(
    (id: string) => setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (id: string) => setFavorites((prev) => prev.filter((fav) => fav !== id)),
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      ),
    [setFavorites]
  );

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const clearFavorites = useCallback(() => setFavorites([]), [setFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
};
