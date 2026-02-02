import { Place } from '@/data/kolaPlaces';

export type VehicleType = 'sedan' | 'crossover' | '4x4' | 'no-car';

export interface TripDay {
  id: string;
  dayNumber: number;
  places: Place[];
}

export interface TripPlan {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  vehicleType: VehicleType;
  days: TripDay[];
  interests: string[];
  createdAt: Date;
}

export interface AITripRequest {
  startDate: Date;
  endDate: Date;
  vehicleType: VehicleType;
  interests: string[];
}

export interface AITripSuggestion {
  dayNumber: number;
  placeIds: string[];
  tips: string[];
  warnings: string[];
}

export const vehicleLabels: Record<VehicleType, { ru: string; en: string }> = {
  sedan: { ru: 'Седан', en: 'Sedan' },
  crossover: { ru: 'Кроссовер', en: 'Crossover' },
  '4x4': { ru: 'Внедорожник 4x4', en: '4x4 SUV' },
  'no-car': { ru: 'Без машины', en: 'No car' },
};

export const interestOptions = [
  { id: 'aurora', labelRu: 'Северное сияние', labelEn: 'Northern Lights' },
  { id: 'nature', labelRu: 'Природа', labelEn: 'Nature' },
  { id: 'hiking', labelRu: 'Хайкинг', labelEn: 'Hiking' },
  { id: 'history', labelRu: 'История', labelEn: 'History' },
  { id: 'photo', labelRu: 'Фотография', labelEn: 'Photography' },
  { id: 'villages', labelRu: 'Старинные сёла', labelEn: 'Historic villages' },
];
