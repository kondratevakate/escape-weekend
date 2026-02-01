export type PlaceCategory = 
  | 'nature' 
  | 'hiking' 
  | 'museum' 
  | 'attraction' 
  | 'village' 
  | 'city' 
  | 'reserve'
  | 'history';

export interface Place {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  category: PlaceCategory;
  coordinates: [number, number]; // [lat, lng]
  region: string;
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
};

export const kolaPlaces: Place[] = [
  // Природа
  {
    id: 'teriberka',
    name: 'Териберка',
    nameEn: 'Teriberka',
    description: 'Знаменитое село на берегу Баренцева моря, место съёмок фильма "Левиафан"',
    category: 'nature',
    coordinates: [69.1647, 35.1258],
    region: 'kola',
  },
  {
    id: 'seydozero',
    name: 'Сейдозеро',
    nameEn: 'Lake Seydozero',
    description: 'Священное озеро саамов в Ловозерских тундрах',
    category: 'nature',
    coordinates: [67.8167, 34.8500],
    region: 'kola',
  },
  {
    id: 'dalnie-zelentsy',
    name: 'Дальние Зеленцы',
    nameEn: "Dal'nie Zelentsy",
    description: 'Заброшенный посёлок морских биологов на побережье',
    category: 'nature',
    coordinates: [69.1167, 36.0667],
    region: 'kola',
  },
  {
    id: 'rybachy',
    name: 'Полуостров Рыбачий',
    nameEn: 'Rybachy Peninsula',
    description: 'Самая северная точка европейской части России',
    category: 'nature',
    coordinates: [69.9500, 32.5000],
    region: 'kola',
  },
  {
    id: 'sredny',
    name: 'Полуостров Средний',
    nameEn: 'Sredny Peninsula',
    description: 'Арктические пейзажи и следы войны',
    category: 'nature',
    coordinates: [69.7833, 31.8833],
    region: 'kola',
  },
  
  // Хайкинг
  {
    id: 'lovozero-tundra',
    name: 'Ловозерские тундры',
    nameEn: 'Lovozero Tundra',
    description: 'Горный массив с уникальными минералами и священными местами саамов',
    category: 'hiking',
    coordinates: [67.8333, 34.7500],
    region: 'kola',
  },
  {
    id: 'alluayv',
    name: 'Аллуайв и Перевал Геологов',
    nameEn: 'Alluayv',
    description: 'Высшая точка Ловозерских тундр (1120 м)',
    category: 'hiking',
    coordinates: [67.8500, 34.6333],
    region: 'kola',
  },
  {
    id: 'khibiny',
    name: 'Хибины',
    nameEn: 'Khibiny Mountains',
    description: 'Крупнейший горный массив Кольского полуострова',
    category: 'hiking',
    coordinates: [67.7500, 33.7167],
    region: 'kola',
  },
  {
    id: 'volosyanaya',
    name: 'Гора Волосяная',
    nameEn: 'Gora Volosyanaya',
    description: 'Живописная вершина с панорамными видами',
    category: 'hiking',
    coordinates: [67.6833, 34.1167],
    region: 'kola',
  },
  
  // Музеи
  {
    id: 'murmansk-museum',
    name: 'Мурманский краеведческий музей',
    nameEn: 'Murmansk Regional Museum',
    description: 'Главный музей истории и природы Кольского полуострова',
    category: 'museum',
    coordinates: [68.9733, 33.0856],
    region: 'kola',
  },
  
  // Достопримечательности
  {
    id: 'sneznaya-derevnya',
    name: 'Снежная Деревня',
    nameEn: 'Snezhnaya Derevnya',
    description: 'Уникальный комплекс ледяных скульптур',
    category: 'attraction',
    coordinates: [67.6167, 33.6667],
    region: 'kola',
  },
  {
    id: 'tonya-tetrina',
    name: 'Тоня Тетрина',
    nameEn: 'Tonya Tetrina',
    description: 'Историко-этнографический комплекс поморской культуры',
    category: 'attraction',
    coordinates: [66.5833, 33.2000],
    region: 'kola',
  },
  {
    id: 'prichal-11',
    name: 'Причал №11',
    nameEn: 'Pier 11',
    description: 'Туристический комплекс на берегу',
    category: 'attraction',
    coordinates: [69.0833, 33.4167],
    region: 'kola',
  },
  {
    id: 'sunken-ships',
    name: 'Затонувшие корабли',
    nameEn: 'Sunken Ships',
    description: 'Кладбище кораблей в Териберке',
    category: 'attraction',
    coordinates: [69.1639, 35.1197],
    region: 'kola',
  },
  
  // Заповедники
  {
    id: 'pasvik',
    name: 'Пасвик',
    nameEn: 'Pasvik Nature Reserve',
    description: 'Заповедник на границе трёх стран',
    category: 'reserve',
    coordinates: [69.2500, 29.2167],
    region: 'kola',
  },
  
  // Сёла
  {
    id: 'umba',
    name: 'Умба',
    nameEn: 'Umba',
    description: 'Старинное поморское село на Терском берегу',
    category: 'village',
    coordinates: [66.6833, 34.3500],
    region: 'kola',
  },
  {
    id: 'varzuga',
    name: 'Варзуга',
    nameEn: 'Varzuga',
    description: 'Одно из древнейших сёл Кольского полуострова',
    category: 'village',
    coordinates: [66.3936, 36.6275],
    region: 'kola',
  },
  {
    id: 'chavanga',
    name: 'Чаваньга',
    nameEn: "Chavan'ga",
    description: 'Отдалённое село на берегу Белого моря',
    category: 'village',
    coordinates: [66.1333, 37.7833],
    region: 'kola',
  },
  {
    id: 'kuzomen',
    name: 'Кузомень',
    nameEn: 'Kuzomen',
    description: 'Село с песчаными дюнами — "пустыня" Кольского',
    category: 'village',
    coordinates: [66.2833, 36.8500],
    region: 'kola',
  },
  {
    id: 'ura-guba',
    name: 'Ура-Губа',
    nameEn: 'Ura-Guba',
    description: 'Село в живописном фьорде',
    category: 'village',
    coordinates: [69.2500, 32.8167],
    region: 'kola',
  },
  
  // Города
  {
    id: 'murmansk',
    name: 'Мурманск',
    nameEn: 'Murmansk',
    description: 'Крупнейший город за Полярным кругом',
    category: 'city',
    coordinates: [68.9585, 33.0827],
    region: 'kola',
  },
  {
    id: 'kirovsk',
    name: 'Кировск',
    nameEn: 'Kirovsk',
    description: 'Горнолыжный курорт в Хибинах',
    category: 'city',
    coordinates: [67.6136, 33.6614],
    region: 'kola',
  },
  {
    id: 'monchegorsk',
    name: 'Мончегорск',
    nameEn: 'Monchegorsk',
    description: 'Город у Ловозерских тундр',
    category: 'city',
    coordinates: [67.9333, 32.8500],
    region: 'kola',
  },
  {
    id: 'kandalaksha',
    name: 'Кандалакша',
    nameEn: 'Kandalaksha',
    description: 'Древний город у Белого моря',
    category: 'city',
    coordinates: [67.1500, 32.4167],
    region: 'kola',
  },
  {
    id: 'apatity',
    name: 'Апатиты',
    nameEn: 'Apatity',
    description: 'Научный центр Кольского полуострова',
    category: 'city',
    coordinates: [67.5667, 33.4000],
    region: 'kola',
  },
];
