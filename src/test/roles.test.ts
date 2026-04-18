import { describe, it, expect } from 'vitest';
import { hasCapability } from '@/types/roles';

describe('roles / hasCapability', () => {
  it('user cannot manage creators', () => {
    expect(hasCapability('user', 'manageCreators')).toBe(false);
  });

  it('admin can manage creators', () => {
    expect(hasCapability('admin', 'manageCreators')).toBe(true);
  });

  it('creator can save to stash but cannot manage creators', () => {
    expect(hasCapability('creator', 'saveToStash')).toBe(true);
    expect(hasCapability('creator', 'manageCreators')).toBe(false);
  });

  it('every role can view the map', () => {
    (['user', 'creator', 'admin'] as const).forEach((r) =>
      expect(hasCapability(r, 'viewMap')).toBe(true)
    );
  });
});
