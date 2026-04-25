import tokensData from './buyer_tokens.json';

export interface BuyerToken {
  /** UUID4 hex (32 chars, no dashes). Used in `?token=...` URLs. */
  token: string;
  /** Telegram user_id this token was minted for. */
  user_id: number;
  /** Display name / @-username at time of minting. */
  username?: string;
  /** Regions this buyer has access to. `["all"]` unlocks every gated article. */
  regions: string[];
  /**
   * Cumulative-ever-granted credits total. Increases over time via referral
   * bonuses or manual top-ups. The buyer's available balance is reconciled
   * against this in localStorage on each visit (see `lib/credits.ts`).
   */
  credits_granted: number;
  /** ISO timestamp of mint time. */
  minted_at: string;
  /**
   * Up to 3 short share codes this buyer can give to friends. A friend visits
   * `?token=<inviter>&ref=<code>` to redeem. Codes that have been redeemed
   * have `used_by_user_id` set.
   */
  share_codes?: ShareCode[];
  /** ID of the buyer who referred this one (for child/friend tokens). */
  referred_by?: string;
  /** Free-text note (e.g. "paid via Yandex 2026-04-15", "friend of @x"). */
  notes?: string;
}

export interface ShareCode {
  /** Short opaque code, e.g. 8 hex chars. */
  code: string;
  /** Set when a friend has redeemed this code. */
  used_by_user_id?: number;
  /** ISO timestamp when the code was redeemed. */
  used_at?: string;
}

const ALL_TOKENS: BuyerToken[] = (tokensData.tokens as BuyerToken[]) ?? [];

const tokenIndex: Map<string, BuyerToken> = new Map(
  ALL_TOKENS.map(t => [t.token.toLowerCase(), t]),
);

export function lookupToken(token: string | null | undefined): BuyerToken | null {
  if (!token) return null;
  return tokenIndex.get(token.toLowerCase()) ?? null;
}

export function tokenGrantsRegion(token: BuyerToken, region: string): boolean {
  return token.regions.includes('all') || token.regions.includes(region);
}

export function allTokens(): BuyerToken[] {
  return ALL_TOKENS;
}
