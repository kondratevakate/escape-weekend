import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { SEED_POSTS } from '@/data/clubPosts';
import { ClubPost, ClubPostType } from '@/types/club';

/**
 * Combines seed posts with member-created posts (in localStorage) and
 * exposes filter / sort helpers used by `ClubFeed` and `PlaceCard`.
 */
export const useClubPosts = () => {
  const [userPosts, setUserPosts] = useLocalStorage<ClubPost[]>(STORAGE_KEYS.clubUserPosts, []);

  const allPosts = useMemo<ClubPost[]>(
    () => [...userPosts, ...SEED_POSTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [userPosts]
  );

  const addPost = useCallback(
    (post: ClubPost) => setUserPosts((prev) => [post, ...prev]),
    [setUserPosts]
  );

  const getById = useCallback((id: string) => allPosts.find((p) => p.id === id), [allPosts]);

  /**
   * Filter and sort posts.
   * @param opts.types  Restrict to these post types.
   * @param opts.niches Posts must include at least one of these niche IDs.
   * @param opts.sort   `'recent'` (default) or `'fire'` — requires `fireMap`.
   * @param opts.fireMap Map of postId → 🔥 count (from `useClubReactions`).
   */
  const filterAndSort = useCallback(
    (opts: {
      types?: ClubPostType[];
      niches?: string[];
      sort?: 'recent' | 'fire';
      fireMap?: Record<string, number>;
    }) => {
      let list = allPosts;
      if (opts.types && opts.types.length) {
        list = list.filter((p) => opts.types!.includes(p.type));
      }
      if (opts.niches && opts.niches.length) {
        list = list.filter((p) => p.niches.some((n) => opts.niches!.includes(n)));
      }
      if (opts.sort === 'fire' && opts.fireMap) {
        list = [...list].sort(
          (a, b) => (opts.fireMap![b.id] || 0) - (opts.fireMap![a.id] || 0)
        );
      }
      return list;
    },
    [allPosts]
  );

  const byPlaceId = useCallback(
    (placeId: string) => allPosts.filter((p) => p.linkedPlaceIds?.includes(placeId)),
    [allPosts]
  );

  return { allPosts, addPost, getById, filterAndSort, byPlaceId };
};
