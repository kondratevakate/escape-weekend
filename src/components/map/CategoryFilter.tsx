import { PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategories: PlaceCategory[];
  onToggleCategory: (category: PlaceCategory) => void;
}

export const CategoryFilter = ({ selectedCategories, onToggleCategory }: CategoryFilterProps) => {
  const categories = Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][];

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
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
            <span className="hidden sm:inline">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};
