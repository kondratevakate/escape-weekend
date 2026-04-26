/**
 * Dev-only Vite plugin that mirrors the Cloudflare Worker behaviour at
 * `workers/trip-planner.ts` for local testing.
 *
 * Why: wrangler isn't installed in this dev env; this plugin lets the front-end
 * call the same `/api/plan-trip` URL during `npm run dev` without spinning up
 * a separate process or paying for a deployed Worker.
 *
 * It reads GEMINI_API_KEY from one of:
 *   1. Vite's normal env loading (.env, .env.local in escape-weekend/) —
 *      variable name `LOCAL_GEMINI_API_KEY` (NOT prefixed with VITE_ so it
 *      doesn't leak into the client bundle)
 *   2. Sibling `../2ushka_telegram_bot/.env` GEMINI_API_KEY as fallback
 *      (so we don't duplicate the key across projects)
 *
 * Production goes through the Cloudflare Worker; this plugin is excluded by
 * the `apply: 'serve'` flag (i.e. dev only).
 */

import type { Plugin, Connect } from 'vite';
import type { ServerResponse, IncomingMessage } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function loadBuyerTokens(): { tokens: BuyerEntry[] } {
  try {
    const raw = readFileSync(resolve(__dirname, 'src', 'data', 'buyer_tokens.json'), 'utf8');
    return JSON.parse(raw) as { tokens: BuyerEntry[] };
  } catch {
    return { tokens: [] };
  }
}

interface BuyerEntry {
  token: string;
  user_id: number;
  regions: string[];
  credits_granted: number;
}

const DEFAULT_MODEL = 'gemini-flash-lite-latest';
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

function loadEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

function resolveGeminiKey(): string | undefined {
  // 1. Atlas-local .env.local (preferred — keeps key co-located with the project)
  const localEnv = loadEnvFile(resolve(__dirname, '.env.local'));
  if (localEnv.LOCAL_GEMINI_API_KEY) return localEnv.LOCAL_GEMINI_API_KEY;
  if (localEnv.GEMINI_API_KEY) return localEnv.GEMINI_API_KEY;

  // 2. Sibling bot's .env (fallback so we don't duplicate keys)
  const botEnv = loadEnvFile(resolve(__dirname, '..', '2ushka_telegram_bot', '.env'));
  if (botEnv.GEMINI_API_KEY) return botEnv.GEMINI_API_KEY;

  // 3. Process env (in case shell already exported it)
  return process.env.GEMINI_API_KEY ?? process.env.LOCAL_GEMINI_API_KEY;
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

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolveBody(text ? JSON.parse(text) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function devLlmProxy(): Plugin {
  // Re-read the JSON each time the plugin is created so dev restarts pick up
  // freshly-minted tokens. (Within a single dev session, edits to the JSON
  // require a server restart — fine for the beta.)
  const { tokens } = loadBuyerTokens();
  const tokenIndex = new Map<string, BuyerEntry>(
    tokens.map(t => [t.token.toLowerCase(), t]),
  );

  return {
    name: 'dev-llm-proxy',
    apply: 'serve',
    configureServer(server) {
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        if (!req.url) return next();
        const url = new URL(req.url, 'http://localhost');

        if (url.pathname === '/api/health') {
          return sendJson(res, 200, {
            ok: true,
            tokens_loaded: tokenIndex.size,
            gemini_key_configured: !!resolveGeminiKey(),
          });
        }

        if (url.pathname !== '/api/plan-trip') return next();
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end();
        }

        try {
          const payload = (await readJsonBody(req)) as {
            token?: string;
            prompt?: string;
            region?: string;
            context?: string;
          };

          const buyer = tokenIndex.get((payload.token ?? '').toLowerCase());
          if (!buyer) return sendJson(res, 401, { error: 'invalid_token' });
          if (
            payload.region &&
            !buyer.regions.includes('all') &&
            !buyer.regions.includes(payload.region)
          ) {
            return sendJson(res, 403, { error: 'region_not_unlocked' });
          }
          if (!payload.prompt || payload.prompt.trim().length < 3) {
            return sendJson(res, 400, { error: 'prompt_too_short' });
          }

          const apiKey = resolveGeminiKey();
          if (!apiKey) {
            return sendJson(res, 500, {
              error: 'no_gemini_key',
              hint: 'set LOCAL_GEMINI_API_KEY in escape-weekend/.env.local or GEMINI_API_KEY in 2ushka_telegram_bot/.env',
            });
          }

          const messages: Array<{ role: string; content: string }> = [
            { role: 'system', content: buildSystemPrompt(buyer, payload.region) },
          ];
          if (payload.context) {
            messages.push({ role: 'user', content: `Контекст:\n${payload.context}` });
          }
          messages.push({ role: 'user', content: payload.prompt });

          const upstream = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: DEFAULT_MODEL,
              messages,
              max_tokens: 1500,
              temperature: 0.6,
            }),
          });

          if (!upstream.ok) {
            const detail = await upstream.text().catch(() => '');
            return sendJson(res, 502, {
              error: 'upstream_error',
              status: upstream.status,
              detail: detail.slice(0, 300),
            });
          }

          const data = (await upstream.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
            usage?: unknown;
          };
          return sendJson(res, 200, {
            text: data.choices?.[0]?.message?.content ?? '',
            usage: data.usage ?? null,
            user_id: buyer.user_id,
          });
        } catch (e) {
          server.config.logger.error(`[dev-llm-proxy] ${(e as Error).message}`);
          return sendJson(res, 500, { error: 'plugin_exception', detail: String(e) });
        }
      };

      // Mount at root so the handler sees the full URL including /api prefix.
      // (use('/api', ...) would strip the prefix.)
      server.middlewares.use(handler);
    },
  };
}
