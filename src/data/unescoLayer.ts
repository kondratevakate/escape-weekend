import { Place } from './kolaPlaces';

export interface UnescoSite {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: 'Cultural' | 'Natural' | 'Mixed';
  coordinates: [number, number]; // [lat, lng]
  yearInscribed: number;
  url: string;
}

export const unescoSites: UnescoSite[] = [
  {
    id: 'unesco-solovetsky',
    name: 'Соловецкие острова',
    nameEn: 'Cultural and Historic Ensemble of the Solovetsky Islands',
    description: 'Архипелаг в Белом море с уникальным монастырём XV века',
    category: 'Cultural',
    coordinates: [65.08, 35.67],
    yearInscribed: 1992,
    url: 'https://whc.unesco.org/en/list/632',
  },
  {
    id: 'unesco-kizhi',
    name: 'Кижский погост',
    nameEn: 'Kizhi Pogost',
    description: 'Деревянная церковь с 22 куполами на острове Онежского озера',
    category: 'Cultural',
    coordinates: [62.07, 35.22],
    yearInscribed: 1990,
    url: 'https://whc.unesco.org/en/list/544',
  },
  {
    id: 'unesco-petroglyphs',
    name: 'Петроглифы Онежского озера и Белого моря',
    nameEn: 'Petroglyphs of Lake Onega and the White Sea',
    description: 'Наскальные рисунки эпохи неолита возрастом 6-7 тысяч лет',
    category: 'Cultural',
    coordinates: [64.43, 36.47],
    yearInscribed: 2021,
    url: 'https://whc.unesco.org/en/list/1654',
  },
  {
    id: 'unesco-kenozero',
    name: 'Культурный ландшафт Кенозера',
    nameEn: 'Kenozero Cultural Landscape',
    description: 'Уникальный культурный ландшафт с традиционными деревнями и часовнями',
    category: 'Cultural',
    coordinates: [61.9, 38.2],
    yearInscribed: 2024,
    url: 'https://whc.unesco.org/en/list/1709',
  },
  {
    id: 'unesco-novgorod',
    name: 'Великий Новгород',
    nameEn: 'Historic Monuments of Novgorod and Surroundings',
    description: 'Древнейший город России с уникальными памятниками XI-XVII веков',
    category: 'Cultural',
    coordinates: [58.52, 31.28],
    yearInscribed: 1992,
    url: 'https://whc.unesco.org/en/list/604',
  },
  {
    id: 'unesco-spb',
    name: 'Санкт-Петербург',
    nameEn: 'Historic Centre of Saint Petersburg',
    description: 'Исторический центр города с дворцами, каналами и Эрмитажем',
    category: 'Cultural',
    coordinates: [59.94, 30.31],
    yearInscribed: 1990,
    url: 'https://whc.unesco.org/en/list/540',
  },
];

// Convert UNESCO sites to Place format for map compatibility
export const unescoPlaces: Place[] = unescoSites.map(site => ({
  id: site.id,
  name: site.name,
  nameEn: site.nameEn,
  description: site.description,
  category: 'unesco' as const,
  coordinates: site.coordinates,
  region: 'northwest',
}));

// Get UNESCO site by ID (for additional info like year and URL)
export const getUnescoSiteById = (id: string): UnescoSite | undefined => {
  return unescoSites.find(site => site.id === id);
};
