
## Что нашёл (после визуального аудита 375px и 1366px + perf profile)

### Производительность
- **DOM Content Loaded 6.8s, FCP 7.2s** — много из-за dev-сборки, но 162 JS-чанков и 555 listeners на главной — есть что вынести.
- Нет **route-level code splitting** — все 11 страниц грузятся в начальный bundle. ClubFeed, ClubPost, TripPlanner, CreatorDashboard, CookiePolicy не нужны на `/`.
- `restaurantsLayer.ts` (24KB) и `indigenousPeoplesLayer.ts` грузятся всегда, хотя нужны только при включении слоя.
- `ExploreMode` рендерится условно но импортируется всегда — кандидат на `lazy`.
- `useEffect` на `[onPlaceClick]` в `MapView` пересоздаёт **все маркеры при каждом ререндере родителя** (callback не стабильный по идентичности всегда — проверить, и обернуть в useMemo seed-расчёты).

### Визуальный шум и верстка

**Mobile (375px), главное:**
1. **Header переполнен** — лого, поиск, Клуб, Stash, 🌐, меню — 6 элементов без gap, `placeholder` обрезается, поиск становится бесполезным.
2. **Правый toolbar слоёв** (`CategoryFilter` 11 кнопок + 3 аватара креаторов) — на мобиле висит вертикально посреди карты, занимает 60% высоты карты, перекрывает маркеры.
3. **Sparkles в input** справа — декоративный мусор, отрезает место под текст.
4. **Footer на мобиле** показывает «Hedonist Odyssey · Сделано с ❤ в Мурманске · © 2026» — на узком экране три строки футера съедают полезную площадь.
5. **Sidebar 40vh + map 60vh** — нет нижней навигации, упомянутой в `mem://ui/mobile-navigation-refine`. Юзер не понимает, как попасть на /trip-planner и /stash.
6. **Welcome modal** — всегда поверх карты при первом заходе, скрывает контент. Кнопка закрытия маленькая (16px).

**Desktop (1366px):**
7. Правый toolbar **всё ещё с backdrop-blur** (`bg-background/95 backdrop-blur-sm`) — в `mem://style/visual-concept` запрещено. Заменить на solid.
8. Sidebar 320px + правый toolbar ~50px **съедают 28% ширины** — много для одной локации Мурманска.
9. **Дублирование «Клуб»** — кнопка в Header + большая карточка ExploreCard в sidebar + welcome modal. Слишком навязчиво.

### Mobile UX gaps
- Карта на мобиле без zoom-контролов (они bottomright, не видно за toolbar).
- Нельзя свернуть/раскрыть sidebar свайпом — только в desktop через `PanelLeftClose`.

---

## План правок

### Блок 1. Перформанс (быстрые победы)

**1.1 Route-level lazy loading в `App.tsx`**
```tsx
const TripPlanner = lazy(() => import('./pages/TripPlanner'));
const ClubFeed = lazy(() => import('./pages/ClubFeed'));
// ... все кроме Index
<Suspense fallback={<RouteLoader />}>...</Suspense>
```
Главная страница не тащит код клуба, креатора, трип-планнера.

**1.2 Lazy data layers в `MapView.tsx`**
`restaurantsLayer`, `indigenousPeoplesLayer`, `unescoLayer` грузить через динамический `import()` только когда соответствующий toggle включён. Сейчас даже невидимые слои в bundle.

**1.3 Стабилизировать колбэк маркеров**
В `Index.tsx` обернуть `handlePlaceClick` в `useCallback` (уже есть) и проверить, что он не пересоздаётся. В `MapView.tsx` убрать `onPlaceClick` из deps `useEffect` маркеров — использовать `useRef` для актуального колбэка.

**1.4 Lazy ExploreMode и WelcomeModal**
`React.lazy` + Suspense — они не нужны на первом фрейме.

### Блок 2. Mobile — главные правки

**2.1 Перерисовать Header под мобилу** (`Header.tsx`)
- На мобиле скрыть текстовую кнопку «Клуб», оставить только иконку 🔥
- Убрать Sparkles из input (или показывать только на md+)
- Шрифт placeholder короче: «Поиск…» на мобиле, полный — на md+
- Логотип без подписи на <sm
- gap-1 → gap-2, padding-x-3

**2.2 `CategoryFilter` — мобильная версия как горизонтальный chip-bar внизу карты**
На <md: вместо вертикального тулбара справа — горизонтальная скролл-полоса под header'ом (или над sidebar) с теми же иконками. Освобождает 60px ширины и не перекрывает маркеры. На md+ — текущий вертикальный.

**2.3 Добавить `MobileBottomNav.tsx`**
По памяти `mem://ui/mobile-navigation-refine` он должен быть, но его нет в проекте. Создать: 4 пункта (Карта · Маршрут · Клуб · Тайник), фикс bottom, h-14, скрывать на md+. Скрывать footer на <md (он дублируется этим nav'ом).

**2.4 Welcome modal — компактнее**
Изменить с 2x2 grid карточек на список 4 строки. Кнопка close 24px. Backdrop темнее. На мобиле full-bleed sheet, не центрированный модал.

### Блок 3. Визуальный шум

**3.1 Удалить `backdrop-blur` везде** — найти и заменить на solid:
- `MapView.tsx` правая панель `bg-background/95 backdrop-blur-sm` → `bg-background border`
- UNESCO attribution и Tourist pressure note — то же
- PlaceCard close button — то же

**3.2 Sidebar сжать на десктопе с 320 → 280px** — освободит контента карте.

**3.3 Footer на мобиле — одна строка**, без «Сделано с ❤ в Мурманске» (оставить только на md+).

**3.4 Убрать дубль Hero «Клуб» с лендинга** — если он есть в DiscoverPanel и Welcome.

### Блок 4. End-to-end проверка после
Прогнать в браузере:
- 375x812 — главная без modal'а, header читаем, toolbar не перекрывает карту, есть нижняя навигация
- 1366x768 — sidebar уже, нет blur, всё solid
- Открыть карточку места, /club, /stash на обоих viewport'ах
- Замерить perf снова — целевая метрика: bundle главной без club/trip/creator кода

---

## Файлы

**Создать:**
- `src/components/MobileBottomNav.tsx`
- `src/components/RouteLoader.tsx` (минимальный fallback для lazy)

**Править:**
- `src/App.tsx` — `lazy()` + `Suspense` для всех страниц кроме Index
- `src/components/landing/Header.tsx` — мобильная компоновка, убрать Sparkles на <md, иконка-only «Клуб»
- `src/components/map/MapView.tsx` — убрать backdrop-blur, lazy-импорт data-слоёв, ref-стабилизация onPlaceClick
- `src/components/map/CategoryFilter.tsx` — раздвоить на mobile horizontal / desktop vertical (через `useIsMobile`)
- `src/pages/Index.tsx` — добавить `<MobileBottomNav />`, lazy `ExploreMode` + `WelcomeModal`, sidebar 320→280px
- `src/components/landing/Footer.tsx` — скрыть детали на <md
- `src/components/WelcomeModal.tsx` — компактнее, sheet на мобиле

## Что НЕ делаем сейчас
- Не переписываем Leaflet на vector tiles / MapLibre — отдельная большая задача.
- Не выносим `locations.json` в API — он маленький и нужен сразу.
- Не трогаем seed-контент клуба, документацию, тесты.

## 1 решение от тебя

**Скоуп:** делаем **всё** одним заходом (3 блока + проверка), или сначала только **мобилка + bottom nav** (Блок 2), а перформанс и визуальный шум — следующим шагом? Один заход безопаснее (все правки связаны), но это ~10 файлов.
