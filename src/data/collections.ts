export interface Collection {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  placeIds: string[];
  image: string;
}

export const collections: Collection[] = [
  {
    id: 'seaside',
    name: 'К морю',
    nameEn: 'Seaside',
    emoji: '🌊',
    placeIds: ['teriberka', 'rybachy', 'sredny', 'dalnie-zelentsy'],
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
  },
  {
    id: 'mountains',
    name: 'В горы',
    nameEn: 'Mountains',
    emoji: '🏔️',
    placeIds: ['khibiny', 'lovozero-tundra', 'alluayv', 'volosyanaya'],
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=300&fit=crop',
  },
  {
    id: 'abandoned',
    name: 'Заброшенное',
    nameEn: 'Abandoned',
    emoji: '🏚️',
    placeIds: ['dalnie-zelentsy', 'sunken-ships'],
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&h=300&fit=crop',
  },
  {
    id: 'pomor',
    name: 'Поморы',
    nameEn: 'Pomor Heritage',
    emoji: '⛵',
    placeIds: ['umba', 'varzuga', 'tonya-tetrina', 'chavanga'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
  },
  {
    id: 'top5',
    name: 'Топ-5',
    nameEn: 'Top 5',
    emoji: '⭐',
    placeIds: ['teriberka', 'khibiny', 'seydozero', 'rybachy', 'lovozero-tundra'],
    image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=300&fit=crop',
  },
];

export interface HiddenGem {
  id: string;
  placeId: string;
  teaser: string;
  teaserEn: string;
  image: string;
}

export const hiddenGems: HiddenGem[] = [
  {
    id: 'gem-kuzomen',
    placeId: 'kuzomen',
    teaser: 'Песчаная пустыня за Полярным кругом',
    teaserEn: 'A sand desert beyond the Arctic Circle',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=200&fit=crop',
  },
  {
    id: 'gem-zelentsy',
    placeId: 'dalnie-zelentsy',
    teaser: 'Заброшенный город учёных у океана',
    teaserEn: 'Abandoned scientists\' town by the ocean',
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=400&h=200&fit=crop',
  },
  {
    id: 'gem-chavanga',
    placeId: 'chavanga',
    teaser: 'Самое отдалённое село Кольского',
    teaserEn: 'The most remote village of Kola',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
  },
];
