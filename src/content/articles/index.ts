import murmanskRaw from './murmansk.md?raw';
import altaiRaw from './altai.md?raw';
import servicesRaw from './services.md?raw';

export interface Article {
  slug: string;
  title: string;
  region: 'murmansk' | 'altai' | 'services';
  summary: string;
  body: string;
  gated: boolean;
  priceRub?: number;
}

export const articles: Article[] = [
  {
    slug: 'murmansk',
    title: 'Мурманск и Кольский полуостров',
    region: 'murmansk',
    summary: 'Северное сияние, киты, снегоходы. Авторский гайд Кати с маршрутами, бюджетом и ошибками новичков.',
    body: murmanskRaw,
    gated: true,
    priceRub: 1500,
  },
  {
    slug: 'altai',
    title: 'Алтай',
    region: 'altai',
    summary: 'Авторский гайд по Алтаю.',
    body: altaiRaw,
    gated: true,
    priceRub: 1500,
  },
  {
    slug: 'services',
    title: 'Тарифы и сервисы',
    region: 'services',
    summary: 'Что входит в консьерж и в гайд.',
    body: servicesRaw,
    gated: false,
  },
];

export const articleBySlug = (slug: string) => articles.find(a => a.slug === slug);
