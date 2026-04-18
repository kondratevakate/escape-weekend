export type ClubPostType = 'route' | 'spot' | 'ask' | 'meetup' | 'guide';

export interface ClubMember {
  id: string;
  name: string;
  avatar?: string; // emoji or URL
  bio: { ru: string; en: string };
  niches: string[]; // niche ids
  location?: string;
  joinedAt: string; // ISO
  links: {
    telegram?: string; // @username or t.me url
    instagram?: string;
    youtube?: string;
    vas3k?: string;
    website?: string;
  };
  stats?: {
    postsCount?: number;
    fireReceived?: number;
    placesAdded?: number;
  };
}

export interface ClubPost {
  id: string;
  type: ClubPostType;
  authorId: string;
  createdAt: string; // ISO
  title: { ru: string; en: string };
  excerpt: { ru: string; en: string };
  content: { ru: string; en: string }; // markdown-ish
  cover?: string; // image URL
  niches: string[];
  linkedPlaceIds?: string[]; // ids in kolaPlaces
  // type-specific
  meetupAt?: string; // ISO date for meetups
  meetupLocation?: { ru: string; en: string };
  difficulty?: 'easy' | 'moderate' | 'hard';
  durationDays?: number;
  readMinutes?: number;
  externalUrl?: string; // link to vas3k / TG channel / blog
  externalLabel?: string;
}

export interface ClubComment {
  id: string;
  postId: string;
  authorName: string; // local guest name
  text: string;
  createdAt: string;
}

export const POST_TYPE_META: Record<ClubPostType, { emoji: string; color: string; ru: string; en: string }> = {
  route:   { emoji: '🥾', color: 'hsl(150 50% 45%)', ru: 'Маршрут',     en: 'Route' },
  spot:    { emoji: '📍', color: 'hsl(25 90% 55%)',  ru: 'Тайное место', en: 'Spot' },
  ask:     { emoji: '❓', color: 'hsl(210 80% 55%)', ru: 'Вопрос',       en: 'Ask' },
  meetup:  { emoji: '🤝', color: 'hsl(330 70% 60%)', ru: 'Мит',          en: 'Meetup' },
  guide:   { emoji: '📖', color: 'hsl(270 50% 55%)', ru: 'Гайд',         en: 'Guide' },
};
