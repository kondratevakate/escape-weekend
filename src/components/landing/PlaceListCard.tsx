import { Heart } from 'lucide-react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePlaceStats } from '@/hooks/usePlaceStats';
import { cn } from '@/lib/utils';

interface PlaceListCardProps {
  place: Place;
  isFavorite: boolean;
  isSelected?: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export const PlaceListCard = ({
  place,
  isFavorite,
  isSelected,
  onToggleFavorite,
  onClick,
}: PlaceListCardProps) => {
  const { language, t } = useLanguage();
  const { stats, formatCount } = usePlaceStats(place.id);
  const config = categoryConfig[place.category];

  const displayName = language === 'en' && place.nameEn ? place.nameEn : place.name;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-lg overflow-hidden cursor-pointer transition-all",
        "hover:shadow-sm border",
        isSelected 
          ? "ring-2 ring-primary border-primary" 
          : "border-border hover:border-primary/30"
      )}
    >
      {/* Compact horizontal layout */}
      <div className="flex items-center gap-3 p-2.5">
        {/* Category icon */}
        <div 
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}20 100%)` 
          }}
        >
          <span className="text-lg">{config.icon}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground line-clamp-1">
            {displayName}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{t(`categories.${place.category}`)}</span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {formatCount(stats.likesCount)}
            </span>
          </div>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            "shrink-0 p-1.5 rounded-full transition-all",
            "hover:bg-muted",
            isFavorite && "text-destructive"
          )}
        >
          <Heart 
            className={cn("h-4 w-4", isFavorite && "fill-current")} 
          />
        </button>
      </div>
    </div>
  );
};
