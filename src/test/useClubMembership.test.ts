import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClubMembership } from '@/hooks/useClubMembership';

describe('useClubMembership', () => {
  beforeEach(() => localStorage.clear());

  it('starts with status "none"', () => {
    const { result } = renderHook(() => useClubMembership());
    expect(result.current.status).toBe('none');
  });

  it('moves to "pending" after submitting an application', () => {
    const { result } = renderHook(() => useClubMembership());
    act(() =>
      result.current.submitApplication({
        name: 'Test',
        contact: '@test',
        niches: ['hiking'],
        whyJoin: 'because',
      })
    );
    expect(result.current.status).toBe('pending');
    expect(result.current.app.name).toBe('Test');
    expect(result.current.app.submittedAt).toBeTruthy();
  });

  it('reset() returns to "none"', () => {
    const { result } = renderHook(() => useClubMembership());
    act(() =>
      result.current.submitApplication({
        name: 'X',
        contact: 'x',
        niches: ['photo'],
        whyJoin: 'y',
      })
    );
    act(() => result.current.reset());
    expect(result.current.status).toBe('none');
  });
});
