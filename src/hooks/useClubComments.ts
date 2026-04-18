import { useState, useCallback, useEffect } from 'react';
import { ClubComment } from '@/types/club';

const KEY = 'club_comments_v1';

const load = (): ClubComment[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};

export const useClubComments = (postId?: string) => {
  const [all, setAll] = useState<ClubComment[]>(load);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(all)); }, [all]);

  const list = postId ? all.filter(c => c.postId === postId) : all;

  const add = useCallback((postId: string, authorName: string, text: string) => {
    const c: ClubComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      postId, authorName, text,
      createdAt: new Date().toISOString(),
    };
    setAll(prev => [...prev, c]);
  }, []);

  const count = useCallback((pid: string) => all.filter(c => c.postId === pid).length, [all]);

  return { list, add, count };
};
