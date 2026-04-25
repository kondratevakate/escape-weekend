/**
 * Per-token credit counter, stored in localStorage. Credits are local-only
 * for the beta — anyone with DevTools can reset their counter, which is
 * acceptable for a 10–20-buyer private cohort. Promote to server-side
 * (KV/DB) before opening to a wider audience.
 *
 * Top-up reconciliation: `credits_granted` in `buyer_tokens.json` is the
 * cumulative-ever-granted total. We persist the last-seen total per token
 * separately, and any time the JSON's `credits_granted` exceeds the seen
 * value we add the delta to the buyer's available balance. This is how
 * referral bonuses flow to the inviter without a backend — we update the
 * JSON via `mint_token.py` and the buyer's next visit picks up the boost.
 */

import { lookupToken } from '@/data/buyerTokens';

const BALANCE_PREFIX = '2ushka_credits_';
const SEEN_PREFIX = '2ushka_credits_seen_';

function balanceKey(token: string): string {
  return `${BALANCE_PREFIX}${token.toLowerCase()}`;
}
function seenKey(token: string): string {
  return `${SEEN_PREFIX}${token.toLowerCase()}`;
}

function readNumber(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeNumber(key: string, value: number): void {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

/**
 * Read current available credits for a token, applying any pending top-up
 * from a `credits_granted` increase since the last visit.
 */
export function getCredits(token: string | null | undefined): number {
  if (!token) return 0;

  const buyer = lookupToken(token);
  const granted = buyer?.credits_granted ?? 0;
  const seen = readNumber(seenKey(token));

  if (seen === null) {
    // First read — seed balance to the full grant.
    writeNumber(balanceKey(token), granted);
    writeNumber(seenKey(token), granted);
    return granted;
  }

  let balance = readNumber(balanceKey(token)) ?? 0;
  if (granted > seen) {
    // Inviter earned a bonus; or admin manually topped up. Add the delta.
    const delta = granted - seen;
    balance = Math.max(0, balance + delta);
    writeNumber(balanceKey(token), balance);
    writeNumber(seenKey(token), granted);
  }
  return balance;
}

export function decrementCredits(token: string | null | undefined, by = 1): number {
  if (!token) return 0;
  const current = getCredits(token);
  const next = Math.max(0, current - by);
  writeNumber(balanceKey(token), next);
  return next;
}

export function resetCredits(token: string | null | undefined): number {
  if (!token) return 0;
  const buyer = lookupToken(token);
  const initial = buyer?.credits_granted ?? 0;
  writeNumber(balanceKey(token), initial);
  writeNumber(seenKey(token), initial);
  return initial;
}
