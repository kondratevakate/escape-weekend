# 🌌 Escape Weekend

**Niche community map for adventure-travel enthusiasts.**
Find unbeaten places — and the people who actually know them.

🌐 **Live:** auto-deployed from `main` to Cloudflare Pages
🤖 **Bot:** [@twoushka_bot](https://t.me/twoushka_bot) (`Катюшка 2 Ушка`)

---

## What is this?

Escape Weekend is a map + paid guides + AI trip-planner for people who plan their own trips and want depth over polish. It started as a Kola Peninsula guide and is growing into a multi-region atlas.

- 🗺️ **Curated map** of real, visited places — no AI-generated reviews, no SEO slop
- 📖 **Region guides** (paid) — Murmansk available, Altai & Arkhangelsk coming. ~1500₽ each
- 🧠 **AI trip-planner** — Gemini-backed assistant with a 100-credit budget per buyer
- 🔖 **Stash** — save places with the season you plan to visit
- ⚠️ **Hazards layer** — honest warnings: closed roads, dangerous treks, no-signal zones
- 🪶 **Indigenous peoples layer** — 12 ethnic groups across northern Russia
- 🍽️ **Restaurants layer** — 65+ specialty places worth a detour
- 🌌 **Seasonal logic** — "good to go this month" based on real conditions, not guesses
- 🔥 **Club** — invite-only community of niche experts (astrophotographers, hikers, kayakers, ethnographers, …) sharing routes and secret spots, [vas3k.club](https://vas3k.club)-style
- 📱 **Telegram Mini App** ready · referral mechanic for buyers

## Funnel

1. Discovery via [@twoushka_bot](https://t.me/twoushka_bot) (sales/concierge bot, Python)
2. Buyer pays for a region guide → gets a magic link with a token
3. Token unlocks gated articles + 100 AI-planner credits
4. Each buyer gets 3 share codes; a successful referral grants +50 credits to the inviter

Read [`../CLAUDE.md`](../CLAUDE.md) in the parent folder for the full product picture.

## Stack

React 18 · TypeScript 5 (strict) · Vite 5 · Tailwind CSS · shadcn/ui · Leaflet (CartoDB Positron) · react-router-dom · Vitest · Cloudflare Pages + Workers (Gemini Flash Lite proxy)

User state lives in `localStorage` for now (tokens are server-validated; credits are not — see `CLAUDE.md` open questions).

## Quickstart

Requires Node 18+ and npm (or bun).

```sh
git clone git@github.com:kondratevakate/escape-weekend.git
cd escape-weekend
npm install
npm run dev
```

Open http://localhost:5173.

### Other commands

```sh
npm run build      # production build
npm run lint       # ESLint
npm run test       # Vitest (run once)
npm run test:watch # Vitest watch mode
npm run check      # lint + typecheck + tests (run before opening a PR)
```

### Worker (LLM proxy)

The trip-planner calls a Cloudflare Worker at `workers/trip-planner.ts` (or Pages Function at `functions/`). It validates the buyer token against `src/data/buyer_tokens.json` before forwarding to Gemini.

```sh
wrangler dev          # local worker
wrangler deploy       # production
wrangler secret put GEMINI_API_KEY
```

In `.env.local`, set `VITE_LLM_PROXY_URL` to point the front-end at the Worker.

## How to contribute

Three ways, ordered from easiest to most involved:

1. **Suggest a new place** — open an issue with the [New Place template](./.github/ISSUE_TEMPLATE/new_place.md). No code needed.
2. **Report a hazard** — open an issue with the [New Hazard template](./.github/ISSUE_TEMPLATE/new_hazard.md). Help us keep people safe.
3. **Code contributions** — read [`CONTRIBUTING.md`](./CONTRIBUTING.md), pick an issue labeled `good-first-issue`, open a PR.

Before opening a PR, run `npm run check`.

## Documentation

| Doc | What it covers |
|---|---|
| [`BRAND.md`](./BRAND.md) | Mission, voice, microcopy, what we don't do |
| [`DESIGN.md`](./DESIGN.md) | Color tokens, typography, components, motion |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Code structure, data flow, conventions |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Workflow, commits, PR process |
| [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) | Community rules |
| [`SECURITY.md`](./SECURITY.md) | Reporting vulnerabilities |
| [`docs/`](./docs) | How-to guides (adding places, layers, post types, i18n, QA) |

## License

[AGPL-3.0](./LICENSE) — same spirit as [vas3k.club](https://github.com/vas3k/vas3k.club). If you fork and host it, your fork must also be open source.

## Acknowledgements

- [atlas-explorer](https://github.com/kondratevakate/atlas-explorer) — donor frontend that shaped the map, Stash, Club, and Labs scaffolding
- [vas3k.club](https://vas3k.club) — community model, AGPL inspiration
- [OpenStreetMap](https://www.openstreetmap.org) contributors — base geodata
- [CartoDB Positron](https://carto.com/basemaps/) — map tiles
- [Leaflet](https://leafletjs.com) — map engine
- [shadcn/ui](https://ui.shadcn.com) — component primitives

---

Built and curated by humans who actually go to these places.
Questions, ideas, or want to join the club? → [@twoushka_bot](https://t.me/twoushka_bot)
