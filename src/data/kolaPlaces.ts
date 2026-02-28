export type PlaceCategory = 
  | 'nature' 
  | 'hiking' 
  | 'museum' 
  | 'attraction' 
  | 'village' 
  | 'city' 
  | 'reserve'
  | 'history'
  | 'unesco';

export interface Place {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  category: PlaceCategory;
  coordinates: [number, number]; // [lat, lng]
  region: string;
  // Rich share fields
  whenToVisit?: string;
  whenToVisitEn?: string;
  howToGet?: string;
  howToGetEn?: string;
  warning?: string;
  warningEn?: string;
}

export const categoryConfig: Record<PlaceCategory, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}> = {
  nature: {
    label: 'Природа',
    icon: '🏔️',
    color: 'hsl(142 76% 36%)',
    bgColor: 'hsl(142 76% 95%)',
  },
  hiking: {
    label: 'Хайкинг',
    icon: '🥾',
    color: 'hsl(25 95% 53%)',
    bgColor: 'hsl(25 95% 95%)',
  },
  museum: {
    label: 'Музеи',
    icon: '🏛️',
    color: 'hsl(262 83% 58%)',
    bgColor: 'hsl(262 83% 95%)',
  },
  attraction: {
    label: 'Достопримечательности',
    icon: '⭐',
    color: 'hsl(45 93% 47%)',
    bgColor: 'hsl(45 93% 95%)',
  },
  village: {
    label: 'Сёла',
    icon: '🏘️',
    color: 'hsl(199 89% 48%)',
    bgColor: 'hsl(199 89% 95%)',
  },
  city: {
    label: 'Города',
    icon: '🏙️',
    color: 'hsl(0 0% 45%)',
    bgColor: 'hsl(0 0% 95%)',
  },
  reserve: {
    label: 'Заповедники',
    icon: '🌲',
    color: 'hsl(160 84% 39%)',
    bgColor: 'hsl(160 84% 95%)',
  },
  history: {
    label: 'История',
    icon: '📜',
    color: 'hsl(340 65% 45%)',
    bgColor: 'hsl(340 65% 95%)',
  },
  unesco: {
    label: 'UNESCO',
    icon: '🏛️',
    color: 'hsl(210 100% 40%)',
    bgColor: 'hsl(210 100% 95%)',
  },
};

// Data now lives in locations.json — import kolaPlaces from '@/data/locations' instead
