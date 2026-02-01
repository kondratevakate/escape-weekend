import { PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { cn } from '@/lib/utils';
import { Heart, Scroll } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryFilterProps {
  selectedCategories: PlaceCategory[];
  onToggleCategory: (category: PlaceCategory) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
  showHistoryLayer: boolean;
  onToggleHistoryLayer: () => void;
}

export const CategoryFilter = ({ 
  selectedCategories, 
  onToggleCategory,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  showHistoryLayer,
  onToggleHistoryLayer,
}: CategoryFilterProps) => {
  const { t } = useLanguage();
  
  // Filter out 'history' from regular categories - it's shown as a special layer toggle
  const categories = (Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][])
    .filter(([key]) => key !== 'history');

  return (
    <div className="flex flex-col gap-1">
      {/* Favorites filter button */}
      <button
        onClick={onToggleFavoritesOnly}
        className={cn(
          "flex items-center justify-center gap-1.5 p-2 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:scale-105 active:scale-95",
          showFavoritesOnly
            ? "bg-accent/20 text-accent"
            : "hover:bg-muted text-muted-foreground"
        )}
        title={t('favorites.title')}
      >
        <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
        {favoritesCount > 0 && (
          <span className="text-xs font-bold">
            {favoritesCount}
          </span>
        )}
      </button>

      <div className="h-px bg-border my-1" />

      {/* History layer toggle */}
      <button
        onClick={onToggleHistoryLayer}
        className={cn(
          "flex items-center justify-center p-2 rounded-lg text-lg transition-all duration-200",
          "hover:scale-105 active:scale-95",
          showHistoryLayer
            ? "shadow-sm"
            : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted"
        )}
        style={showHistoryLayer ? {
          backgroundColor: categoryConfig.history.bgColor,
          color: categoryConfig.history.color,
        } : undefined}
        title={t('historyLayer.title')}
      >
        <Scroll className="h-4 w-4" />
      </button>

      <div className="h-px bg-border my-1" />

      {/* Category buttons */}
      {categories.map(([key, config]) => {
        const isSelected = selectedCategories.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggleCategory(key)}
            title={t(`categories.${key}`)}
            className={cn(
              "flex items-center justify-center p-2 rounded-lg text-lg transition-all duration-200",
              "hover:scale-105 active:scale-95",
              isSelected
                ? "shadow-sm"
                : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted"
            )}
            style={isSelected ? {
              backgroundColor: config.bgColor,
              color: config.color,
            } : undefined}
          >
            {config.icon}
          </button>
        );
      })}
    </div>
  );
};
