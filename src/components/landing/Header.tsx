import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export type CategoryGroup = 'nature' | 'hiking' | 'top';

interface CategoryTab {
  id: CategoryGroup;
  emoji: string;
  labelRu: string;
  labelEn: string;
}

const categoryTabs: CategoryTab[] = [
  { id: 'nature', emoji: '🏔️', labelRu: 'Природа', labelEn: 'Nature' },
  { id: 'hiking', emoji: '🥾', labelRu: 'Походы', labelEn: 'Hiking' },
  { id: 'top', emoji: '⭐', labelRu: 'Топ-места', labelEn: 'Top Places' },
];

interface HeaderProps {
  selectedCategory: CategoryGroup | 'all';
  onCategoryChange: (category: CategoryGroup | 'all') => void;
}

export const Header = ({ selectedCategory, onCategoryChange }: HeaderProps) => {
  const { language, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🌌</span>
          <span className="font-semibold text-foreground hidden sm:inline">
            {t('landing.brand')}
          </span>
        </div>
        
        {/* Category Tabs - Center */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(
                selectedCategory === tab.id ? 'all' : tab.id
              )}
              className={cn(
                "flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-sm transition-all",
                "hover:bg-muted",
                selectedCategory === tab.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden md:inline">
                {language === 'ru' ? tab.labelRu : tab.labelEn}
              </span>
            </button>
          ))}
        </nav>
        
        {/* Language Switcher - Right */}
        <div className="shrink-0">
          <LanguageSwitcher variant="globe" />
        </div>
      </div>
    </header>
  );
};
