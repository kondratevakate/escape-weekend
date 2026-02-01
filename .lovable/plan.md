

# Редизайн левой панели: Explore + Подборки + Скрытые места

## Что меняем

Заменяем скучный список карточек мест на три вовлекающих секции с картинками:

```text
┌─────────────────────────────┐
│ 🎯 Explore                  │
│ [Большая карточка с фото]   │
│ "Свайпай и открывай места"  │
├─────────────────────────────┤
│ 📚 Подборки                 │
│ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🌊 │ │ 🏔️ │ │ 🏚️ │    │
│ │К морю│ │Горы │ │Забр.│    │
│ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────┤
│ 💎 Места, о которых вы      │
│    не знали                 │
│ ┌─────────────────────────┐ │
│ │ [Фото] Кузомень         │ │
│ │ Пустыня за полярным...  │ │
│ ├─────────────────────────┤ │
│ │ [Фото] Дальние Зеленцы  │ │
│ │ Заброшенный город...    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## Структура новой панели

### 1. Explore Card (большая кнопка запуска)
- Красивое фото Кольского на фоне
- Кнопка "Начать исследование"
- Открывает существующий `ExploreMode.tsx`

### 2. Подборки (Collections)
Горизонтальный скролл с мини-карточками:

| Название | Эмодзи | Места |
|----------|--------|-------|
| К морю | 🌊 | Териберка, Рыбачий, Средний |
| В горы | 🏔️ | Хибины, Ловозерские тундры |
| Заброшенное | 🏚️ | Дальние Зеленцы |
| Поморы | ⛵ | Умба, Варзуга, Тоня Тетрина |
| Топ-5 | ⭐ | По популярности |

При клике — фильтрация карты по местам подборки.

### 3. "Места, о которых вы не знали"
Вертикальный список с фото:
- Кузомень (песчаная пустыня)
- Дальние Зеленцы (заброшенный посёлок)
- Чаваньга (самое отдалённое село)

---

## Файлы для создания

1. **`src/components/landing/DiscoverPanel.tsx`** — новая левая панель
2. **`src/components/landing/ExploreCard.tsx`** — карточка запуска Explore
3. **`src/components/landing/CollectionsRow.tsx`** — горизонтальные подборки
4. **`src/components/landing/HiddenGems.tsx`** — скрытые жемчужины
5. **`src/data/collections.ts`** — данные подборок

---

## Технические детали

### Данные подборок
```typescript
// src/data/collections.ts
export interface Collection {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  placeIds: string[];
  image: string;
}

export const collections: Collection[] = [
  {
    id: 'seaside',
    name: 'К морю',
    nameEn: 'Seaside',
    emoji: '🌊',
    placeIds: ['teriberka', 'rybachy', 'sredny'],
    image: 'https://images.unsplash.com/...'
  },
  // ...
];

export const hiddenGems = ['kuzomen', 'dalnie-zelentsy', 'chavanga'];
```

### Интеграция с картой
При клике на подборку:
1. Фильтруем `filteredPlaces` по `placeIds` подборки
2. Подсвечиваем маркеры на карте
3. Центрируем карту на эти точки

### Картинки
Использую Unsplash placeholder'ы пока нет реальных фото:
- Северное море, скалы
- Горные пейзажи
- Заброшенные здания
- Поморские деревни

---

## Изменения в Index.tsx

```typescript
// Добавляем состояние для активной подборки
const [activeCollection, setActiveCollection] = useState<string | null>(null);

// В aside вместо PlacesList:
<DiscoverPanel 
  onStartExplore={() => setIsExploreMode(true)}
  onSelectCollection={setActiveCollection}
  onPlaceClick={handlePlaceClick}
/>
```

---

## Порядок реализации

1. Создать `src/data/collections.ts` — данные подборок
2. Создать `ExploreCard.tsx` — кнопка запуска Explore
3. Создать `CollectionsRow.tsx` — горизонтальные подборки
4. Создать `HiddenGems.tsx` — скрытые жемчужины с фото
5. Создать `DiscoverPanel.tsx` — объединяющий компонент
6. Обновить `Index.tsx` — заменить PlacesList на DiscoverPanel

