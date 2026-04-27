# Contributing to WoWAtlas

Thank you for considering a contribution. This project survives because real people add real places, real warnings, and real code. No AI slop, no fake content.

Before contributing, please read [`BRAND.md`](./BRAND.md) (voice & values) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

---

## Ways to contribute

### 1. Suggest a place (no code needed)
Open an issue using the [New Place template](./.github/ISSUE_TEMPLATE/new_place.md). Provide:
- Coordinates (lat, lon — get them by right-clicking in [openstreetmap.org](https://www.openstreetmap.org))
- A 1–3 sentence description from your own visit (no copy-paste from Wikipedia)
- The best months to visit and why
- One real photo if you have one (Telegram link or attachment)

### 2. Report a hazard (no code needed)
Open an issue using the [New Hazard template](./.github/ISSUE_TEMPLATE/new_hazard.md). We need: location, what happened (or what could), source link, dates if seasonal.

### 3. Translate
We're bilingual RU/EN. To add a third language, see [`docs/i18n.md`](./docs/i18n.md). **Never machine-translate** — the brand voice depends on humans.

### 4. Code

Pick an issue labeled `good-first-issue` or open a discussion first if it's a substantial change.

---

## Development setup

```sh
git clone https://github.com/YOUR_USERNAME/wowatlas.git
cd wowatlas
npm install
npm run dev
```

Before opening a PR:

```sh
npm run check    # lint + typecheck + tests
```

---

## Branches & commits

- **Branch from `main`.** Name your branch `feat/short-thing`, `fix/short-thing`, `docs/short-thing`.
- **Commits follow [Conventional Commits](https://www.conventionalcommits.org/):**
  - `feat: add hazard for kola tundra trek`
  - `fix: prevent stash dup on rapid double-tap`
  - `docs: clarify map layer steps`
  - `refactor: unify localStorage hooks`
  - `test: cover useClubPosts filter`
  - `chore: bump leaflet`
- Keep commits focused. One logical change per commit when reasonable.

## Pull requests

- Use the [PR template](./.github/PULL_REQUEST_TEMPLATE.md).
- **Small PRs ship faster.** If your PR touches >10 files for one change, split it.
- Link the issue you're solving (`Closes #123`).
- Include screenshots / GIFs for any visible UI change.
- Make sure `npm run check` passes locally.
- Be patient — the curator (one person) reviews on weekends.

---

## Code style

### Hard rules

- **No `any`.** Fix the type. If a third-party lib is genuinely untyped, declare a module in `src/types/`.
- **Semantic Tailwind tokens only.** No `text-white`, `bg-[#F97316]`. Use `text-foreground`, `bg-primary`. See [`DESIGN.md`](./DESIGN.md).
- **localStorage goes through `useLocalStorage<T>`** (`src/hooks/useLocalStorage.ts`). Don't reinvent the load → save pattern.
- **localStorage keys live in `src/lib/constants.ts` → `STORAGE_KEYS`.** Don't hardcode strings.
- **Telegram deeplinks go through `src/lib/telegram.ts`.** Don't construct `t.me/…` URLs inline.
- **i18n strings go in `src/lib/i18n.ts`** (or inline `language === 'ru' ? … : …` for one-offs). Both languages always.
- **No mocked or AI-generated content** in `src/data/locations.json` or any seed data.

### Soft rules

- One concern per hook / component. If a file does two things, split it.
- Prefer `src/lib/constants.ts` for any number that means something (thresholds, sizes, URLs).
- Add JSDoc to publicly used hooks and utilities.

### File layout

```
src/
├── pages/          # Routes
├── components/
│   ├── ui/         # shadcn — don't modify
│   └── feature/    # Group by feature, not by type
├── hooks/          # One file per hook
├── lib/            # Pure utilities, no React
├── data/           # Seed data + locations.json
└── types/          # Shared types
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full map.

---

## Adding things — step-by-step guides

| What | Where |
|---|---|
| A place on the map | [`docs/adding-a-place.md`](./docs/adding-a-place.md) |
| A new map layer (like Hazards) | [`docs/adding-a-map-layer.md`](./docs/adding-a-map-layer.md) |
| A new club post type | [`docs/adding-a-club-post-type.md`](./docs/adding-a-club-post-type.md) |
| An i18n key or new language | [`docs/i18n.md`](./docs/i18n.md) |

---

## Testing

We don't aim for 100% coverage. We aim for **examples that other contributors can copy**.

Add a test when you:
- Touch logic in `src/hooks/` (filtering, sorting, state machines)
- Touch logic in `src/lib/` (utilities)
- Fix a bug — write the test that would have caught it

```sh
npm run test            # run once
npm run test:watch      # watch mode
```

See `src/test/` for examples.

---

## Communication

- **Bug or feature?** → GitHub issue.
- **Security issue?** → see [`SECURITY.md`](./SECURITY.md).
- **Want to chat or join the club?** → [@twoushka_bot](https://t.me/twoushka_bot).

---

## License

By contributing, you agree your contributions are licensed under [AGPL-3.0](./LICENSE).
