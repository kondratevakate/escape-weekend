# 🗺️ WoWAtlas

**Niche community map for adventure-travel enthusiasts.**
Find unbeaten places — and the people who actually know them.

🌐 **Live demo:** [wowatlas.lovable.app](https://wowatlas.lovable.app)

---

## What is this?

WoWAtlas is an open-source map + community for people who plan their own trips and want depth over polish. It started as a guide to the Kola Peninsula and is growing into a multi-region atlas with:

- 🗺️ **Curated map** of real, visited places — no AI-generated reviews, no SEO slop
- 🔖 **Stash** — save places with the season you plan to visit
- ⚠️ **Hazards layer** — honest warnings: closed roads, dangerous treks, no-signal zones
- 🪶 **Indigenous peoples layer** — 12 ethnic groups across northern Russia
- 🍽️ **Restaurants layer** — 65+ specialty places worth a detour
- 🌌 **Seasonal logic** — "good to go this month" based on real conditions, not guesses
- 🔥 **Club** — invite-only community of niche experts (astrophotographers, hikers, kayakers, ethnographers, …) sharing routes and secret spots, [vas3k.club](https://vas3k.club)-style
- 📱 **Telegram Mini App** ready

## Screenshots

> Drop screenshots in `docs/img/` and link them here.
> `![Map](./docs/img/map.png)` `![Club](./docs/img/club.png)`

## Stack

React 18 · TypeScript 5 · Vite 5 · Tailwind CSS · shadcn/ui · Leaflet (CartoDB Positron) · react-router-dom · Vitest

User state lives in `localStorage` (no backend yet — see [phase 2 plan](./.lovable/plan.md)).

## Quickstart

Requires Node 18+ and npm.

```sh
git clone https://github.com/YOUR_USERNAME/wowatlas.git
cd wowatlas
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
| [`docs/`](./docs) | How-to guides (adding places, layers, post types, i18n) |

## License

[AGPL-3.0](./LICENSE) — same spirit as [vas3k.club](https://github.com/vas3k/vas3k.club). If you fork and host it, your fork must also be open source.

## Acknowledgements

- [vas3k.club](https://vas3k.club) — community model, AGPL inspiration
- [OpenStreetMap](https://www.openstreetmap.org) contributors — base geodata
- [CartoDB Positron](https://carto.com/basemaps/) — map tiles
- [Leaflet](https://leafletjs.com) — map engine
- [shadcn/ui](https://ui.shadcn.com) — component primitives
- [Lovable](https://lovable.dev) — initial scaffolding

---

Built and curated by humans who actually go to these places.
Questions, ideas, or want to join the club? → [@twoushka_bot](https://t.me/twoushka_bot)
