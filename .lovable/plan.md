
## Цель
Поднять проект до уровня **долгоживущего open-source комьюнити-продукта**: сформулировать tone of voice и бренд-систему, навести порядок в коде и сделать так, чтобы внешний разработчик мог за 15 минут понять, как контрибьютить.

Задача делится на 3 блока: **Brand & Voice**, **Code Quality / DX**, **Open Source готовность**.

---

## Блок 1. Brand & Tone of Voice

### 1.1 Документ `BRAND.md` (в корне)
Единый источник правды для дизайна, копирайта и продукта.

**Содержание:**
- **Миссия**: «Помогаем находить нехоженые места и людей, которые их знают»
- **Аудитория**: нишевые энтузиасты adventure-туризма (астрофотографы, хайкеры, каякеры, этнографы)
- **Голос бренда** — 4 принципа:
  1. *Тёплый, не корпоративный* — пишем как опытный друг, а не туроператор
  2. *Конкретный, не пафосный* — «3 часа на УАЗике от Мурманска», а не «незабываемое приключение»
  3. *Честный про сложности* — говорим про опасности, отсутствие связи, плохие дороги
  4. *Двуязычный по умолчанию* — RU/EN равноправны, без машинного перевода
- **Что мы НЕ делаем**: AI-отзывы, накрутка, продажа данных, скрытая реклама, генерация фейк-контента
- **Лексикон Do/Don't** с примерами на RU и EN
- **Эмодзи-словарь**: 🥾 маршрут, 📍 место, ❓ вопрос, 🤝 митап, 📖 гайд, 🔥 огонь, 🔖 тайник
- **Микрокопирайтинг**: empty states, errors, CTAs, loading — список канонических фраз

### 1.2 Документ `DESIGN.md` (в корне)
Дизайн-токены и визуальные правила.

**Содержание:**
- Палитра (HSL, как в `index.css`): orange accent, beige bg, severity colors, post type colors
- Типографика: иерархия, line-height
- Spacing scale (Tailwind)
- Компонентные правила: карточка 320px, аватар 28px, маркер 30px и т.д. (вытащить из существующей памяти)
- Анимации: pulse, hover, transitions — список и где применяются
- Что запрещено: backdrop-blur, Serif, тёмный фон по умолчанию, эмодзи-флаги стран

---

## Блок 2. Code Quality & DX

### 2.1 Архитектурная документация `ARCHITECTURE.md`
Карта проекта для нового разработчика. Описывает:
- Структуру папок (`pages/`, `components/`, `hooks/`, `data/`, `contexts/`, `lib/`)
- Поток данных: `locations.json` → hooks → components
- Слой клуба: types → seed-data → hooks (localStorage) → pages
- Слои карты: как добавить новый layer (5 шагов: data → ref → effect → toggle → i18n)
- Роли: user/creator/admin/member, где проверяются
- i18n: как добавить новый ключ
- ASCII-диаграмма основных потоков

### 2.2 Code hygiene — точечный рефакторинг
Без переписывания всего, фокус на проблемных точках:

**a) Вынести магические числа и строки в константы**
- `src/lib/constants.ts` — KEY-имена localStorage (`club_user_posts_v1`, `club_membership_v1`, и т.д. — сейчас разбросаны по хукам), URL-ы тайл-серверов, дефолтные координаты Кольского, размеры маркеров.

**b) Унификация localStorage хуков**
Сейчас 6+ хуков (`useStash`, `useFavorites`, `useClubPosts`, `useClubReactions`, `useClubComments`, `useClubMembership`) повторяют один и тот же паттерн `load → useState → useEffect → save`. Создать `src/hooks/useLocalStorage.ts` (типизированный generic) и переписать остальные на него — минус ~40 строк дублирования и единая обработка ошибок парсинга.

**c) Убрать `any` в критичных местах**
- `MapView.tsx`: `(L as any).heatLayer` → объявить корректный тип через module augmentation в `src/types/leaflet-heat.d.ts`.

**d) Вынести Telegram deeplinks в один модуль**
`src/lib/telegram.ts` — функции `openBot()`, `sendApplicationToBot()`, `shareToTelegram()`. Сейчас deeplink-логика дублируется минимум в 3 местах.

**e) JSDoc на публичные хуки и утилиты**
Короткие шапки с описанием, параметрами и примером — то, что увидит контрибьютор в IDE.

### 2.3 Линт и формат
- Проверить `eslint.config.js`: сейчас отключен `no-unused-vars` — оставить, но добавить `react-hooks/exhaustive-deps: "warn"` (если ещё нет)
- Добавить `.editorconfig` (2 пробела, LF, utf-8)
- Добавить `.prettierrc` минимальный

### 2.4 Тесты
Сейчас один `example.test.ts`. Добавить smoke-тесты для критичной логики:
- `useClubPosts.filterAndSort` — фильтры по типу/нише/сортировке
- `useClubMembership` — переходы статусов
- `hasCapability` (роли)
- `seasonal logic` — фильтрация по месяцу

Не более 6-8 коротких тестов. Цель — пример для контрибьюторов, как писать тесты, а не покрытие 100%.

---

## Блок 3. Open Source готовность

### 3.1 Документы в корне
- **`README.md`** — полностью переписать. Сейчас generic-шаблон Lovable. Сделать настоящий: что это, скриншоты, фичи, demo-ссылка (`wowatlas.lovable.app`), стек, как запустить локально, как контрибьютить, лицензия, благодарности (vas3k.club, OSM, CartoDB, Leaflet).
- **`CONTRIBUTING.md`** — как форкнуть, ветки, коммиты (Conventional Commits), как добавить новое место в `locations.json`, как добавить новый слой карты, как добавить новую опасность/коллекцию/нишу, code style, PR-шаблон.
- **`CODE_OF_CONDUCT.md`** — Contributor Covenant 2.1 (стандарт), адаптированный под наш TOV.
- **`LICENSE`** — MIT (если ОК) или AGPL-3.0 (как vas3k.club, чтобы форки тоже были открыты). Решить нужно.
- **`SECURITY.md`** — куда писать про найденные уязвимости (TG-контакт хоста).
- **`CHANGELOG.md`** — пустая заготовка по Keep a Changelog + первая запись.

### 3.2 GitHub-папка `.github/`
- `ISSUE_TEMPLATE/bug_report.md`
- `ISSUE_TEMPLATE/feature_request.md`
- `ISSUE_TEMPLATE/new_place.md` — отдельный шаблон, чтобы не-кодеры могли предлагать места заполнением формы
- `ISSUE_TEMPLATE/new_hazard.md` — для опасностей
- `PULL_REQUEST_TEMPLATE.md`
- `FUNDING.yml` — куда донатить хосту (TG / Boosty / Patreon — на выбор)

### 3.3 Гайды для контрибьюторов в `docs/`
Маленькие how-to с примерами кода:
- `docs/adding-a-place.md` — пошагово: схема, скриншоты Leaflet для координат, валидация
- `docs/adding-a-map-layer.md` — на примере Hazards layer
- `docs/adding-a-club-post-type.md`
- `docs/i18n.md` — как добавить язык / ключ
- `docs/data-sources.md` — откуда берём данные, какие лицензии (OSM, UNESCO, и т.д.)

### 3.4 Onboarding скрипт (опционально, флажок к обсуждению)
`npm run check` — алиас на `lint && tsc --noEmit && test` чтобы контрибьютор одной командой проверил готовность PR.

---

## Файлы

**Создать (документация):**
- `BRAND.md`, `DESIGN.md`, `ARCHITECTURE.md`
- `README.md` (перезаписать)
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `SECURITY.md`, `CHANGELOG.md`
- `.github/ISSUE_TEMPLATE/{bug_report,feature_request,new_place,new_hazard}.md`
- `.github/PULL_REQUEST_TEMPLATE.md`, `.github/FUNDING.yml`
- `docs/adding-a-place.md`, `docs/adding-a-map-layer.md`, `docs/adding-a-club-post-type.md`, `docs/i18n.md`, `docs/data-sources.md`
- `.editorconfig`, `.prettierrc`

**Создать (код):**
- `src/lib/constants.ts` — ключи localStorage, URL тайлов, дефолты
- `src/lib/telegram.ts` — deeplink-утилиты
- `src/hooks/useLocalStorage.ts` — generic
- `src/types/leaflet-heat.d.ts` — типы для leaflet.heat
- 4-5 файлов в `src/test/` — smoke-тесты

**Править (код, точечно):**
- `useStash`, `useFavorites`, `useClubPosts`, `useClubReactions`, `useClubComments`, `useClubMembership` — переписать на `useLocalStorage`
- `MapView.tsx` — убрать `as any` для heatLayer, вынести URL тайлов в constants
- `ClubJoin.tsx`, `TelegramBridgeSheet.tsx`, `useTelegramCTA.ts` — использовать `lib/telegram.ts`
- `package.json` — скрипт `check`

**Память:**
- `mem://brand/voice-and-tokens` — короткое ядро TOV + ссылка на BRAND.md
- `mem://tech/code-conventions` — правила: localStorage через useLocalStorage, deeplinks через lib/telegram, новые слои по 5-шаговому гайду
- Обновить `mem://index.md` — добавить ссылки

---

## 3 решения нужны от тебя

**1. Лицензия**: MIT (максимум свободы — могут закрыть форк) или **AGPL-3.0** (как vas3k.club — форки обязаны быть открытыми)?

**2. Контакт для модерации/security**: твой личный TG (`@username`) или общий бот (`@dvushka_bot`)? Подставлю в CONTRIBUTING/SECURITY/FUNDING.

**3. Скоуп сейчас**: делать всё (документы + рефакторинг + тесты + .github) одним заходом, или начать с **«документация + .github»** (чисто DX и комьюнити-готовность), а рефакторинг хуков и тесты — следующим шагом?
