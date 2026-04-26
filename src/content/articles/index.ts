import murmanskRaw from './murmansk.md?raw';
import topToursRaw from './top-tours-2025.md?raw';
import japanRaw from './japan.md?raw';

export interface Article {
  slug: string;
  title: string;
  /** Free-form region tag matching `BuyerToken.regions[]` for access control. */
  region: string;
  summary: string;
  body: string;
  gated: boolean;
  priceRub?: number;
  /** Listed in the index but the page renders a "coming soon" stub. */
  comingSoon?: boolean;
}

export const articles: Article[] = [
  {
    slug: 'murmansk',
    title: 'Северная одиссея: Кольский',
    region: 'murmansk',
    summary:
      'Авторский маршрут-гид по Мурманской области. Северное сияние, киты, снегоходы. С маршрутами, бюджетом, ошибками новичков и реальной статистикой выходов в море.',
    body: murmanskRaw,
    gated: true,
    priceRub: 1500,
  },
  {
    slug: 'top-tours-2025',
    title: 'Топ туров на север 2025',
    region: 'russia-north',
    summary:
      'Подборка из 14 туров по русскому северу: Земля Франца-Иосифа, Плато Путорана, Чукотка, Камчатка, Алтай, Архыз и другие — с честными плюсами и минусами от команды «Два ушка».',
    body: topToursRaw,
    gated: true,
    priceRub: 1500,
  },
  {
    slug: 'japan',
    title: 'Япония',
    region: 'japan',
    summary: 'Скоро. Авторский гайд по Японии в разработке.',
    body: japanRaw,
    gated: true,
    comingSoon: true,
  },
];

export const articleBySlug = (slug: string) => articles.find(a => a.slug === slug);
