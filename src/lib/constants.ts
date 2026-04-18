/**
 * Project-wide constants.
 *
 * If a magic string or number means something (a localStorage key, a tile URL,
 * a default coordinate, a marker size), it lives here — not inline in components.
 *
 * @see ARCHITECTURE.md
 */

// ─── localStorage keys ────────────────────────────────────────────────────────
// Versioned suffix (`_v1`) so we can bump on schema changes without colliding.
export const STORAGE_KEYS = {
  // Map / discovery
  stash: 'kola_stash',
  favorites: 'kola_favorites',
  telegramCta: 'kola_telegram_cta',

  // Club
  clubMembership: 'club_membership_v1',
  clubUserPosts: 'club_user_posts_v1',
  clubFire: 'club_fire_v1',
  clubFireCounts: 'club_fire_counts_v1',
  clubComments: 'club_comments_v1',
  clubCustomNiches: 'club_custom_niches_v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// ─── Map tiles ────────────────────────────────────────────────────────────────
export const TILE_URLS = {
  base: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  // Add new tile sources here when adding a layer.
} as const;

export const TILE_ATTRIBUTION = {
  carto: '&copy; <a href="https://carto.com/">CARTO</a>',
  osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
} as const;

// ─── Default geography ────────────────────────────────────────────────────────
/** Roughly center of the Kola Peninsula. */
export const DEFAULT_CENTER: [number, number] = [67.5, 35.0];
export const DEFAULT_ZOOM = 7;

// ─── UI sizes ─────────────────────────────────────────────────────────────────
export const MARKER_SIZE = {
  desktop: 44,
  mobile: 32,
} as const;

export const PLACE_CARD_WIDTH = 320;
export const COMMENT_AVATAR_SIZE = 28;

// ─── Telegram ─────────────────────────────────────────────────────────────────
/** Primary curator/moderation bot. Used for club applications, security reports. */
export const TG_BOT_USERNAME = 'dvushka_bot';
/** Legacy bot used by the conversion bridge sheet. */
export const TG_BRIDGE_BOT_USERNAME = 'KolaGuideBot';

// ─── Thresholds ───────────────────────────────────────────────────────────────
export const TG_CTA_SAVE_THRESHOLD = 3;
export const TG_CTA_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
