# WoWAtlas — Architecture

> Map of the codebase for new contributors. If you've never touched the project, read this first.

---

## Stack

- **React 18** + **TypeScript 5** (strict)
- **Vite 5** build tool
- **Tailwind CSS 3** + **shadcn/ui** (Radix primitives) for components
- **Leaflet** (CartoDB Positron tiles) for the map
- **react-router-dom 6** for routing
- **Vitest** + **@testing-library/react** for tests
- **localStorage** for all user data (Stash, club posts, reactions, comments, membership)

There is **no backend yet**. All persistence is client-side. See [Phase 2](./.lovable/plan.md) for the migration plan to Lovable Cloud / Supabase.

---

## Folder layout

```
src/
├── pages/          # Top-level routes (one file = one route)
├── components/
│   ├── ui/         # shadcn primitives — DO NOT modify these
│   ├── club/       # Club feature components
│   ├── map/        # Map, markers, layers, filters
│   ├── landing/    # Landing page sections
│   ├── trip/       # Trip planner
│   └── ...
├── hooks/          # Custom React hooks (one concern each)
├── contexts/       # React contexts (Language, User, Auth)
├── data/           # Static seed data + locations.json
├── lib/            # Pure utilities (no React)
│   ├── constants.ts    # localStorage keys, tile URLs, defaults
│   ├── telegram.ts     # Telegram deeplink utilities
│   ├── i18n.ts         # Translations
│   ├── analytics.ts    # Event tracking
│   └── utils.ts        # cn() helper
├── types/          # Shared TypeScript types
└── test/           # Vitest setup + tests
```

---

## Data flow

### Places (the map)

```
src/data/locations.json  ←  single source of truth (real, curated)
       │
       ▼
src/data/locations.ts    ←  loads + types the JSON
       │
       ▼
src/pages/Index.tsx      ←  filters by season, category, search
       │
       ▼
src/components/map/MapView.tsx  ←  renders Leaflet markers
       │
       ▼
src/components/map/PlaceCard.tsx  ←  click → details
```

### Club (community)

```
src/data/clubMembers.ts + clubPosts.ts + niches.ts  ←  seed
       │
       ▼
src/hooks/useClubPosts.ts        ←  merges seed + user posts (localStorage)
src/hooks/useClubReactions.ts    ←  🔥 counts (localStorage)
src/hooks/useClubComments.ts     ←  flat threads (localStorage)
src/hooks/useClubMembership.ts   ←  application status (localStorage)
       │
       ▼
src/pages/ClubFeed.tsx, ClubPost.tsx, ClubMember.tsx, ClubJoin.tsx, ClubNewPost.tsx
```

### User state (all localStorage)

| Key | Hook | Owns |
|---|---|---|
| `kola_stash` | `useStash` | Saved places + planned season |
| `kola_favorites` | `useFavorites` | Liked places |
| `kola_telegram_cta` | `useTelegramCTA` | Bot conversion CTA state |
| `club_membership_v1` | `useClubMembership` | Application + status |
| `club_user_posts_v1` | `useClubPosts` | Member-created posts |
| `club_fire_v1` / `club_fire_counts_v1` | `useClubReactions` | 🔥 reactions |
| `club_comments_v1` | `useClubComments` | Comments |
| `club_custom_niches_v1` | `data/niches.ts` | User-added niches |

**All keys are centralized in `src/lib/constants.ts` → `STORAGE_KEYS`.** Don't hardcode key strings.

---

## Adding a new map layer (5 steps)

Use the Hazards layer as a reference (`src/data/hazardsLayer.ts` + `MapView.tsx`).

1. **Data** — create `src/data/myLayer.ts` with a typed array (id, coordinates, i18n name, metadata).
2. **Ref** — add `myLayerRef = useRef<L.Layer | null>(null)` in `MapView.tsx`.
3. **Effect** — add a `useEffect` that creates/destroys the layer based on a `showMyLayer` prop.
4. **Toggle** — add a button in `CategoryFilter.tsx` and wire `showMyLayer` + `onToggleMyLayer` through `KolaMap.tsx` → `Index.tsx`.
5. **i18n** — add labels to `src/lib/i18n.ts` (RU + EN, by hand).

Detailed walkthrough: [`docs/adding-a-map-layer.md`](./docs/adding-a-map-layer.md).

---

## Adding a club post type

1. Add the type to `ClubPostType` in `src/types/club.ts`.
2. Add metadata (color, emoji, label) to `POST_TYPE_META`.
3. (Optional) Add type-specific fields to the `ClubPost` interface.
4. Add a step or field in `src/pages/ClubNewPost.tsx`.
5. Update render logic in `src/components/club/PostCard.tsx` and `src/pages/ClubPost.tsx`.

Detailed walkthrough: [`docs/adding-a-club-post-type.md`](./docs/adding-a-club-post-type.md).

---

## Roles & capabilities

Defined in `src/types/roles.ts`.

| Role | Capabilities |
|---|---|
| `user` | View map, share. (Stash + offline gated as premium.) |
| `creator` | + Stash, custom maps, offline downloads |
| `admin` | + manage creators |
| `member` (club) | Tracked separately in `useClubMembership`, orthogonal to `UserRole` |

Role is read from `?role=` URL param (dev shortcut) — see `src/contexts/UserContext.tsx`.

Use `hasCapability(role, 'capability')` for checks. Never check `role === 'admin'` inline.

---

## i18n

Two languages: `ru` (default) and `en`. Translations in `src/lib/i18n.ts`.

To add a string:
1. Add the key to both `ru` and `en` blocks in `i18n.ts`.
2. Use via `const { t } = useLanguage(); t('my.key')`.

For inline conditionals (rare), use `language === 'ru' ? '…' : '…'`.

**Never** ship machine-translated copy. See [`docs/i18n.md`](./docs/i18n.md).

---

## ASCII flow

```
                ┌──────────────────────────────┐
                │  src/data/locations.json     │
                │  (real, curated places)      │
                └──────────────┬───────────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
         ┌─────────────────┐       ┌─────────────────┐
         │  Map / Index    │       │  Club / Feed    │
         │  (discovery)    │◄──────│  (community)    │
         └────────┬────────┘ link  └────────┬────────┘
                  │                         │
                  ▼                         ▼
         ┌─────────────────┐       ┌─────────────────┐
         │  PlaceCard      │       │  PostCard /     │
         │  + Stash 🔖     │       │  Member profile │
         └────────┬────────┘       └────────┬────────┘
                  │                         │
                  └────────────┬────────────┘
                               ▼
                  ┌─────────────────────────┐
                  │  Telegram bot deeplink  │
                  │  (lib/telegram.ts)      │
                  └─────────────────────────┘
```

---

## Conventions

- **One concern per hook.** If a hook does two things, split it.
- **localStorage hooks use `useLocalStorage<T>` generic** (`src/hooks/useLocalStorage.ts`). Don't duplicate the load → state → save pattern.
- **Telegram deeplinks go through `src/lib/telegram.ts`.** Don't construct `t.me/...` URLs inline.
- **No `any`.** If TypeScript fights you, fix the type, don't escape it.
- **Real data only.** No mocked reviews, no Lorem Ipsum, no AI-generated descriptions in `locations.json`.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the contribution workflow.
