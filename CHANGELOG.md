# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Open-source readiness: `BRAND.md`, `DESIGN.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` (AGPL-3.0)
- GitHub issue & PR templates (`.github/`)
- Contributor how-to guides in `docs/`
- `src/lib/constants.ts` — centralized localStorage keys, tile URLs, defaults
- `src/lib/telegram.ts` — Telegram deeplink utilities
- `src/hooks/useLocalStorage.ts` — generic hook to remove duplication across 6 storage hooks
- Smoke tests for `useClubPosts.filterAndSort`, `useClubMembership`, `hasCapability`
- `npm run check` script (lint + typecheck + test)

### Changed
- Refactored `useStash`, `useFavorites`, `useTelegramCTA`, `useClubMembership`, `useClubPosts`, `useClubReactions`, `useClubComments` to use `useLocalStorage`
- `ClubJoin.tsx` and `TelegramBridgeSheet.tsx` now use `lib/telegram.ts` instead of inline deeplinks

## [0.1.0] — Initial public version

### Added
- Curated map of the Kola Peninsula and beyond
- Seasonal logic, Stash, hazards layer, indigenous peoples layer, restaurants layer
- Trip Planner with drag-and-drop
- Club (vas3k-style) — applications, posts, 🔥 reactions, comments, member profiles
- Bilingual RU/EN
