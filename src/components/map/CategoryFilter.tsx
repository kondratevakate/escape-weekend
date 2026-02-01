import { PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategories: PlaceCategory[];
  onToggleCategory: (category: PlaceCategory) => void;
}

export const CategoryFilter = ({ selectedCategories, onToggleCategory }: CategoryFilterProps) => {
  const categories = Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(([key, config]) => {
        const isSelected = selectedCategories.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggleCategory(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
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
            <span className="text-lg">{config.icon}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};
