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
        "group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all",
        "hover:shadow-md border",
        isSelected 
          ? "ring-2 ring-primary border-primary" 
          : "border-border hover:border-primary/30"
      )}
    >
      {/* Image placeholder with category gradient */}
      <div 
        className="aspect-[4/3] relative"
        style={{ 
          background: `linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}20 100%)` 
        }}
      >
        {/* Category emoji centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl opacity-60">{config.icon}</span>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full transition-all",
            "bg-background/80 backdrop-blur-sm hover:bg-background",
            isFavorite && "text-destructive"
          )}
        >
          <Heart 
            className={cn("h-4 w-4", isFavorite && "fill-current")} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Name */}
        <h3 className="font-medium text-foreground line-clamp-1 mb-1">
          {displayName}
        </h3>
        
        {/* Category */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <span>{config.icon}</span>
          <span>{t(`categories.${place.category}`)}</span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {formatCount(stats.likesCount)}
          </span>
          <span className="flex items-center gap-1">
            📤 {formatCount(stats.sharesCount)}
          </span>
        </div>
      </div>
    </div>
  );
};
