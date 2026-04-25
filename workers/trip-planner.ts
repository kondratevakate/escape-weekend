/**
 * Cloudflare Worker that proxies AI trip-planner requests to Google Gemini
 * (via the OpenAI-compatible endpoint at generativelanguage.googleapis.com).
 *
 * Why a Worker (vs calling Gemini from the browser directly): the API key
 * must not ship in the JS bundle. The Worker holds the secret and validates
 * the buyer token before forwarding.
 *
 * Deploy:
 *   cd atlas-explorer
 *   npm install -g wrangler  # one-time
 *   wrangler login            # one-time
 *   wrangler secret put GEMINI_API_KEY   # paste the AI Studio key
 *   wrangler deploy
 *
 * Local dev:
 *   wrangler dev               # runs on http://localhost:8787
 *
 * The front-end calls VITE_LLM_PROXY_URL/plan-trip (configured in .env).
 */

import buyerTokensJson from '../src/data/buyer_tokens.json';

interface BuyerEntry {
  token: string;
  user_id: number;
  regions: string[];
  credits_granted: number;
}

interface PlanRequest {
  token: string;
  prompt: string;
  region?: string;
  context?: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Env {
  GEMINI_API_KEY: string;
  /** Optional model override; default below. */
  GEMINI_MODEL?: string;
}

// `gemini-flash-lite-latest` empirically returns concrete Russian itineraries
// in ~3–4s. Pricing tier: $0.10 input / $0.40 output per 1M tokens (Gemini
// 2.5 Flash-Lite). A typical 1-shot trip plan is ~80 in + ~700 out tokens
// (~$0.0003 per call), so 100 credits/buyer ≈ 3¢ in API spend.
//
// Avoid `gemini-2.5-pro` and `gemini-2.5-flash` as defaults: they are
// "thinking" models that consume max_tokens on hidden chain-of-thought and
// can return empty `content` at moderate budgets.
const DEFAULT_MODEL = 'gemini-flash-lite-latest';
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

const ALLOWED_ORIGINS = [
  'https://atlas.2ushka.com',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:4173',
];

const tokenIndex: Map<string, BuyerEntry> = new Map(
  (buyerTokensJson.tokens as BuyerEntry[]).map(t => [t.token.toLowerCase(), t]),
);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonResponse(body: unknown, init: ResponseInit, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
      ...(init.headers ?? {}),
    },
  });
}

function buildSystemPrompt(buyer: BuyerEntry, region?: string): string {
  return [
    'Ты эксперт по путешествиям на Кольский полуостров (Мурманск) и Алтай. Отвечай по-русски, тёпло и кратко, если пользователь не переключился на английский.',
    `Регионы доступа: ${buyer.regions.join(', ')}.${region ? ` Текущий фокус: ${region}.` : ''}`,
    'Опирайся на курируемые знания Кати:',
    '- Мурманск: пик северного сияния — ноябрь–февраль; киты — ноябрь–январь в Баренцевом море; любимый маршрут на 3 ночи: Кировск → арт-санаторий → охота за сиянием → снегоходы.',
    '- Териберка перегружена туристами — предлагай тихие альтернативы там, где это уместно.',
    '- Ошибки новичков: ехать только в Териберку, не бронировать заранее, идти за сиянием без гида, недостаточно тёплая одежда (зимой −15…−25).',
    '- Бюджет на 2 человек / 3 дня без перелёта: жильё 5–15к₽/ночь, еда 3–5к₽/день, активности 5–15к₽; итого 30–60к₽.',
    '- Вика — эксперт по Мурманску, ведёт группы; мы отправили к ней 10+ человек.',
    'Когда пользователь просит маршрут — возвращай день-за-днём с конкретными местами, временем и одним предупреждением на день там, где это полезно. Используй простой текст и markdown без громоздких заголовков (только **жирный** и списки).',
    'Никогда не выдумывай цены, контакты или гидов, которых нет в этом контексте.',
  ].join('\n');
}

async function handlePlanTrip(req: Request, env: Env): Promise<Response> {
  const origin = req.headers.get('Origin');

  let payload: PlanRequest;
  try {
    payload = (await req.json()) as PlanRequest;
  } catch {
    return jsonResponse({ error: 'invalid_json' }, { status: 400 }, origin);
  }

  const buyer = tokenIndex.get((payload.token ?? '').toLowerCase());
  if (!buyer) {
    return jsonResponse({ error: 'invalid_token' }, { status: 401 }, origin);
  }

  if (
    payload.region &&
    !buyer.regions.includes('all') &&
    !buyer.regions.includes(payload.region)
  ) {
    return jsonResponse({ error: 'region_not_unlocked' }, { status: 403 }, origin);
  }

  if (!payload.prompt || payload.prompt.trim().length < 3) {
    return jsonResponse({ error: 'prompt_too_short' }, { status: 400 }, origin);
  }
  if (payload.prompt.length > 4000) {
    return jsonResponse({ error: 'prompt_too_long' }, { status: 400 }, origin);
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystemPrompt(buyer, payload.region) },
  ];
  if (payload.context) {
    messages.push({ role: 'user', content: `Контекст:\n${payload.context}` });
  }
  messages.push({ role: 'user', content: payload.prompt });

  const upstream = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.GEMINI_MODEL ?? DEFAULT_MODEL,
      messages,
      max_tokens: 1500,
      temperature: 0.6,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return jsonResponse(
      { error: 'upstream_error', status: upstream.status, detail: detail.slice(0, 300) },
      { status: 502 },
      origin,
    );
  }

  const data = (await upstream.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: unknown;
  };
  const text = data.choices?.[0]?.message?.content ?? '';

  return jsonResponse(
    { text, usage: data.usage ?? null, user_id: buyer.user_id },
    { status: 200 },
    origin,
  );
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get('Origin');

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(req.url);
    if (url.pathname === '/plan-trip' && req.method === 'POST') {
      return handlePlanTrip(req, env);
    }
    if (url.pathname === '/health' && req.method === 'GET') {
      return jsonResponse(
        { ok: true, tokens_loaded: tokenIndex.size, model: env.GEMINI_MODEL ?? DEFAULT_MODEL },
        { status: 200 },
        origin,
      );
    }
    return jsonResponse({ error: 'not_found' }, { status: 404 }, origin);
  },
};
