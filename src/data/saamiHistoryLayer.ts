import { Place } from './kolaPlaces';

// GeoJSON polygon for Saami historical territory on Kola Peninsula
// Based on data from Interactive Atlas of Indigenous Peoples (atlaskmns.ru)
export const saamiTerritoryGeoJSON = {
  type: 'Feature' as const,
  properties: { 
    name: 'Территория саамов',
    nameEn: 'Saami Territory',
    description: 'Историческая территория расселения саамского народа на Кольском полуострове',
  },
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      // GeoJSON uses [lng, lat] format
      [28.5, 69.8],   // NW - near Norway border
      [32.0, 70.0],   // N - Rybachy peninsula
      [35.5, 69.5],   // NE - Teriberka area
      [40.0, 68.5],   // E - eastern coast
      [41.0, 67.5],   // SE
      [40.5, 66.5],   // S - near White Sea
      [36.0, 66.0],   // SW - Tersky coast
      [32.5, 66.5],   // SW - Kandalaksha area
      [28.5, 67.5],   // W - near border
      [28.5, 69.8],   // close polygon
    ]],
  },
};

// Saami cultural points of interest
export const saamiHistoryPlaces: Place[] = [
  {
    id: 'lovozero',
    name: 'Ловозеро',
    nameEn: 'Lovozero',
    description: 'Центр саамской культуры в России. Здесь проживает большинство российских саамов.',
    category: 'history',
    coordinates: [68.0053, 35.0128],
    region: 'kola',
  },
  {
    id: 'saami-museum',
    name: 'Музей истории саамского народа',
    nameEn: 'Saami History Museum',
    description: 'Этнографический музей в Ловозере, посвящённый культуре и быту саамов.',
    category: 'history',
    coordinates: [68.0083, 35.0167],
    region: 'kola',
  },
  {
    id: 'seydozero-sacred',
    name: 'Сейдозеро (священное)',
    nameEn: 'Lake Seydozero (sacred)',
    description: 'Священное озеро саамов. Название происходит от "сейд" — священный камень.',
    category: 'history',
    coordinates: [67.8167, 34.8500],
    region: 'kola',
  },
  {
    id: 'revda-museum',
    name: 'Краеведческий музей Ревды',
    nameEn: 'Revda Local History Museum',
    description: 'Музей с экспозицией, посвящённой саамской культуре и оленеводству.',
    category: 'history',
    coordinates: [68.0500, 34.5500],
    region: 'kola',
  },
  {
    id: 'sam-syyt',
    name: 'Сам-Сыйт (саамская деревня)',
    nameEn: 'Sam-Syyt (Saami village)',
    description: 'Этнографический комплекс саамской культуры близ Ловозера.',
    category: 'history',
    coordinates: [68.0200, 35.1000],
    region: 'kola',
  },
  {
    id: 'olenegorsk-history',
    name: 'Оленегорск (исторический)',
    nameEn: 'Olenegorsk (historical)',
    description: 'Исторический центр оленеводства. Название города переводится как "оленья гора".',
    category: 'history',
    coordinates: [68.1400, 33.2800],
    region: 'kola',
  },
];

// Attribution text for the layer
export const saamiLayerAttribution = {
  ru: 'Данные о саамах: Интерактивный атлас КМНС (atlaskmns.ru)',
  en: 'Saami data: Interactive Atlas of Indigenous Peoples (atlaskmns.ru)',
};
