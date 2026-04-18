import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { ClubComment } from '@/types/club';

/**
 * Flat (single-level) comment threads on club posts.
 * Persisted in `localStorage` — phase 2 will move to Cloud.
 */
export const useClubComments = (postId?: string) => {
  const [all, setAll] = useLocalStorage<ClubComment[]>(STORAGE_KEYS.clubComments, []);

  const list = postId ? all.filter((c) => c.postId === postId) : all;

  const add = useCallback(
    (postId: string, authorName: string, text: string) => {
      const c: ClubComment = {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        postId,
        authorName,
        text,
        createdAt: new Date().toISOString(),
      };
      setAll((prev) => [...prev, c]);
    },
    [setAll]
  );

  const count = useCallback((pid: string) => all.filter((c) => c.postId === pid).length, [all]);

  return { list, add, count };
};
