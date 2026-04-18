
План:

## 1. Убрать атрибуцию Leaflet и «флаг Украины»

«Флаг» — это значок Leaflet (`leaflet-attribution-flag`, синие/жёлтые полосы рядом с надписью «Leaflet»), который добавлен в новых версиях библиотеки. Уберём его CSS-правилом + полностью скроем control-attribution.

В `src/index.css` добавить:
```css
.leaflet-attribution-flag { display: none !important; }
.leaflet-control-attribution { display: none !important; }
```

В `MapView.tsx` дополнительно передать `attributionControl: false` в `L.map(...)` — чтобы не рендерился вовсе.

## 2. Заменить «олдовый» террейн (OpenTopoMap) на красивый

Сейчас режим «Рельеф» использует `opentopomap.org` — серо-зелёные растровые тайлы в стиле бумажной карты. Это и выглядит «олдово».

Предлагаю заменить на современный вариант в духе Windy/Mapbox Outdoors. Лучшие бесплатные варианты без ключа:

- **Esri World Topo Map** — рельеф с отмывкой, насыщенные цвета, без ключа.
- **Esri World Imagery + Hillshade overlay** — спутник + полупрозрачная отмывка рельефа (наиболее «как Windy»).

Использую комбинацию: **Esri World Imagery (база) + Esri Hillshade (overlay 60%) + подписи**. Это даёт спутниковую картинку с подчёркнутым рельефом и горами — визуально близко к Windy/Gaia GPS.

Изменение в `MapView.tsx` (блок `showTerrainLayer`): вместо одного `opentopomap` слоя создаём `L.layerGroup` из:
1. `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
2. `https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}` (opacity 0.5)
3. `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}` (подписи)

Хранить ссылку на `layerGroup` в `terrainTileRef` (расширить тип на `L.Layer`).

## 3. Файлы

- `src/components/map/MapView.tsx` — `attributionControl: false`, переписать блок terrain.
- `src/index.css` — скрыть `.leaflet-attribution-flag` и `.leaflet-control-attribution`.

Краткий итог: пропадёт значок Leaflet/флага, а кнопка «Рельеф» будет показывать красивую спутниково-рельефную карту вместо старомодной OpenTopoMap.
