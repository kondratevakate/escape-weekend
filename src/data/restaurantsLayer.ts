import { Place } from './kolaPlaces';

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  region: string;
  coordinates: [number, number];
  cuisine_type: string;
  description: string;
  signature_dish: string;
  price_range: string;
  rating: string | null;
  rating_source: string | null;
  awards: string[];
  only_here: boolean;
  photo_url: string;
}

export const restaurants: Restaurant[] = [
  { id: "mishka", name: "MISHKA", city: "Паратунка", region: "kamchatka", coordinates: [52.88, 158.72], cuisine_type: "Авторская тихоокеанская", description: "В оранжерее у горячих источников с видом на вулкан.", signature_dish: "Камчатский краб, чавыча", price_range: "₽₽₽", rating: "4.8", rating_source: "2ГИС", awards: ["WhereToEat", "Пальмовая ветвь 2022"], only_here: true, photo_url: "" },
  { id: "dva-morya", name: "Два моря. Океан", city: "Петропавловск-Камчатский", region: "kamchatka", coordinates: [53.01, 158.65], cuisine_type: "Тихоокеанская fine dining", description: "Интерьер — морское дно, сомелье по устрицам.", signature_dish: "Олюторская сельдь копчения, строганоф из трубача", price_range: "₽₽₽", rating: null, rating_source: null, awards: ["Пальмовая ветвь 2023", "WhereToEat топ-10"], only_here: true, photo_url: "" },
  { id: "ryba-mechty", name: "Рыба моей мечты", city: "Южно-Сахалинск", region: "sakhalin", coordinates: [46.96, 142.74], cuisine_type: "Морепродукты", description: "Живые аквариумы 2.5 тонны воды, 4 вида камчатского краба.", signature_dish: "Живой краб, морской ёж, палтус", price_range: "₽₽₽", rating: null, rating_source: null, awards: ["WhereToEat"], only_here: true, photo_url: "" },
  { id: "chochur-muran", name: "Чочур Муран", city: "Якутск", region: "yakutia", coordinates: [62.03, 129.73], cuisine_type: "Якутская этно", description: "Деревянный острог, питомник лаек, царство вечной мерзлоты рядом.", signature_dish: "Строганина из чира, хаса, бургер из жеребятины", price_range: "₽₽", rating: "3.9", rating_source: "2ГИС", awards: [], only_here: true, photo_url: "" },
  { id: "machtal", name: "Махтал", city: "Якутск", region: "yakutia", coordinates: [62.04, 129.74], cuisine_type: "Якутская авторская", description: "3× Гран-при «Вкус Якутии», 21+ блюдо из жеребятины.", signature_dish: "Колбаска из печени, оленина с голубикой", price_range: "₽₽", rating: null, rating_source: null, awards: ["Лучший 2025 2ГИС"], only_here: true, photo_url: "" },
  { id: "tengis", name: "Тэнгис", city: "Улан-Удэ", region: "buryatia", coordinates: [51.83, 107.60], cuisine_type: "Бурятская", description: "Мэппинг-шоу «Один день кочевника» прямо на стол.", signature_dish: "Буузы 5 видов, хаан-бууза", price_range: "₽₽", rating: null, rating_source: null, awards: ["Travelers Choice TripAdvisor"], only_here: true, photo_url: "" },
  { id: "vyuga", name: "VYЮГА", city: "Листвянка", region: "baikal", coordinates: [51.85, 104.85], cuisine_type: "Fine dining сибирская", description: "Вид на Байкал, фирменный десерт «Шаман-камень».", signature_dish: "Байкальский хариус, десерт Шаман-камень", price_range: "₽₽₽", rating: null, rating_source: null, awards: ["Лучший 2025 2ГИС"], only_here: true, photo_url: "" },
  { id: "narym", name: "Нарым", city: "Томск", region: "tomsk", coordinates: [56.50, 84.97], cuisine_type: "New Nordic Siberian", description: "В памятнике деревянного зодчества XIX века, винный погреб в подвале.", signature_dish: "Тартар из муксуна, говяжье сердце в хвойной глазури", price_range: "₽₽", rating: "4.7", rating_source: "2ГИС", awards: ["WhereToEat топ-10 Siberia"], only_here: false, photo_url: "" },
  { id: "timian", name: "ТиманЪ", city: "Нарьян-Мар", region: "nao", coordinates: [67.63, 53.00], cuisine_type: "Северная, музей", description: "Чум, звёздное небо, снегоход «Буран» в интерьере, собственная пивоварня.", signature_dish: "Ростбиф из оленя, моченая морошка", price_range: "₽₽", rating: "4.0", rating_source: "TripAdvisor", awards: ["#1 TripAdvisor Нарьян-Мар"], only_here: true, photo_url: "" },
  { id: "dikiy-sever", name: "Дикий Север", city: "Магадан", region: "magadan", coordinates: [59.56, 150.80], cuisine_type: "Арктическая авторская", description: "Фигура косатки под потолком. Гастроужины с художниками.", signature_dish: "Магаданские креветки, стейк из лося", price_range: "₽₽₽", rating: null, rating_source: null, awards: [], only_here: true, photo_url: "" },
  { id: "simha", name: "Симха", city: "Биробиджан", region: "eao", coordinates: [48.80, 132.95], cuisine_type: "Еврейская кошерная", description: "Единственный ресторан еврейской кухни в России за пределами Москвы.", signature_dish: "Гефилте фиш, форшмак, фалафель", price_range: "₽", rating: "4.4", rating_source: "2ГИС", awards: ["#1 TripAdvisor Биробиджан"], only_here: true, photo_url: "" },
  { id: "okhota", name: "Охота", city: "Салехард", region: "yanao", coordinates: [66.53, 66.60], cuisine_type: "Северная ямальская", description: "Камерная, строганина из муксуна, настойки на морошке.", signature_dish: "Пельмени с олениной, строганина", price_range: "₽₽₽", rating: null, rating_source: null, awards: [], only_here: false, photo_url: "" },
  { id: "ivolga", name: "Иволга (IVOLGA)", city: "Благовещенск", region: "amur", coordinates: [50.29, 127.53], cuisine_type: "Дальневосточная авторская", description: "Шеф стажировался в Японии и Вьетнаме. Пельмени «Амур» — знак качества региона.", signature_dish: "Пельмени Амур, оленина, живые морепродукты", price_range: "₽₽", rating: null, rating_source: null, awards: ["Золотой Меркурий 2025", "WhereToEat топ-50"], only_here: false, photo_url: "" },
  { id: "misne", name: "Миснэ", city: "Ханты-Мансийск", region: "hmao", coordinates: [60.97, 69.14], cuisine_type: "Угорская северная", description: "В парке «Самаровский Чугас», этнографические программы.", signature_dish: "Перепечина с муксуном, стерлядь по-хантымансийски", price_range: "₽₽", rating: "4.3", rating_source: "TripAdvisor", awards: ["#1 TripAdvisor Ханты-Мансийск"], only_here: true, photo_url: "" },
];

/** Convert restaurants to Place[] for map display */
export const restaurantPlaces: Place[] = restaurants.map(r => ({
  id: `resto-${r.id}`,
  name: r.name,
  nameEn: undefined,
  description: `${r.cuisine_type} · ${r.city}`,
  category: 'restaurant' as const,
  coordinates: r.coordinates,
  region: r.region,
}));

/** Get restaurant by place ID */
export const getRestaurantById = (placeId: string): Restaurant | undefined => {
  const id = placeId.replace('resto-', '');
  return restaurants.find(r => r.id === id);
};
