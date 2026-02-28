import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { SeasonPicker } from '@/components/SeasonPicker';
import { PlannedSeason } from '@/hooks/useStash';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PlaceListCardProps {
  place: Place;
  isStashed: boolean;
  isSelected?: boolean;
  onSaveToStash: (season: PlannedSeason) => void;
  onRemoveFromStash: () => void;
  onClick: () => void;
}

export const PlaceListCard = ({
  place,
  isStashed,
  isSelected,
  onSaveToStash,
  onRemoveFromStash,
  onClick,
}: PlaceListCardProps) => {
  const { language, t } = useLanguage();
  const config = categoryConfig[place.category];
  const [pickerOpen, setPickerOpen] = useState(false);

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
      <div className="flex items-center gap-3 p-2.5">
        <div 
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}20 100%)` 
          }}
        >
          <span className="text-lg">{config.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground line-clamp-1">
            {displayName}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{t(`categories.${place.category}`)}</span>
          </div>
        </div>
        
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isStashed) {
                  onRemoveFromStash();
                } else {
                  setPickerOpen(true);
                }
              }}
              className={cn(
                "shrink-0 p-1.5 rounded-full transition-all",
                "hover:bg-muted",
                isStashed && "text-primary"
              )}
            >
              <Bookmark 
                className={cn("h-4 w-4", isStashed && "fill-current")} 
              />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 border-0 shadow-none bg-transparent" 
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <SeasonPicker
              onSelect={(season) => {
                onSaveToStash(season);
                setPickerOpen(false);
              }}
              onCancel={() => setPickerOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
