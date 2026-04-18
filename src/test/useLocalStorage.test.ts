import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('k1', { count: 0 }));
    expect(result.current[0]).toEqual({ count: 0 });
  });

  it('persists updates across hook instances', () => {
    const { result } = renderHook(() => useLocalStorage<number>('k2', 0));
    act(() => result.current[1](42));
    const { result: again } = renderHook(() => useLocalStorage<number>('k2', 0));
    expect(again.current[0]).toBe(42);
  });

  it('falls back to initial when stored JSON is corrupt', () => {
    localStorage.setItem('k3', '{not json');
    const { result } = renderHook(() => useLocalStorage('k3', 'safe'));
    expect(result.current[0]).toBe('safe');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage<number>('k4', 1));
    act(() => result.current[1]((n) => n + 10));
    expect(result.current[0]).toBe(11);
  });
});
