import { ClubMember } from '@/types/club';

export const SEED_MEMBERS: ClubMember[] = [
  {
    id: 'astra-nik',
    name: 'Никита А.',
    avatar: '🌌',
    bio: {
      ru: 'Астрофотограф из Мурманска. Снимаю сияние с 2017. Знаю где небо без засветки в радиусе 300 км.',
      en: 'Astrophotographer from Murmansk. Shooting auroras since 2017. I know dark-sky spots within 300km.',
    },
    niches: ['astro', 'photo'],
    location: 'Мурманск',
    joinedAt: '2024-09-01',
    links: { telegram: 'https://t.me/dvushka_bot', instagram: 'https://instagram.com' },
    stats: { postsCount: 3, fireReceived: 47, placesAdded: 8 },
  },
  {
    id: 'hibiny-katya',
    name: 'Катя Х.',
    avatar: '🥾',
    bio: {
      ru: 'Гид по Хибинам, 9 лет водит группы. Сертификат МЧС, спасатель. Спросите про погоду на перевалах.',
      en: 'Khibiny guide, 9 years leading groups. Certified rescuer. Ask me about pass weather.',
    },
    niches: ['hiking', 'skitour'],
    location: 'Кировск',
    joinedAt: '2024-08-15',
    links: { telegram: 'https://t.me/dvushka_bot', vas3k: 'https://vas3k.club' },
    stats: { postsCount: 4, fireReceived: 62, placesAdded: 14 },
  },
  {
    id: 'kayak-roma',
    name: 'Рома К.',
    avatar: '🛶',
    bio: {
      ru: 'Морской каякер. Прошёл все берега Кольского. Делаю экспедиции на Рыбачий и Семь Островов.',
      en: 'Sea kayaker. Paddled the whole Kola coastline. Lead expeditions to Rybachy and Seven Islands.',
    },
    niches: ['kayak'],
    location: 'Териберка',
    joinedAt: '2024-10-02',
    links: { telegram: 'https://t.me/dvushka_bot', youtube: 'https://youtube.com' },
    stats: { postsCount: 2, fireReceived: 31, placesAdded: 5 },
  },
  {
    id: 'sami-dasha',
    name: 'Даша С.',
    avatar: '🪶',
    bio: {
      ru: 'Этнограф, изучаю саамов 12 лет. Помогу попасть в правильное место и не оскорбить хозяев.',
      en: 'Ethnographer, studying Sámi for 12 years. Can connect you to the right people respectfully.',
    },
    niches: ['ethno', 'photo'],
    location: 'Ловозеро',
    joinedAt: '2024-07-20',
    links: { telegram: 'https://t.me/dvushka_bot' },
    stats: { postsCount: 2, fireReceived: 28, placesAdded: 6 },
  },
  {
    id: 'food-misha',
    name: 'Миша Г.',
    avatar: '🍲',
    bio: {
      ru: 'Гастро-журналист. Знаю где едят гребешка, морошку и оленину так, как нигде больше.',
      en: 'Food writer. I know where to eat scallops, cloudberries and reindeer like nowhere else.',
    },
    niches: ['food', 'coffee'],
    location: 'Мурманск',
    joinedAt: '2024-11-10',
    links: { telegram: 'https://t.me/dvushka_bot', website: 'https://example.com' },
    stats: { postsCount: 2, fireReceived: 19, placesAdded: 11 },
  },
  {
    id: 'birds-leha',
    name: 'Лёха П.',
    avatar: '🦅',
    bio: {
      ru: 'Бёрдвотчер. На Кольском видел 187 видов. Веду список редкостей.',
      en: 'Birder. 187 species spotted on Kola. Maintain a rarities list.',
    },
    niches: ['birdwatching'],
    location: 'Кандалакша',
    joinedAt: '2025-01-05',
    links: { telegram: 'https://t.me/dvushka_bot' },
    stats: { postsCount: 1, fireReceived: 12, placesAdded: 4 },
  },
];

export const getMember = (id: string): ClubMember | undefined =>
  SEED_MEMBERS.find(m => m.id === id);
