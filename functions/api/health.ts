/**
 * Cloudflare Pages Function: GET /api/health.
 *
 * Cheap liveness check. Returns the number of buyer tokens loaded and
 * whether GEMINI_API_KEY is configured (without leaking the key itself).
 */

import buyerTokensJson from '../../src/data/buyer_tokens.json';

interface BuyerEntry {
  token: string;
  user_id: number;
  regions: string[];
  credits_granted: number;
}

interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

const DEFAULT_MODEL = 'gemini-flash-lite-latest';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const tokens = (buyerTokensJson.tokens as BuyerEntry[]) ?? [];
  return new Response(
    JSON.stringify({
      ok: true,
      tokens_loaded: tokens.length,
      gemini_key_configured: !!env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL ?? DEFAULT_MODEL,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
