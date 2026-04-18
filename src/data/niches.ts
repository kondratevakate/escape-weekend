export interface Niche {
  id: string;
  emoji: string;
  ru: string;
  en: string;
}

// Curated starting niches. Members can also add custom niches via the Join form / New Post wizard.
export const SEED_NICHES: Niche[] = [
  { id: 'astro',         emoji: '🌌', ru: 'Астротуризм',     en: 'Astrotourism' },
  { id: 'hiking',        emoji: '🥾', ru: 'Хайкинг',         en: 'Hiking' },
  { id: 'kayak',         emoji: '🛶', ru: 'Каяк / SUP',      en: 'Kayak / SUP' },
  { id: 'photo',         emoji: '📷', ru: 'Фотография',      en: 'Photography' },
  { id: 'ethno',         emoji: '🪶', ru: 'Этнография',      en: 'Ethnography' },
  { id: 'food',          emoji: '🍲', ru: 'Гастрономия',     en: 'Gastronomy' },
  { id: 'diving',        emoji: '🤿', ru: 'Дайвинг',         en: 'Diving' },
  { id: 'skitour',       emoji: '🎿', ru: 'Скитур',          en: 'Ski touring' },
  { id: 'birdwatching',  emoji: '🦅', ru: 'Бёрдвотчинг',     en: 'Birdwatching' },
  { id: 'coffee',        emoji: '☕', ru: 'Кофе',            en: 'Coffee' },
  { id: 'enduro',        emoji: '🏍️', ru: 'Эндуро',          en: 'Enduro' },
  { id: 'fishing',       emoji: '🎣', ru: 'Рыбалка',         en: 'Fishing' },
];

const CUSTOM_KEY = 'club_custom_niches_v1';

export const getCustomNiches = (): Niche[] => {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]'); } catch { return []; }
};

export const addCustomNiche = (niche: Niche) => {
  const all = getCustomNiches();
  if (all.find(n => n.id === niche.id) || SEED_NICHES.find(n => n.id === niche.id)) return;
  all.push(niche);
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
};

export const getAllNiches = (): Niche[] => [...SEED_NICHES, ...getCustomNiches()];

export const getNiche = (id: string): Niche | undefined =>
  getAllNiches().find(n => n.id === id) || { id, emoji: '🏷️', ru: id, en: id };
