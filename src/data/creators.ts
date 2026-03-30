export interface Creator {
  id: string;
  name: string;
  avatarUrl: string;
  platform: 'google' | 'yandex' | 'mapsme';
  layerLabel: { ru: string; en: string };
  active?: boolean;
}

export const creators: Creator[] = [
  {
    id: 'creator-anna',
    name: 'Anna K.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    platform: 'google',
    layerLabel: { ru: 'Карта Анны', en: "Anna's Map" },
  },
  {
    id: 'creator-ivan',
    name: 'Ivan M.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    platform: 'yandex',
    layerLabel: { ru: 'Карта Ивана', en: "Ivan's Map" },
  },
  {
    id: 'creator-olga',
    name: 'Olga S.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
    platform: 'mapsme',
    layerLabel: { ru: 'Карта Ольги', en: "Olga's Map" },
  },
];
