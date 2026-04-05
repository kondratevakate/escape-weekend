export interface CreatorMap {
  id: string;
  platform: 'google' | 'yandex' | 'mapsme' | 'other';
  name: string;
  url: string;
  description?: string;
}

export interface CreatorProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'RUB' | 'USD' | 'EUR';
  url: string;
}

export interface CreatorLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  bio: string;
  avatarSeed: string;
  maps: CreatorMap[];
  products: CreatorProduct[];
  links: CreatorLink[];
  routePlanEnabled: boolean;
  routePlanPrice?: number;
  routePlanCurrency: 'RUB' | 'USD' | 'EUR';
}

export const PLATFORM_LABELS: Record<CreatorMap['platform'], string> = {
  google: 'Google Maps',
  yandex: 'Яндекс.Карты',
  mapsme: 'Maps.me',
  other: 'Другое',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
};
