
# План: Добавить слой UNESCO на карту

## Что добавляем

На карту добавится переключаемый **слой "UNESCO"** с:
1. **Маркерами** объектов Всемирного наследия в радиусе видимости карты
2. **Специальной иконкой** — логотип UNESCO или характерный синий маркер
3. **Переключателем слоя** — кнопка в панели фильтров

## Объекты UNESCO около Кольского полуострова

При зуме карты на весь регион видны следующие объекты:

| Объект | Координаты | Категория | Год |
|--------|------------|-----------|-----|
| **Соловецкие острова** | 65.08°N, 35.67°E | Культурный | 1992 |
| **Кижи** | 62.07°N, 35.22°E | Культурный | 1990 |
| **Петроглифы Онежского озера и Белого моря** | 61.73°N, 36.01°E | Культурный | 2021 |
| Культурный ландшафт Кенозера | 61.9°N, 38.2°E | Культурный | 2024 |
| Новгород | 58.52°N, 31.28°E | Культурный | 1992 |
| Санкт-Петербург | 59.92°N, 30.42°E | Культурный | 1990 |

## Как будет выглядеть

```text
┌───────────────────────────────────────────────────────┐
│                   [КАРТА]                             │
│                                                       │
│   ⭕ Соловецкие острова (UNESCO)                      │
│                                                       │
│   📜 [саамы]   🏔️ [места]                            │
│                                                       │
│   ⭕ Кижи (UNESCO)                                    │
│                                                       │
│                          ┌──────────────────┐         │
│                          │ [Фильтры]        │         │
│                          │ ────────────     │         │
│                          │ 🏛️ UNESCO [ON]  │  ← НОВОЕ│
│                          │ 📜 История       │         │
│                          │ 🏔️ Природа      │         │
│                          │ ...              │         │
│                          └──────────────────┘         │
└───────────────────────────────────────────────────────┘
```

## Данные объектов UNESCO

```typescript
// src/data/unescoLayer.ts
export interface UnescoSite {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: 'Cultural' | 'Natural' | 'Mixed';
  coordinates: [number, number]; // [lat, lng]
  yearInscribed: number;
  url: string;
}

export const unescoSites: UnescoSite[] = [
  {
    id: 'unesco-solovetsky',
    name: 'Соловецкие острова',
    nameEn: 'Cultural and Historic Ensemble of the Solovetsky Islands',
    description: 'Архипелаг в Белом море с уникальным монастырём XV века',
    category: 'Cultural',
    coordinates: [65.08, 35.67],
    yearInscribed: 1992,
    url: 'https://whc.unesco.org/en/list/632',
  },
  {
    id: 'unesco-kizhi',
    name: 'Кижский погост',
    nameEn: 'Kizhi Pogost',
    description: 'Деревянная церковь с 22 куполами на острове Онежского озера',
    category: 'Cultural',
    coordinates: [62.07, 35.22],
    yearInscribed: 1990,
    url: 'https://whc.unesco.org/en/list/544',
  },
  // ... ещё объекты
];
```

## Новая категория

Добавим новую категорию `unesco` в `kolaPlaces.ts`:

```typescript
unesco: {
  label: 'UNESCO',
  icon: '🏛️',  // или специальный SVG
  color: 'hsl(210 100% 40%)',     // синий UNESCO
  bgColor: 'hsl(210 100% 95%)',
}
```

## Техническая реализация

### 1. Новый файл данных

**src/data/unescoLayer.ts**
- Интерфейс `UnescoSite`
- Массив объектов UNESCO в радиусе карты
- Конвертер в формат `Place` для совместимости

### 2. Изменения в MapView.tsx

- Добавить `showUnescoLayer` prop
- При включении — показывать маркеры UNESCO с особым стилем:
  - Синий цвет (официальный цвет UNESCO)
  - Чуть крупнее обычных маркеров
  - Белый фон с синей границей

### 3. Изменения в CategoryFilter.tsx

- Добавить кнопку переключателя UNESCO между избранным и историей
- Иконка: специальный логотип или 🏛️

### 4. Изменения в Index.tsx и KolaMap.tsx

- Добавить state `showUnescoLayer`
- Добавить обработчик `handleToggleUnescoLayer`
- Включить UNESCO места в `filteredPlaces`

### 5. Локализация в i18n.ts

```typescript
unescoLayer: {
  title: 'Объекты UNESCO',
  description: 'Всемирное наследие',
  attribution: 'Данные: UNESCO World Heritage Centre',
},
```

## Файлы для создания/изменения

### Новые файлы

| Файл | Описание |
|------|----------|
| `src/data/unescoLayer.ts` | Данные объектов UNESCO с координатами |

### Изменяемые файлы

| Файл | Изменения |
|------|-----------|
| `src/data/kolaPlaces.ts` | Добавить категорию `unesco` |
| `src/components/map/CategoryFilter.tsx` | Добавить переключатель UNESCO |
| `src/components/map/MapView.tsx` | Добавить рендеринг маркеров UNESCO |
| `src/pages/Index.tsx` | Добавить state и handler для UNESCO layer |
| `src/components/map/KolaMap.tsx` | Добавить state и handler для UNESCO layer |
| `src/lib/i18n.ts` | Добавить переводы |

## Источник данных

Официальные данные: UNESCO World Heritage Centre (whc.unesco.org)
- При клике на маркер — ссылка на официальную страницу объекта

## Атрибуция

При активации слоя добавится подпись:
> 🏛️ UNESCO World Heritage Centre (whc.unesco.org)
