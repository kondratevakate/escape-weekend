import { PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryFilterProps {
  selectedCategories: PlaceCategory[];
  onToggleCategory: (category: PlaceCategory) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
}

export const CategoryFilter = ({ 
  selectedCategories, 
  onToggleCategory,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
}: CategoryFilterProps) => {
  const { t } = useLanguage();
  const categories = Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][];

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      {/* Favorites filter button */}
      <button
        onClick={onToggleFavoritesOnly}
        className={cn(
          "flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200",
          "border-2 hover:scale-105 active:scale-95",
          showFavoritesOnly
            ? "bg-accent/20 text-accent border-accent shadow-lg"
            : "border-muted bg-background/80 text-muted-foreground hover:border-accent/50"
        )}
      >
        <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
        <span className="hidden sm:inline">{t('favorites.title')}</span>
        {favoritesCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.5 bg-accent/20 text-accent rounded-full text-xs font-bold">
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Category buttons */}
      {categories.map(([key, config]) => {
        const isSelected = selectedCategories.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggleCategory(key)}
            className={cn(
              "flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200",
              "border-2 hover:scale-105 active:scale-95",
              isSelected
                ? "border-transparent shadow-lg"
                : "border-muted bg-background/80 text-muted-foreground hover:border-muted-foreground/30"
            )}
            style={isSelected ? {
              backgroundColor: config.bgColor,
              color: config.color,
              borderColor: config.color,
            } : undefined}
          >
            <span className="text-base md:text-lg">{config.icon}</span>
            <span className="hidden sm:inline">{t(`categories.${key}`)}</span>
          </button>
        );
      })}
    </div>
  );
};
