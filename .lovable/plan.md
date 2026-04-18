
Добавлю три новых слоя на карту: световое загрязнение, дороги и туристическая нагрузка.

## 1. Световое загрязнение (Light Pollution)
Использую публичный тайл-сервер **Light Pollution Map** от djlorenz (jshine.net) — стандартная атласная подложка ночного неба, бесплатно, без ключа:
- Тайлы: `https://djlorenz.github.io/astronomy/lp2022/overlay/tiles/tile_{z}_{x}_{y}.png` (overlay, прозрачный)
- Накладывается поверх базовой карты с opacity ~0.7
- Иконка: `Moon` из lucide
- Кнопка: «Световое загрязнение» / «Light Pollution»

## 2. Дороги
Использую **OpenStreetMap Transport** или специализированный road-overlay. Лучший бесплатный вариант — **CartoDB Voyager** (выделяет дорожную сеть ярко) или **Esri World Transportation** (чистый road overlay):
- Тайлы: `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}` (overlay)
- Иконка: `Route` из lucide
- Кнопка: «Дороги» / «Roads»

## 3. Туристическая нагрузка (Tourist Pressure)
Готового публичного тайл-слоя «загрязнения туристами» не существует. Сделаю **синтетический heatmap** на основе наших же данных:
- Из `kolaPlaces` беру координаты + популярность места (по тегам/категории) → строю heatmap-слой через `leaflet.heat` (уже есть в стеке Leaflet, добавлю lib `leaflet.heat`).
- Чем больше популярных мест в зоне — тем ярче «горячая точка».
- Иконка: `Flame` из lucide
- Кнопка: «Туристическая нагрузка» / «Tourist Pressure»
- Подпись внизу: «Оценка на основе плотности и популярности мест»

## Изменения файлов

### `src/components/map/MapView.tsx`
- Добавить пропсы: `showLightPollutionLayer`, `showRoadsLayer`, `showTouristPressureLayer` + соответствующие `onToggle...`
- Добавить refs: `lightPollutionLayerRef`, `roadsLayerRef`, `touristPressureLayerRef`
- 3 новых useEffect для управления слоями
- Для heatmap — импорт `leaflet.heat`

### `src/components/map/CategoryFilter.tsx`
- Добавить 3 новых пункта меню (Moon / Route / Flame) с пропсами

### `src/components/map/KolaMap.tsx` (родитель)
- Добавить 3 useState + прокинуть пропсы вниз

### `package.json`
- Установить `leaflet.heat` + типы

### `src/lib/i18n.ts`
- Добавить переводы: `lightPollution.title`, `roads.title`, `touristPressure.title`, `touristPressure.note`

## Итог
Пользователь получит ещё 3 переключаемых слоя в правой панели карты: ночные огни (для астротуризма / поиска северного сияния), сеть дорог (для планирования логистики), плотность туристической активности (чтобы наоборот искать менее затоптанные места).
