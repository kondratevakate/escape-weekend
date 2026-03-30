

# Hedonist Odyssey — Roles & Features Plan

## Summary

Rebrand to "Hedonist Odyssey", implement a role system (user / creator / admin), add creator visibility in the layers panel, enable offline map download for users and creators, add promo code sharing for users, and reduce visual noise in the right sidebar (Discover panel).

## 1. Rebrand to "Hedonist Odyssey"

- Update brand name in `Header.tsx` (logo text), `Footer.tsx`, `WelcomeModal.tsx`, `index.html` (title/meta)
- Replace `🌌 Kola Guide` with `🌌 Hedonist Odyssey` everywhere
- Update `landing.brand` in `i18n.ts`

## 2. Role System

**New file: `src/types/roles.ts`**
- Define `type UserRole = 'user' | 'creator' | 'admin'`
- Define role capabilities map (what each role can do)

**Update `UserContext.tsx`**
- Add `role: UserRole` to context state
- Determine role from: URL param `?role=creator`, Telegram user metadata, or default `'user'`
- For now, role is client-side only (no backend yet). When backend is added, roles will come from a `user_roles` table
- Export `useUserRole()` hook

**Update `PremiumGate.tsx`**
- Add role-aware gating: `usePremiumAccess` checks both `accessMode` and `role`

### Role capabilities:
| Feature | User | Creator | Admin |
|---|---|---|---|
| View map & layers | yes | yes | yes |
| Save to Stash | premium | yes | yes |
| Share promo code | yes | — | — |
| Add custom map layers | — | yes | yes |
| Offline download | premium | yes | yes |
| Manage creators | — | — | yes |

## 3. Creator Visibility in Layers Panel

**Update `CategoryFilter.tsx`**
- Add a "Creators" section below existing layer toggles
- Each creator shown as: avatar circle + name (like Telegram-style rounded avatar)
- Clicking a creator toggles their custom layer on/off
- Data source: hardcoded array initially (`src/data/creators.ts`), later from backend

**New file: `src/data/creators.ts`**
- Array of `{ id, name, avatarUrl, layerUrl, platform: 'google' | 'yandex' | 'mapsme' }`
- Placeholder data for 2-3 creators

## 4. Promo Code Sharing (User)

**Update Header user menu**
- For role `'user'`: show "Share promo" button that generates a referral link with discount code
- Copy to clipboard with toast confirmation
- Link format: `{origin}?promo=XXXXX`

## 5. Creator: Add Custom Maps

**New component: `src/components/map/AddMapModal.tsx`**
- Form: name, link (Google Maps / Yandex / Maps.me), description
- For now, opens Telegram bot link (existing behavior) but with UI that explains the feature
- Gate behind `role === 'creator'`

## 6. Offline Map Download

**New component: `src/components/map/OfflineDownload.tsx`**
- Button in header or sidebar: "Download offline"
- Generates a static snapshot of current visible places as JSON + tile cache manifest
- For MVP: export places data as downloadable JSON file
- Gate behind premium access or creator role

## 7. Reduce Visual Noise in Discover Panel

**Update `DiscoverPanel.tsx`**
- Collapse "Collections", "Hidden Gems", and "Good to visit now" sections into accordion/collapsible sections — collapsed by default, only headers visible
- Keep filter pills for Collections visible but make the section headers smaller and lighter
- Remove card-style borders from Hidden Gems items, use simpler text list with dot indicators
- "Good to visit now" banner: make it a single compact line instead of a block + pill list

## Technical Details

### Files to create:
- `src/types/roles.ts` — role types and capability map
- `src/data/creators.ts` — placeholder creator data
- `src/components/map/AddMapModal.tsx` — creator map submission UI
- `src/components/map/OfflineDownload.tsx` — offline export button

### Files to modify:
- `src/contexts/UserContext.tsx` — add role to context
- `src/components/PremiumGate.tsx` — role-aware gating
- `src/components/map/CategoryFilter.tsx` — creator avatars in sidebar
- `src/components/landing/DiscoverPanel.tsx` — collapsible sections, lighter UI
- `src/components/landing/Header.tsx` — rebrand + promo sharing + offline button
- `src/components/landing/Footer.tsx` — rebrand
- `src/lib/i18n.ts` — brand name update
- `index.html` — title update

### Security note:
Client-side roles are for UI gating only. When backend is added, all role checks must be server-side via `user_roles` table with RLS policies.

