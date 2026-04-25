/**
 * Front-end client for the trip-planner Worker. Returns a structured result
 * or throws an error tagged with a stable code so the caller can decide
 * whether to fall back to the local mock.
 *
 * Configure VITE_LLM_PROXY_URL in `.env.local`:
 *   VITE_LLM_PROXY_URL=https://atlas-trip-planner.<your-subdomain>.workers.dev
 * Or for local Worker dev:
 *   VITE_LLM_PROXY_URL=http://localhost:8787
 *
 * If the env var is missing the helper returns `{ available: false }` so
 * pages can render their offline mock.
 */

const PROXY_URL: string | undefined = import.meta.env.VITE_LLM_PROXY_URL as string | undefined;

export interface PlanTripRequest {
  token: string;
  prompt: string;
  region?: string;
  context?: string;
}

export interface PlanTripResponse {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  } | null;
  user_id?: number;
}

export class LLMUnavailableError extends Error {
  code: 'no_proxy_configured' | 'network';
  constructor(code: 'no_proxy_configured' | 'network', message: string) {
    super(message);
    this.code = code;
    this.name = 'LLMUnavailableError';
  }
}

export class LLMRequestError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'LLMRequestError';
  }
}

export function isLLMConfigured(): boolean {
  return !!PROXY_URL;
}

export async function planTrip(req: PlanTripRequest): Promise<PlanTripResponse> {
  if (!PROXY_URL) {
    throw new LLMUnavailableError(
      'no_proxy_configured',
      'VITE_LLM_PROXY_URL is not set. Front-end will fall back to local mock.',
    );
  }

  let resp: Response;
  try {
    resp = await fetch(`${PROXY_URL.replace(/\/$/, '')}/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  } catch (e) {
    throw new LLMUnavailableError('network', `Network error: ${(e as Error).message}`);
  }

  if (!resp.ok) {
    let body: { error?: string } = {};
    try {
      body = (await resp.json()) as { error?: string };
    } catch {
      // ignore
    }
    throw new LLMRequestError(
      body.error ?? 'unknown',
      resp.status,
      `Worker returned ${resp.status}${body.error ? `: ${body.error}` : ''}`,
    );
  }

  return (await resp.json()) as PlanTripResponse;
}
