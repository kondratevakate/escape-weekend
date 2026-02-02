

# План: Добавить секцию "Ресурсы" в боковую панель

## Что добавляем

В боковую панель `DiscoverPanel` добавится новая секция **"Ресурсы"** с полезными ссылками на внешние гайды и сайты:

1. **World Coffee Guide** — гайд по кофейням мира (notbadcoffee.com)
2. **Русское географическое общество** — официальный сайт РГО (rgo.ru)

## Как будет выглядеть

```text
┌─────────────────────────────────────┐
│  [Боковая панель DiscoverPanel]     │
├─────────────────────────────────────┤
│  🎯 Explore Mode Card               │
│  📚 Подборки (коллекции)            │
│  ✨ Скрытые жемчужины               │
├─────────────────────────────────────┤
│  📖 Ресурсы                    НОВОЕ│
│  ┌───────────────────────────────┐  │
│  │ ☕ World Coffee Guide         │  │
│  │ Гид по кофейням мира          │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 🌍 Русское географическое     │  │
│  │ общество (РГО)                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Структура данных

```typescript
interface Resource {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  emoji: string;
  url: string;
  color: string;
}

const resources: Resource[] = [
  {
    id: 'coffee-guide',
    name: 'World Coffee Guide',
    nameEn: 'World Coffee Guide',
    description: 'Гид по кофейням мира',
    descriptionEn: 'Global coffee shop guide',
    emoji: '☕',
    url: 'https://notbadcoffee.com/world-coffee-guide/',
    color: 'hsl(30 80% 50%)', // коричневый/кофейный
  },
  {
    id: 'rgo',
    name: 'Русское географическое общество',
    nameEn: 'Russian Geographical Society',
    description: 'Официальный сайт РГО',
    descriptionEn: 'Official RGS website',
    emoji: '🌍',
    url: 'https://rgo.ru/',
    color: 'hsl(140 60% 40%)', // зелёный
  },
];
```

## Что изменится

### Новые файлы

| Файл | Описание |
|------|----------|
| `src/components/landing/ResourcesSection.tsx` | Компонент секции ресурсов с карточками-ссылками |
| `src/data/resources.ts` | Данные о ресурсах (название, URL, описание) |

### Изменяемые файлы

| Файл | Изменения |
|------|-----------|
| `src/components/landing/DiscoverPanel.tsx` | Добавить `<ResourcesSection />` после HiddenGems |
| `src/lib/i18n.ts` | Добавить переводы для секции ресурсов |

## Техническая реализация

### 1. Компонент ResourcesSection

```tsx
// src/components/landing/ResourcesSection.tsx
export const ResourcesSection = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-2 overflow-hidden">
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
        <h3 className="text-xs font-semibold text-foreground">
          {language === 'ru' ? 'Ресурсы' : 'Resources'}
        </h3>
      </div>
      
      <div className="space-y-1.5">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 rounded-lg
                       bg-card border border-border hover:border-primary/50
                       transition-all duration-200 hover:shadow-sm p-2"
          >
            <span className="text-xl">{resource.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-xs text-foreground line-clamp-1">
                {language === 'ru' ? resource.name : resource.nameEn}
              </h4>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {language === 'ru' ? resource.description : resource.descriptionEn}
              </p>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
};
```

### 2. Интеграция в DiscoverPanel

```tsx
import { ResourcesSection } from './ResourcesSection';

export const DiscoverPanel = (...) => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-3 md:p-4 space-y-4 md:space-y-5 overflow-hidden">
        <ExploreCard onStart={onStartExplore} />
        <CollectionsRow ... />
        <HiddenGems onPlaceClick={onPlaceClick} />
        <ResourcesSection />  {/* ← НОВОЕ */}
      </div>
    </ScrollArea>
  );
};
```

### 3. Локализация

```typescript
// В i18n.ts добавить:
resources: {
  title: 'Ресурсы',
  coffeeGuide: 'Гид по кофейням мира',
  rgo: 'Русское географическое общество',
},
```

## Дизайн карточек

Каждая карточка ресурса будет:
- Иметь эмодзи слева (☕, 🌍)
- Название и описание в центре
- Иконку внешней ссылки (ExternalLink) справа
- Открываться в новой вкладке при клике
- Иметь hover-эффект как у HiddenGems

