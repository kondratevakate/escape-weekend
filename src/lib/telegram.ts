/**
 * Telegram deeplink utilities.
 *
 * All `t.me/...` URLs in the project should be built here, not inline.
 * Centralizing means we can swap bot usernames, add tracking, or change
 * encoding rules in one place.
 *
 * @see src/lib/constants.ts for bot usernames
 */
import { TG_BOT_USERNAME, TG_BRIDGE_BOT_USERNAME } from './constants';

/** Open a `t.me/<bot>` URL in a new tab. */
export const openBot = (botUsername: string = TG_BOT_USERNAME, startParam?: string): void => {
  const url = startParam
    ? `https://t.me/${botUsername}?start=${encodeURIComponent(startParam)}`
    : `https://t.me/${botUsername}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/** Open the conversion-bridge bot (used by `TelegramBridgeSheet`). */
export const openBridgeBot = (payload?: string): void => {
  openBot(TG_BRIDGE_BOT_USERNAME, payload);
};

/** Build (but don't open) a `t.me` URL. Useful for `<a href>` rendering. */
export const buildBotUrl = (botUsername: string = TG_BOT_USERNAME, startParam?: string): string => {
  return startParam
    ? `https://t.me/${botUsername}?start=${encodeURIComponent(startParam)}`
    : `https://t.me/${botUsername}`;
};

/**
 * Send a club application to the curator bot.
 * Opens TG with a prefilled `?start=club_<timestamp>` parameter.
 * The actual application body is also encoded for clients that respect `&text=`.
 */
export interface ClubApplicationPayload {
  name: string;
  contact: string;
  niches: string[];
  whyJoin: string;
}

export const sendApplicationToBot = (app: ClubApplicationPayload): void => {
  const text = encodeURIComponent(
    `🆕 Заявка в клуб WoWAtlas\n\n` +
      `👤 ${app.name}\n` +
      `📬 ${app.contact}\n` +
      `🏷 ${app.niches.join(', ')}\n\n` +
      `💬 ${app.whyJoin}`
  );
  const start = `club_${Date.now()}`;
  window.open(
    `https://t.me/${TG_BOT_USERNAME}?start=${start}&text=${text}`,
    '_blank',
    'noopener,noreferrer'
  );
};

/**
 * Share text + URL to Telegram via the official share API.
 * Falls back gracefully if the user has no Telegram client.
 */
export const shareToTelegram = (url: string, text: string): void => {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
};

// ─── Labs (internal Kickstarter) ─────────────────────────────────────────────
/**
 * Open Telegram to confirm a "support" pledge for a Labs idea.
 * No real money is collected; the bot operator handles the transfer manually.
 */
export const openSupportFeature = (ideaId: string, amount: number, ideaTitle: string): void => {
  const text = encodeURIComponent(
    `💛 Хочу поддержать идею WoWAtlas Labs\n\n` +
      `Идея: ${ideaTitle}\n` +
      `Сумма: ${amount} ₽\n\n` +
      `Напишите, как перевести.`
  );
  const start = `support_${ideaId}_${amount}`;
  window.open(
    `https://t.me/${TG_BOT_USERNAME}?start=${start}&text=${text}`,
    '_blank',
    'noopener,noreferrer'
  );
};

/**
 * Send a user-submitted feature idea to the curator bot.
 */
export interface LabsSubmissionPayload {
  title: string;
  description: string;
  expectedPrice: string;
}

export const sendIdeaToBot = (payload: LabsSubmissionPayload): void => {
  const text = encodeURIComponent(
    `💡 Новая идея в WoWAtlas Labs\n\n` +
      `📝 ${payload.title}\n\n` +
      `${payload.description}\n\n` +
      `💰 Ожидаемая стоимость: ${payload.expectedPrice || '—'}`
  );
  const start = `idea_${Date.now()}`;
  window.open(
    `https://t.me/${TG_BOT_USERNAME}?start=${start}&text=${text}`,
    '_blank',
    'noopener,noreferrer'
  );
};
