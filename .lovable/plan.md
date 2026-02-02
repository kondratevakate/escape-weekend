
# План: Иконки народов и легенда с оптимизацией

## Что добавляем

1. **SVG-иконки народов** — с atlaskmns.ru для каждого из 12 народов
2. **Интерактивная легенда** — сворачиваемая панель со списком народов
3. **Оптимизация кода** — lazy loading иконок, мемоизация, кэширование

## Как будет выглядеть

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              [КАРТА]                                        │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────┐               │
│   │   Территории коренных народов России                    │               │
│   │     (полигоны с разными цветами)                        │               │
│   └─────────────────────────────────────────────────────────┘               │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ЛЕГЕНДА — появляется при включении слоя]                                   │
│ ┌──────────────────────────────────────┐                                    │
│ │ 📜 Коренные народы          [−]      │  ← Сворачиваемая                  │
│ ├──────────────────────────────────────┤                                    │
│ │ [🧑‍🦰] Саамы           ~2 000   ███   │  ← Иконка + цвет + население      │
│ │ [👤] Ненцы          ~45 000  ████   │                                    │
│ │ [👤] Ханты          ~31 000  ███    │                                    │
│ │ [👤] Эвенки         ~38 000  ████   │                                    │
│ │ [👤] Чукчи          ~16 000  ██     │                                    │
│ │ ...                                  │                                    │
│ ├──────────────────────────────────────┤                                    │
│ │ Источник: atlaskmns.ru               │                                    │
│ └──────────────────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## URL-ы иконок с atlaskmns.ru

| Народ | ID | URL иконки |
|-------|-----|------------|
| Саамы | saami | `https://atlaskmns.ru/static/img/svg/peoples_1_saamy.svg` |
| Ненцы | nenets | `https://atlaskmns.ru/static/img/svg/peoples_3_nentsy.svg` |
| Ханты | khanty | `https://atlaskmns.ru/static/img/svg/peoples_4_hanty.svg` |
| Манси | mansi | `https://atlaskmns.ru/static/img/svg/peoples_5_mansi.svg` |
| Эвенки | evenki | `https://atlaskmns.ru/static/img/svg/peoples_18_evenki.svg` |
| Эвены | evens | `https://atlaskmns.ru/static/img/svg/peoples_19_eveny.svg` |
| Чукчи | chukchi | `https://atlaskmns.ru/static/img/svg/peoples_40_chukchi.svg` |
| Коряки | koryak | `https://atlaskmns.ru/static/img/svg/peoples_33_koryaki.svg` |
| Долганы | dolgan | `https://atlaskmns.ru/static/img/svg/peoples_17_dolgany.svg` |
| Нанайцы | nanai | `https://atlaskmns.ru/static/img/svg/peoples_23_nanaicy.svg` |
| Селькупы | selkup | `https://atlaskmns.ru/static/img/svg/peoples_7_selcupy.svg` |
| Юкагиры | yukagir | `https://atlaskmns.ru/static/img/svg/peoples_31_yukagiry.svg` |

## Техническая реализация

### 1. Обновить данные — добавить iconUrl

```typescript
// src/data/indigenousPeoplesLayer.ts
export interface IndigenousPeople {
  // ... существующие поля
  iconUrl: string;  // URL к SVG иконке
}

export const indigenousPeoples: IndigenousPeople[] = [
  {
    id: 'saami',
    name: 'Саамы',
    iconUrl: 'https://atlaskmns.ru/static/img/svg/peoples_1_saamy.svg',
    // ...
  },
  // ...
];
```

### 2. Создать компонент легенды

```tsx
// src/components/map/IndigenousPeoplesLegend.tsx
import { useState, memo } from 'react';
import { Scroll, ChevronDown, ChevronUp } from 'lucide-react';
import { indigenousPeoples } from '@/data/indigenousPeoplesLayer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Props {
  isVisible: boolean;
  onPeopleClick?: (peopleId: string, center: [number, number]) => void;
}

// Мемоизированный компонент строки легенды
const LegendItem = memo(({ people, language, onClick }: {...}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 w-full p-1.5 rounded 
               hover:bg-accent/50 transition-colors text-left"
  >
    <img 
      src={people.iconUrl} 
      alt=""
      className="w-6 h-6 object-contain"
      loading="lazy"  // Lazy loading для иконок
    />
    <div 
      className="w-3 h-3 rounded-full shrink-0"
      style={{ backgroundColor: people.color }}
    />
    <span className="text-xs flex-1 truncate">
      {language === 'ru' ? people.name : people.nameEn}
    </span>
    <span className="text-[10px] text-muted-foreground tabular-nums">
      ~{people.population.toLocaleString()}
    </span>
  </button>
));

export const IndigenousPeoplesLegend = memo(({ isVisible, onPeopleClick }: Props) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-16 left-2 z-[1000] 
                    bg-background/95 backdrop-blur-sm 
                    rounded-lg shadow-lg border max-w-[200px]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between 
                                        w-full p-2 hover:bg-accent/30">
          <div className="flex items-center gap-2">
            <Scroll className="h-4 w-4 text-primary" />
            <span className="font-medium text-xs">
              {language === 'ru' ? 'Коренные народы' : 'Indigenous Peoples'}
            </span>
          </div>
          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-2 pb-2 space-y-0.5 max-h-[40vh] overflow-y-auto">
            {indigenousPeoples.map(people => (
              <LegendItem 
                key={people.id}
                people={people}
                language={language}
                onClick={() => onPeopleClick?.(people.id, getTerritoryCentroid(people.territory))}
              />
            ))}
          </div>
          
          <div className="border-t px-2 py-1.5">
            <a 
              href="https://atlaskmns.ru" 
              target="_blank"
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Источник: atlaskmns.ru
            </a>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});
```

### 3. Интегрировать в MapView

```tsx
// src/components/map/MapView.tsx
import { IndigenousPeoplesLegend } from './IndigenousPeoplesLegend';

// В JSX, рядом с атрибуциями:
<IndigenousPeoplesLegend 
  isVisible={showHistoryLayer}
  onPeopleClick={(id, center) => {
    mapInstanceRef.current?.flyTo(center, 6);
  }}
/>
```

## Оптимизации

### Производительность иконок

```tsx
// Lazy loading — загружаем только видимые
<img loading="lazy" src={people.iconUrl} />

// Fallback при ошибке загрузки
<img 
  src={people.iconUrl}
  onError={(e) => {
    e.currentTarget.style.display = 'none';
  }}
/>
```

### Мемоизация компонентов

```tsx
// Мемоизируем LegendItem чтобы не перерендеривать все при открытии/закрытии
const LegendItem = memo(({ people, language, onClick }) => {...});

// Мемоизируем всю легенду
export const IndigenousPeoplesLegend = memo(({ isVisible }) => {...});
```

### Вычисление центроида территории

```typescript
// Утилита для нахождения центра полигона (для flyTo)
const getTerritoryCentroid = (territory: GeoJSON.Feature): [number, number] => {
  const coords = (territory.geometry as GeoJSON.Polygon).coordinates[0];
  const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
  const lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
  return [lat, lng];
};
```

## Изменяемые файлы

| Файл | Изменения |
|------|-----------|
| `src/data/indigenousPeoplesLayer.ts` | Добавить поле `iconUrl` к 12 народам |
| `src/components/map/IndigenousPeoplesLegend.tsx` | **Новый** — сворачиваемая легенда |
| `src/components/map/MapView.tsx` | Импортировать и добавить легенду |
| `src/lib/i18n.ts` | Переводы для легенды |

## План проверки

После реализации проверяем:

| Шаг | Что проверяем | Ожидаемый результат |
|-----|---------------|---------------------|
| 1 | Открыть карту, включить слой "Коренные народы" | Легенда появляется слева внизу |
| 2 | Проверить иконки в легенде | Все 12 иконок загружаются с atlaskmns.ru |
| 3 | Свернуть/развернуть легенду | Анимация работает, состояние сохраняется |
| 4 | Кликнуть на народ в легенде | Карта плавно перемещается к его территории |
| 5 | Выключить слой | Легенда исчезает |
| 6 | Проверить на мобильном | Легенда не перекрывает важные элементы |
| 7 | Открыть DevTools → Network | Иконки загружаются с lazy loading |
