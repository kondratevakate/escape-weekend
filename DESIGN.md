# WoWAtlas — Design System

> Visual tokens, component rules, and motion guidelines.
> Read alongside [`BRAND.md`](./BRAND.md) (voice) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) (code).

---

## Foundational rule

**All colors live in `src/index.css` as HSL CSS variables and are exposed via `tailwind.config.ts`.**
Never write `text-white`, `bg-[#F97316]`, or any literal color in a component. Use semantic tokens (`text-foreground`, `bg-primary`, `border-border`).

---

## Color palette

Defined in `src/index.css`. All values are HSL triplets (no `hsl()` wrapper).

### Core (light mode)

| Token | HSL | Use |
|---|---|---|
| `--background` | `40 20% 97%` | Page background — warm beige |
| `--foreground` | `25 30% 15%` | Body text |
| `--card` | `40 15% 98%` | Card surface |
| `--primary` | `25 80% 45%` | **Brand orange** — CTAs, active states, accents |
| `--primary-foreground` | `45 30% 98%` | Text on primary |
| `--secondary` | `195 60% 45%` | Secondary teal — links, info |
| `--accent` | `142 60% 40%` | Green — "good to go", availability |
| `--muted` | `40 20% 90%` | Subtle surfaces |
| `--muted-foreground` | `25 15% 45%` | Captions, hints |
| `--destructive` | `0 84% 60%` | Errors, delete |
| `--border` | `35 25% 85%` | Borders, dividers |
| `--ring` | `25 80% 45%` | Focus ring |

### Category colors (map markers)

| Token | HSL | Category |
|---|---|---|
| `--nature` | `142 76% 36%` | Nature |
| `--hiking` | `25 95% 53%` | Hiking |
| `--museum` | `262 83% 58%` | Museum |
| `--attraction` | `45 93% 47%` | Attraction |
| `--village` | `199 89% 48%` | Village |
| `--city` | `0 0% 45%` | City |
| `--reserve` | `160 84% 39%` | Reserve |

### Club post types

Defined in `src/types/club.ts` → `POST_TYPE_META`. Each post type has a left-border color stripe.

| Type | Color (HSL) | Emoji |
|---|---|---|
| `route` | `150 50% 45%` | 🥾 |
| `spot` | `25 90% 55%` | 📍 |
| `ask` | `210 80% 55%` | ❓ |
| `meetup` | `330 70% 60%` | 🤝 |
| `guide` | `270 50% 55%` | 📖 |

### Hazard severity

Defined in `src/data/hazardsLayer.ts` → `severityColor`.

| Level | Color | Use |
|---|---|---|
| `info` | secondary blue | Informational warnings |
| `warning` | primary orange | Be cautious |
| `danger` | destructive red | Real risk to life |

---

## Typography

System font stack (no custom web fonts loaded — keeps the bundle lean). Inherits `font-family` from the OS.

**Forbidden:** Serif fonts. The look is "field notebook," not "magazine spread."

| Element | Tailwind class | Notes |
|---|---|---|
| H1 | `text-3xl md:text-4xl font-bold` | Page titles only — one per page |
| H2 | `text-2xl font-bold` | Section headings |
| H3 | `text-lg font-semibold` | Subsections |
| Body | `text-sm md:text-base` | Default |
| Caption | `text-xs text-muted-foreground` | Hints, metadata |

`leading-relaxed` for paragraphs. `leading-tight` for headings.

---

## Spacing

Use Tailwind's default scale (`gap-2`, `p-4`, `space-y-3`). Never hand-roll pixel values.

Common rhythms:
- Card internal padding: `p-4` (mobile) → `p-5` (desktop)
- Section vertical gap: `space-y-6` or `space-y-8`
- Inline icon + text: `gap-2`

---

## Component rules

These are constraints — violations get reverted in review.

| Component | Rule | Why |
|---|---|---|
| **PlaceCard** | Fixed width `320px` | Designed for Telegram Mini App viewport |
| **Map markers** | `44px` desktop, `32px` mobile | Tap target + visibility |
| **Comment avatar** | `28px` (`h-7 w-7`) | Tight, scan-friendly |
| **Buttons** | Always shadcn `<Button>` with semantic variants | No raw `<button>` for interactive UI |
| **Icons** | `lucide-react`, default stroke `2`, sizes `h-4 w-4` (inline) / `h-5 w-5` (UI chrome) | Consistency |
| **Drawers / Sheets** | Radix `<Sheet>` from `bottom` on mobile | Native feel |

---

## Motion

Defined in `tailwind.config.ts` → `keyframes` / `animation`.

| Animation | When | Duration |
|---|---|---|
| `heart-bounce` | Stash button tap | 0.4s |
| `heart-pop` | Floating heart on save | 0.8s |
| `accordion-down/up` | Collapsibles | 0.2s |

Default transitions on hover/state: `transition-colors duration-200`.

**Forbidden:**
- `backdrop-blur` — performance + visual conflict with the warm palette. Use solid overlays with opacity instead.
- Animations longer than 800ms.
- `animate-bounce` on permanent UI (only on momentary feedback).

---

## Layout patterns

- **Split layout** on desktop: discovery sidebar (left) + map (center) + actions (right).
- **Stacked** on mobile with bottom navigation (`MobileBottomNav`).
- **Solid overlays** over the map (no blur). Use `bg-card/95` if translucency is needed.
- **Z-index hierarchy** documented in `src/index.css` and `mem://ui/header-structure`.

---

## Don'ts

- ❌ Dark mode by default. We support `.dark` but the brand is warm-light.
- ❌ Backdrop-blur anywhere.
- ❌ Serif fonts.
- ❌ Country flag emojis as language switchers.
- ❌ Gradient backgrounds on functional surfaces (cards, buttons). Decorative hero gradients are OK.
- ❌ Custom hex colors in components. Always semantic tokens.
- ❌ Custom box-shadows. Use Tailwind defaults (`shadow-sm`, `shadow-md`).

---

## Adding a new color

1. Add HSL variable to `src/index.css` in both `:root` and `.dark`.
2. Expose in `tailwind.config.ts` under `theme.extend.colors` if it should be a Tailwind class.
3. Document in this file.
4. Use as `bg-{name}`, `text-{name}`, never raw HSL in components.
