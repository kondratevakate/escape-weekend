import { Place } from './kolaPlaces';

export interface IndigenousPeople {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  population: number;
  region: string;
  regionEn: string;
  color: string;
  territory: GeoJSON.Feature;
  culturalCenters: Place[];
}

// GeoJSON polygons for indigenous peoples territories across Russia
// Based on data from Interactive Atlas of Indigenous Peoples (atlaskmns.ru)

const saamiTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'saami' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [28.5, 69.8], [32.0, 70.0], [35.5, 69.5], [40.0, 68.5],
      [41.0, 67.5], [40.5, 66.5], [36.0, 66.0], [32.5, 66.5],
      [28.5, 67.5], [28.5, 69.8],
    ]],
  },
};

const nenetsTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'nenets' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [50.0, 70.5], [60.0, 72.0], [75.0, 73.5], [85.0, 72.0],
      [85.0, 67.0], [75.0, 66.0], [65.0, 66.5], [55.0, 67.0],
      [50.0, 68.0], [50.0, 70.5],
    ]],
  },
};

const khantyTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'khanty' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [60.0, 66.0], [70.0, 66.5], [78.0, 65.0], [78.0, 60.0],
      [72.0, 58.5], [65.0, 59.0], [60.0, 61.0], [60.0, 66.0],
    ]],
  },
};

const mansiTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'mansi' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [58.0, 65.0], [62.0, 65.5], [65.0, 63.0], [63.0, 60.0],
      [59.0, 59.5], [56.0, 61.0], [56.0, 63.5], [58.0, 65.0],
    ]],
  },
};

const evenkiTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'evenki' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [90.0, 72.0], [120.0, 74.0], [140.0, 72.0], [145.0, 65.0],
      [140.0, 58.0], [120.0, 55.0], [100.0, 56.0], [90.0, 60.0],
      [85.0, 66.0], [90.0, 72.0],
    ]],
  },
};

const evensTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'evens' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [130.0, 72.0], [155.0, 71.0], [165.0, 68.0], [165.0, 62.0],
      [155.0, 58.0], [140.0, 58.0], [130.0, 62.0], [128.0, 68.0],
      [130.0, 72.0],
    ]],
  },
};

const chukchiTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'chukchi' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [165.0, 70.0], [175.0, 71.0], [180.0, 70.0], [180.0, 64.0],
      [175.0, 62.0], [165.0, 63.0], [162.0, 66.0], [165.0, 70.0],
    ]],
  },
};

const koryakTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'koryak' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [158.0, 65.0], [168.0, 65.0], [170.0, 62.0], [168.0, 58.0],
      [160.0, 56.0], [155.0, 58.0], [155.0, 62.0], [158.0, 65.0],
    ]],
  },
};

const dolganTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'dolgan' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [95.0, 76.0], [115.0, 77.0], [125.0, 75.0], [120.0, 70.0],
      [105.0, 69.0], [95.0, 71.0], [95.0, 76.0],
    ]],
  },
};

const nanaiTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'nanai' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [130.0, 52.0], [138.0, 53.0], [140.0, 50.0], [137.0, 47.0],
      [132.0, 47.0], [128.0, 49.0], [130.0, 52.0],
    ]],
  },
};

const selkupTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'selkup' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [75.0, 67.0], [85.0, 68.0], [88.0, 65.0], [85.0, 62.0],
      [78.0, 60.0], [73.0, 62.0], [73.0, 65.0], [75.0, 67.0],
    ]],
  },
};

const yukagirTerritory: GeoJSON.Feature = {
  type: 'Feature',
  properties: { peopleId: 'yukagir' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [140.0, 70.0], [160.0, 71.0], [165.0, 68.0], [160.0, 65.0],
      [145.0, 64.0], [138.0, 66.0], [140.0, 70.0],
    ]],
  },
};

// Cultural centers for each people
const saamiCenters: Place[] = [
  {
    id: 'lovozero',
    name: 'Ловозеро',
    nameEn: 'Lovozero',
    description: 'Центр саамской культуры в России',
    category: 'history',
    coordinates: [68.0053, 35.0128],
    region: 'kola',
  },
];

const nenetsCenters: Place[] = [
  {
    id: 'naryan-mar',
    name: 'Нарьян-Мар',
    nameEn: 'Naryan-Mar',
    description: 'Столица Ненецкого автономного округа',
    category: 'history',
    coordinates: [67.6389, 53.0067],
    region: 'nao',
  },
  {
    id: 'salekhard',
    name: 'Салехард',
    nameEn: 'Salekhard',
    description: 'Столица Ямало-Ненецкого автономного округа',
    category: 'history',
    coordinates: [66.5300, 66.6019],
    region: 'yamal',
  },
];

const khantyCenters: Place[] = [
  {
    id: 'khanty-mansiysk',
    name: 'Ханты-Мансийск',
    nameEn: 'Khanty-Mansiysk',
    description: 'Столица Югры, культурный центр хантов и манси',
    category: 'history',
    coordinates: [61.0042, 69.0019],
    region: 'hmao',
  },
];

const evenkiCenters: Place[] = [
  {
    id: 'tura',
    name: 'Тура',
    nameEn: 'Tura',
    description: 'Центр Эвенкийского района',
    category: 'history',
    coordinates: [64.2722, 100.2306],
    region: 'krasnoyarsk',
  },
];

const chukchiCenters: Place[] = [
  {
    id: 'anadyr',
    name: 'Анадырь',
    nameEn: 'Anadyr',
    description: 'Столица Чукотского автономного округа',
    category: 'history',
    coordinates: [64.7333, 177.5167],
    region: 'chukotka',
  },
];

const koryakCenters: Place[] = [
  {
    id: 'palana',
    name: 'Палана',
    nameEn: 'Palana',
    description: 'Центр Корякского округа',
    category: 'history',
    coordinates: [59.0833, 159.9500],
    region: 'kamchatka',
  },
];

const dolganCenters: Place[] = [
  {
    id: 'dudinka',
    name: 'Дудинка',
    nameEn: 'Dudinka',
    description: 'Центр Таймырского района',
    category: 'history',
    coordinates: [69.4058, 86.1778],
    region: 'krasnoyarsk',
  },
];

const nanaiCenters: Place[] = [
  {
    id: 'troitskoye',
    name: 'Троицкое',
    nameEn: 'Troitskoye',
    description: 'Центр Нанайского района',
    category: 'history',
    coordinates: [48.4333, 134.0667],
    region: 'khabarovsk',
  },
];

export const indigenousPeoples: IndigenousPeople[] = [
  {
    id: 'saami',
    name: 'Саамы',
    nameEn: 'Saami',
    description: 'Коренной народ Кольского полуострова, традиционно занимаются оленеводством',
    descriptionEn: 'Indigenous people of the Kola Peninsula, traditionally engaged in reindeer herding',
    population: 1991,
    region: 'Мурманская область',
    regionEn: 'Murmansk Oblast',
    color: 'hsl(340, 65%, 45%)',
    territory: saamiTerritory,
    culturalCenters: saamiCenters,
  },
  {
    id: 'nenets',
    name: 'Ненцы',
    nameEn: 'Nenets',
    description: 'Крупнейший северный народ России, кочевые оленеводы тундры',
    descriptionEn: 'The largest northern people of Russia, nomadic reindeer herders of the tundra',
    population: 45000,
    region: 'Ямал, НАО',
    regionEn: 'Yamal, Nenets Autonomous Okrug',
    color: 'hsl(200, 70%, 45%)',
    territory: nenetsTerritory,
    culturalCenters: nenetsCenters,
  },
  {
    id: 'khanty',
    name: 'Ханты',
    nameEn: 'Khanty',
    description: 'Угорский народ Западной Сибири, охотники и рыболовы',
    descriptionEn: 'Ugric people of Western Siberia, hunters and fishermen',
    population: 31000,
    region: 'ХМАО — Югра',
    regionEn: 'Khanty-Mansiysk Autonomous Okrug',
    color: 'hsl(45, 80%, 45%)',
    territory: khantyTerritory,
    culturalCenters: khantyCenters,
  },
  {
    id: 'mansi',
    name: 'Манси',
    nameEn: 'Mansi',
    description: 'Родственный хантам народ, хранители традиций Северного Урала',
    descriptionEn: 'People related to Khanty, keepers of Northern Ural traditions',
    population: 12000,
    region: 'ХМАО — Югра',
    regionEn: 'Khanty-Mansiysk Autonomous Okrug',
    color: 'hsl(30, 75%, 50%)',
    territory: mansiTerritory,
    culturalCenters: [],
  },
  {
    id: 'evenki',
    name: 'Эвенки',
    nameEn: 'Evenki',
    description: 'Один из крупнейших народов Сибири, расселены от Енисея до Охотского моря',
    descriptionEn: 'One of the largest peoples of Siberia, settled from Yenisei to the Sea of Okhotsk',
    population: 38000,
    region: 'Сибирь, Якутия',
    regionEn: 'Siberia, Yakutia',
    color: 'hsl(142, 60%, 40%)',
    territory: evenkiTerritory,
    culturalCenters: evenkiCenters,
  },
  {
    id: 'evens',
    name: 'Эвены',
    nameEn: 'Evens',
    description: 'Родственный эвенкам народ северо-востока Сибири',
    descriptionEn: 'People related to Evenki from northeastern Siberia',
    population: 22000,
    region: 'Якутия, Магадан',
    regionEn: 'Yakutia, Magadan',
    color: 'hsl(160, 55%, 45%)',
    territory: evensTerritory,
    culturalCenters: [],
  },
  {
    id: 'chukchi',
    name: 'Чукчи',
    nameEn: 'Chukchi',
    description: 'Коренной народ Чукотки, морские охотники и оленеводы',
    descriptionEn: 'Indigenous people of Chukotka, sea hunters and reindeer herders',
    population: 16000,
    region: 'Чукотка',
    regionEn: 'Chukotka',
    color: 'hsl(210, 70%, 50%)',
    territory: chukchiTerritory,
    culturalCenters: chukchiCenters,
  },
  {
    id: 'koryak',
    name: 'Коряки',
    nameEn: 'Koryaks',
    description: 'Народ Камчатки и Магаданской области',
    descriptionEn: 'People of Kamchatka and Magadan Oblast',
    population: 8000,
    region: 'Камчатка',
    regionEn: 'Kamchatka',
    color: 'hsl(280, 50%, 50%)',
    territory: koryakTerritory,
    culturalCenters: koryakCenters,
  },
  {
    id: 'dolgan',
    name: 'Долганы',
    nameEn: 'Dolgans',
    description: 'Самый молодой из народов Севера, сформировался в XIX веке',
    descriptionEn: 'The youngest of northern peoples, formed in the 19th century',
    population: 8000,
    region: 'Таймыр',
    regionEn: 'Taymyr',
    color: 'hsl(15, 70%, 50%)',
    territory: dolganTerritory,
    culturalCenters: dolganCenters,
  },
  {
    id: 'nanai',
    name: 'Нанайцы',
    nameEn: 'Nanai',
    description: 'Народ Приамурья, искусные рыболовы реки Амур',
    descriptionEn: 'People of the Amur region, skilled fishermen of the Amur River',
    population: 12000,
    region: 'Хабаровский край',
    regionEn: 'Khabarovsk Krai',
    color: 'hsl(180, 60%, 40%)',
    territory: nanaiTerritory,
    culturalCenters: nanaiCenters,
  },
  {
    id: 'selkup',
    name: 'Селькупы',
    nameEn: 'Selkups',
    description: 'Самодийский народ Западной Сибири',
    descriptionEn: 'Samoyedic people of Western Siberia',
    population: 4000,
    region: 'Красноярский край, ЯНАО',
    regionEn: 'Krasnoyarsk Krai, Yamalo-Nenets AO',
    color: 'hsl(60, 65%, 45%)',
    territory: selkupTerritory,
    culturalCenters: [],
  },
  {
    id: 'yukagir',
    name: 'Юкагиры',
    nameEn: 'Yukaghirs',
    description: 'Древний народ Северо-Восточной Сибири, один из самых малочисленных',
    descriptionEn: 'Ancient people of Northeastern Siberia, one of the smallest in number',
    population: 1600,
    region: 'Якутия',
    regionEn: 'Yakutia',
    color: 'hsl(320, 55%, 50%)',
    territory: yukagirTerritory,
    culturalCenters: [],
  },
];

// Get all cultural centers as Place array
export const getAllCulturalCenters = (): Place[] => {
  return indigenousPeoples.flatMap(people => people.culturalCenters);
};

// Get people by ID
export const getPeopleById = (id: string): IndigenousPeople | undefined => {
  return indigenousPeoples.find(p => p.id === id);
};

// Legacy export for backward compatibility
export const saamiHistoryPlaces = indigenousPeoples.find(p => p.id === 'saami')?.culturalCenters || [];
export const saamiTerritoryGeoJSON = saamiTerritory;

// Attribution text for the layer
export const indigenousPeoplesAttribution = {
  ru: 'Данные о коренных народах: Интерактивный атлас КМНС (atlaskmns.ru)',
  en: 'Indigenous peoples data: Interactive Atlas of Indigenous Peoples (atlaskmns.ru)',
};
