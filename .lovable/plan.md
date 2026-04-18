
## Карта опасностей и предупреждений (Hazards Layer)

Добавлю новый слой «Опасности» — переключаемый слой с маркерами реальных опасных мест Кольского полуострова и инфо-карточками.

## Тип данных

Новый файл `src/data/hazardsLayer.ts` с типом:
```ts
interface Hazard {
  id: string;
  name: { ru: string; en: string };
  coordinates: [number, number];
  type: 'road_closure' | 'spring_washout' | 'summer_snow' | 'tourist_incident' | 'no_signal' | 'transport_gap';
  severity: 'info' | 'warning' | 'danger';
  season: string[]; // месяцы когда актуально
  description: { ru: string; en: string };
  advice: { ru: string; en: string };
  source?: string; // ссылка на новость/источник
}
```

## Контент (8-10 реальных кейсов по Кольскому)

1. **Териберка — дорога зимой** (road_closure, danger, ноя–апр) — закрывают при метели, проверять перед выездом, телефон ЦУКС.
2. **Хибины — летний снег на перевалах** (summer_snow, warning, июн–авг) — Часночорр, Кукисвумчорр.
3. **Мурманские тундры — гибель туриста на треке** (tourist_incident, danger, all year) — реальный кейс, ссылка на новость.
4. **Дорога Кировск–Умба весной** (spring_washout, warning, апр–май) — размывает, объезд.
5. **Полуостров Рыбачий — нет связи** (no_signal, info, all year) — спутниковый трекер обязателен.
6. **Терский берег — мало транспорта** (transport_gap, warning, all year) — 1 автобус в день, планировать обратный.
7. **Ловозерские тундры — резкая смена погоды** (tourist_incident, danger, all year) — известные смерти, регистрация в МЧС.
8. **Полярная ночь дек–янв** (info, danger зимой) — ограниченная видимость, тёплая одежда.
9. **Гремиха / Островной — пограничная зона** (info, all year) — пропуск ФСБ нужен.
10. **Куэльпорр — лавиноопасно** (warning, янв–апр) — официальная зона.

## Изменения

### `src/data/hazardsLayer.ts` (новый)
Массив hazards + utility-функции.

### `src/components/map/MapView.tsx`
- Новый ref `hazardsLayerRef: L.LayerGroup`
- Новый useEffect: при `showHazardsLayer` — рисует маркеры с эмодзи по типу (⚠️ 🚧 ❄️ 🚨 📡 🚐 🌪️ 🌑 🛂) и cluster-стилем
- Цвет рамки маркера зависит от severity (info=жёлтый, warning=оранжевый, danger=красный)
- Клик по маркеру → popup или вызов `onHazardClick` (для будущей карточки)
- Пропсы: `showHazardsLayer`, `onToggleHazardsLayer`

### `src/components/map/CategoryFilter.tsx`
- Новый item: `hazards` с иконкой `AlertTriangle` (lucide), label «Опасности» / «Hazards»
- Бейдж с количеством активных опасностей (опционально на будущее)

### `src/components/map/KolaMap.tsx` и `src/pages/Index.tsx`
- Добавить `useState` `showHazardsLayer` + проброс пропсов

### `src/lib/i18n.ts`
- Переводы: `hazards.title`, `hazards.subtitle`, `hazards.types.*`, `hazards.severity.*`

## Визуал маркера
Жёлто-оранжево-красный круг с эмодзи внутри + пульсирующая обводка для `danger`. Размер чуть меньше обычных маркеров мест (28px), чтобы не доминировать.

## Поведение popup
Leaflet popup с:
- Заголовок + бейдж серьёзности
- Период (сезон)
- Описание (что не так)
- Совет (что делать)
- Ссылка на источник если есть

## Файлы создать/изменить
- ✏️ создать `src/data/hazardsLayer.ts`
- ✏️ изменить `src/components/map/MapView.tsx` (+ref, +effect, +pропсы)
- ✏️ изменить `src/components/map/CategoryFilter.tsx` (+1 пункт)
- ✏️ изменить `src/components/map/KolaMap.tsx` (+state, +props)
- ✏️ изменить `src/pages/Index.tsx` (+state, +props)
- ✏️ изменить `src/lib/i18n.ts` (+переводы)

## Итог
Пользователь видит в правой панели новую кнопку ⚠️ «Опасности». Включает — на карте появляются маркеры реальных опасных точек Кольского. Клик — popup с описанием опасности, периодом и советом, как себя вести.
