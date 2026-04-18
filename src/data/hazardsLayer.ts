// Hazards & travel warnings on Kola Peninsula
// Data based on real cases, news reports, and known seasonal issues

export type HazardType =
  | 'road_closure'
  | 'spring_washout'
  | 'summer_snow'
  | 'tourist_incident'
  | 'no_signal'
  | 'transport_gap'
  | 'polar_night'
  | 'border_zone'
  | 'avalanche';

export type HazardSeverity = 'info' | 'warning' | 'danger';

export interface Hazard {
  id: string;
  name: { ru: string; en: string };
  coordinates: [number, number];
  type: HazardType;
  severity: HazardSeverity;
  season: number[]; // months 1-12, empty array = all year
  description: { ru: string; en: string };
  advice: { ru: string; en: string };
  source?: string;
}

export const hazardEmoji: Record<HazardType, string> = {
  road_closure: '🚧',
  spring_washout: '🌊',
  summer_snow: '❄️',
  tourist_incident: '🚨',
  no_signal: '📡',
  transport_gap: '🚐',
  polar_night: '🌑',
  border_zone: '🛂',
  avalanche: '🏔️',
};

export const severityColor: Record<HazardSeverity, { bg: string; border: string }> = {
  info:    { bg: 'hsl(45, 93%, 90%)',  border: 'hsl(45, 93%, 47%)' },
  warning: { bg: 'hsl(25, 95%, 88%)',  border: 'hsl(25, 95%, 53%)' },
  danger:  { bg: 'hsl(0, 84%, 90%)',   border: 'hsl(0, 84%, 50%)' },
};

export const hazards: Hazard[] = [
  {
    id: 'haz-teriberka-road',
    name: { ru: 'Дорога в Териберку', en: 'Road to Teriberka' },
    coordinates: [69.0, 35.05],
    type: 'road_closure',
    severity: 'danger',
    season: [11, 12, 1, 2, 3, 4],
    description: {
      ru: 'Зимой дорогу регулярно закрывают из-за метелей и снежных заносов. Иногда — на несколько дней.',
      en: 'In winter the road is frequently closed due to blizzards and snowdrifts, sometimes for several days.',
    },
    advice: {
      ru: 'Перед выездом проверить статус дороги на сайте Мурманскавтодор. Иметь запас еды/воды/топлива. Телефон ЦУКС 112.',
      en: 'Check road status on Murmanskavtodor before departure. Carry food/water/fuel reserves. Emergency: 112.',
    },
    source: 'https://murmanskavtodor.ru',
  },
  {
    id: 'haz-khibiny-summer-snow',
    name: { ru: 'Хибины — снег летом', en: 'Khibiny — summer snow' },
    coordinates: [67.72, 33.65],
    type: 'summer_snow',
    severity: 'warning',
    season: [6, 7, 8],
    description: {
      ru: 'На перевалах (Часначорр, Кукисвумчорр) снежники держатся всё лето, особенно опасны на спусках после дождя.',
      en: 'On Khibiny passes (Chasnachorr, Kukisvumchorr) snowfields remain all summer, dangerous on descents after rain.',
    },
    advice: {
      ru: 'Брать треккинговые палки и кошки даже в июле. Не ходить в одиночку. Регистрироваться в МЧС.',
      en: 'Take trekking poles and crampons even in July. Do not hike alone. Register with rescue services.',
    },
  },
  {
    id: 'haz-murman-tundra-incident',
    name: { ru: 'Мурманские тундры — гибель туристов', en: 'Murman tundra — fatal incidents' },
    coordinates: [68.45, 35.5],
    type: 'tourist_incident',
    severity: 'danger',
    season: [],
    description: {
      ru: 'Известны случаи гибели туристов на трейл-забегах и треках: переохлаждение, потеря ориентации в тумане, отсутствие связи.',
      en: 'Known fatalities on trail runs and treks: hypothermia, disorientation in fog, no signal.',
    },
    advice: {
      ru: 'Спутниковый трекер (Garmin inReach / Zoleo) обязателен. Регистрация в МЧС. Не выходить в одиночку.',
      en: 'Satellite tracker (Garmin inReach / Zoleo) mandatory. Register with rescue. Never go solo.',
    },
  },
  {
    id: 'haz-kirovsk-umba',
    name: { ru: 'Дорога Кировск–Умба', en: 'Kirovsk–Umba road' },
    coordinates: [67.4, 34.2],
    type: 'spring_washout',
    severity: 'warning',
    season: [4, 5],
    description: {
      ru: 'Весной грунтовку размывает паводком, могут быть промоины и закрытые участки.',
      en: 'In spring the gravel road gets washed out, with potholes and closed sections.',
    },
    advice: {
      ru: 'Лучше проезжать в июне или объезжать через Кандалакшу. Полный привод желателен.',
      en: 'Better to travel in June or take a detour via Kandalaksha. 4WD recommended.',
    },
  },
  {
    id: 'haz-rybachy-no-signal',
    name: { ru: 'Полуостров Рыбачий — нет связи', en: 'Rybachy Peninsula — no signal' },
    coordinates: [69.7, 32.5],
    type: 'no_signal',
    severity: 'warning',
    season: [],
    description: {
      ru: 'На большей части полуострова нет сотовой связи. Эвакуация в случае ЧП — несколько часов.',
      en: 'No cellular coverage across most of the peninsula. Emergency evacuation can take hours.',
    },
    advice: {
      ru: 'Спутниковый трекер с SOS. Сообщить маршрут близким. Запас еды и топлива на +2 дня.',
      en: 'Satellite tracker with SOS. Share route with someone. +2 days of food and fuel reserves.',
    },
  },
  {
    id: 'haz-tersky-transport',
    name: { ru: 'Терский берег — мало транспорта', en: 'Tersky coast — limited transport' },
    coordinates: [66.7, 34.35],
    type: 'transport_gap',
    severity: 'warning',
    season: [],
    description: {
      ru: 'Автобус Кандалакша–Умба–Варзуга ходит 1 раз в день, дальше — только попутки или такси.',
      en: 'Bus from Kandalaksha runs once a day; further east — only hitchhiking or taxi.',
    },
    advice: {
      ru: 'Заранее планировать обратный билет. Иметь контакты местных таксистов.',
      en: 'Book return tickets in advance. Save contacts of local taxi drivers.',
    },
  },
  {
    id: 'haz-lovozero-weather',
    name: { ru: 'Ловозерские тундры — резкая погода', en: 'Lovozero tundra — sudden weather' },
    coordinates: [67.85, 34.65],
    type: 'tourist_incident',
    severity: 'danger',
    season: [],
    description: {
      ru: 'Известная аномальная зона. Резкие изменения погоды, туманы, известные случаи гибели групп туристов.',
      en: 'Known anomalous zone. Sudden weather changes, fog, documented fatalities of tourist groups.',
    },
    advice: {
      ru: 'Регистрация в МЧС обязательна. Прогноз погоды + запас по дням. Спутниковая связь.',
      en: 'Mandatory registration with rescue. Check weather + extra days reserve. Satellite communications.',
    },
  },
  {
    id: 'haz-polar-night',
    name: { ru: 'Полярная ночь', en: 'Polar night' },
    coordinates: [68.97, 33.07],
    type: 'polar_night',
    severity: 'info',
    season: [12, 1],
    description: {
      ru: 'С начала декабря до середины января солнце не встаёт. Видимость ограничена, дороги обледенелые.',
      en: 'From early December to mid-January the sun does not rise. Limited visibility, icy roads.',
    },
    advice: {
      ru: 'Тёплая одежда (–25°C и ниже), фонарик, шипованная резина на машине. Витамин D.',
      en: 'Warm clothing (–25°C and below), flashlight, studded tires. Vitamin D supplements.',
    },
  },
  {
    id: 'haz-gremikha-border',
    name: { ru: 'Островной (Гремиха) — погранзона', en: 'Ostrovnoy (Gremikha) — border zone' },
    coordinates: [68.05, 39.5],
    type: 'border_zone',
    severity: 'info',
    season: [],
    description: {
      ru: 'Закрытое административно-территориальное образование. Без пропуска ФСБ въезд запрещён.',
      en: 'Closed administrative-territorial formation. Entry without FSB permit is prohibited.',
    },
    advice: {
      ru: 'Заявку на пропуск подавать за 30+ дней. Иностранцам — за 60+ дней.',
      en: 'Submit permit application 30+ days in advance. Foreigners: 60+ days.',
    },
  },
  {
    id: 'haz-kuelporr-avalanche',
    name: { ru: 'Куэльпорр — лавиноопасно', en: 'Kuelporr — avalanche zone' },
    coordinates: [67.75, 33.55],
    type: 'avalanche',
    severity: 'danger',
    season: [1, 2, 3, 4],
    description: {
      ru: 'Официально лавиноопасная зона. В Хибинах ежегодно сходят лавины, есть жертвы среди фрирайдеров.',
      en: 'Officially avalanche-prone zone. Avalanches occur annually in Khibiny, with freerider casualties.',
    },
    advice: {
      ru: 'Лавинный датчик + лопата + щуп. Проверка прогноза в Центре лавинной безопасности Апатитов.',
      en: 'Avalanche beacon + shovel + probe. Check forecast at Apatity Avalanche Safety Center.',
    },
  },
];

export const getActiveHazards = (month?: number): Hazard[] => {
  if (!month) return hazards;
  return hazards.filter(h => h.season.length === 0 || h.season.includes(month));
};
