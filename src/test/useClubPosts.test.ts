import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClubPosts } from '@/hooks/useClubPosts';

describe('useClubPosts.filterAndSort', () => {
  beforeEach(() => localStorage.clear());

  it('returns all posts when no filters applied', () => {
    const { result } = renderHook(() => useClubPosts());
    expect(result.current.filterAndSort({}).length).toBe(result.current.allPosts.length);
  });

  it('filters by post type', () => {
    const { result } = renderHook(() => useClubPosts());
    const onlyRoutes = result.current.filterAndSort({ types: ['route'] });
    expect(onlyRoutes.every((p) => p.type === 'route')).toBe(true);
    expect(onlyRoutes.length).toBeGreaterThan(0);
  });

  it('filters by niche', () => {
    const { result } = renderHook(() => useClubPosts());
    // Pick an existing niche from the seed posts
    const someNiche = result.current.allPosts[0].niches[0];
    const filtered = result.current.filterAndSort({ niches: [someNiche] });
    expect(filtered.every((p) => p.niches.includes(someNiche))).toBe(true);
  });

  it('sorts by 🔥 count when sort=fire and fireMap provided', () => {
    const { result } = renderHook(() => useClubPosts());
    const fireMap: Record<string, number> = {};
    result.current.allPosts.forEach((p, i) => (fireMap[p.id] = i));
    const sorted = result.current.filterAndSort({ sort: 'fire', fireMap });
    // Highest fire count first
    expect(fireMap[sorted[0].id]).toBeGreaterThanOrEqual(fireMap[sorted[1].id]);
  });
});
