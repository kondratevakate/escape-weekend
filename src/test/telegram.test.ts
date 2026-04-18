import { describe, it, expect } from 'vitest';
import { buildBotUrl } from '@/lib/telegram';
import { TG_BOT_USERNAME } from '@/lib/constants';

describe('telegram / buildBotUrl', () => {
  it('builds a base bot URL when no payload is passed', () => {
    expect(buildBotUrl()).toBe(`https://t.me/${TG_BOT_USERNAME}`);
  });

  it('appends an encoded start param when given', () => {
    expect(buildBotUrl(TG_BOT_USERNAME, 'club_123')).toBe(
      `https://t.me/${TG_BOT_USERNAME}?start=club_123`
    );
  });

  it('encodes special characters in the start param', () => {
    expect(buildBotUrl(TG_BOT_USERNAME, 'a b/c')).toContain('start=a%20b%2Fc');
  });

  it('uses the supplied bot username', () => {
    expect(buildBotUrl('SomeOtherBot', 'x')).toBe('https://t.me/SomeOtherBot?start=x');
  });
});
