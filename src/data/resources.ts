export interface Resource {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  emoji: string;
  url: string;
}

export const resources: Resource[] = [
  {
    id: 'coffee-guide',
    name: 'World Coffee Guide',
    nameEn: 'World Coffee Guide',
    description: 'Гид по кофейням мира',
    descriptionEn: 'Global coffee shop guide',
    emoji: '☕',
    url: 'https://notbadcoffee.com/world-coffee-guide/',
  },
  {
    id: 'rgo',
    name: 'Русское географическое общество',
    nameEn: 'Russian Geographical Society',
    description: 'Официальный сайт РГО',
    descriptionEn: 'Official RGS website',
    emoji: '🌍',
    url: 'https://rgo.ru/',
  },
];
