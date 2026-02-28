import locationsData from './locations.json';
import { Place, PlaceCategory } from './kolaPlaces';

// Re-export types and config for backward compatibility
export type { Place, PlaceCategory } from './kolaPlaces';
export { categoryConfig } from './kolaPlaces';

export interface LocationWarnings {
  permit?: { required: boolean; description: string; link: string };
  road?: { seasonal_closure: boolean; description: string; bad_months: string[] };
  crowds?: { peak_months: string[]; description: string };
  closures?: { sanitary_days: string; seasonal: string };
  traveler_issues?: string[];
}

export interface OnlyHereItem {
  name: string;
  where: string;
  description: string;
}

export interface OnlyHereExperience extends OnlyHereItem {
  months: string[];
}

export interface OnlyHere {
  food?: OnlyHereItem[];
  experience?: OnlyHereExperience[];
  buy?: OnlyHereItem[];
}

export interface SafetyIncident {
  title: string;
  what_happened: string;
  lesson: string;
  risk_months: string[];
}

export interface Safety {
  incidents?: SafetyIncident[];
  go_with?: { name: string; description: string; link?: string }[];
  essentials?: string[];
}

export interface Location {
  id: string;
  name: string;
  name_en: string;
  description: string;
  coordinates: [number, number];
  region: string;
  tags: string[];
  season: string[];
  what_to_do: string;
  pairing: string;
  permit_required: boolean;
  hidden_gem: boolean;
  photo_url: string;
  warnings?: LocationWarnings;
  only_here?: OnlyHere;
  safety?: Safety;
}

const tagToCategoryMap: Record<string, PlaceCategory> = {
  nature: 'nature',
  hiking: 'hiking',
  museums: 'museum',
  attractions: 'attraction',
  villages: 'village',
  cities: 'city',
  reserves: 'reserve',
  history: 'history',
  unesco: 'unesco',
};

function inferCategory(tags: string[]): PlaceCategory {
  for (const tag of tags) {
    if (tagToCategoryMap[tag]) return tagToCategoryMap[tag];
  }
  return 'nature';
}

function toPlace(loc: Location): Place {
  return {
    id: loc.id,
    name: loc.name,
    nameEn: loc.name_en,
    description: loc.description,
    category: inferCategory(loc.tags),
    coordinates: loc.coordinates,
    region: loc.region,
    whenToVisit: loc.season.join(', '),
    howToGet: loc.what_to_do !== 'TODO: fill in' ? loc.what_to_do : undefined,
    warning: loc.permit_required ? 'Permit required' : undefined,
  };
}

export const locations: Location[] = locationsData as Location[];
export const kolaPlaces: Place[] = locations.map(toPlace);

/** Get Location data by place ID */
export function getLocationById(id: string): Location | undefined {
  return locations.find(loc => loc.id === id);
}
