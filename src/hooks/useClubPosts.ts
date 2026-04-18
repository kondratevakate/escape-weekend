import { useMemo, useState, useCallback } from 'react';
import { SEED_POSTS } from '@/data/clubPosts';
import { ClubPost, ClubPostType } from '@/types/club';

const DRAFT_KEY = 'club_user_posts_v1';

const loadUserPosts = (): ClubPost[] => {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); } catch { return []; }
};

export const useClubPosts = () => {
  const [userPosts, setUserPosts] = useState<ClubPost[]>(loadUserPosts);

  const allPosts = useMemo<ClubPost[]>(
    () => [...userPosts, ...SEED_POSTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [userPosts]
  );

  const addPost = useCallback((post: ClubPost) => {
    const next = [post, ...userPosts];
    setUserPosts(next);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  }, [userPosts]);

  const getById = useCallback((id: string) => allPosts.find(p => p.id === id), [allPosts]);

  const filterAndSort = useCallback((opts: {
    types?: ClubPostType[];
    niches?: string[];
    sort?: 'recent' | 'fire';
    fireMap?: Record<string, number>;
  }) => {
    let list = allPosts;
    if (opts.types && opts.types.length) list = list.filter(p => opts.types!.includes(p.type));
    if (opts.niches && opts.niches.length) list = list.filter(p => p.niches.some(n => opts.niches!.includes(n)));
    if (opts.sort === 'fire' && opts.fireMap) {
      list = [...list].sort((a, b) => (opts.fireMap![b.id] || 0) - (opts.fireMap![a.id] || 0));
    }
    return list;
  }, [allPosts]);

  const byPlaceId = useCallback(
    (placeId: string) => allPosts.filter(p => p.linkedPlaceIds?.includes(placeId)),
    [allPosts]
  );

  return { allPosts, addPost, getById, filterAndSort, byPlaceId };
};
