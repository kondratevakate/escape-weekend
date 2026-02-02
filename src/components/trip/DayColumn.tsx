import { memo, useState } from 'react';
import { Plus, X, GripVertical, MapPin } from 'lucide-react';
import { TripDay } from '@/types/trip';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { kolaPlaces } from '@/data/kolaPlaces';
import { cn } from '@/lib/utils';

interface DayColumnProps {
  day: TripDay;
  startDate: Date | null;
  onAddPlace: (dayId: string, place: Place) => void;
  onRemovePlace: (dayId: string, placeId: string) => void;
  onDragStart: (e: React.DragEvent, placeId: string, dayId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dayId: string, index: number) => void;
}

export const DayColumn = memo(({
  day,
  startDate,
  onAddPlace,
  onRemovePlace,
  onDragStart,
  onDragOver,
  onDrop,
}: DayColumnProps) => {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dayDate = startDate
    ? new Date(startDate.getTime() + (day.dayNumber - 1) * 24 * 60 * 60 * 1000)
    : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const availablePlaces = kolaPlaces.filter(
    p => !day.places.some(dp => dp.id === p.id)
  );

  return (
    <Card
      className="flex-shrink-0 w-64 md:w-72 p-4 bg-card/50 backdrop-blur-sm border-border/50"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day.id, day.places.length)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">
            {isRu ? 'День' : 'Day'} {day.dayNumber}
          </h3>
          {dayDate && (
            <p className="text-xs text-muted-foreground">{formatDate(dayDate)}</p>
          )}
        </div>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          {day.places.length} {isRu ? 'мест' : 'places'}
        </span>
      </div>

      {/* Places */}
      <div className="space-y-2 min-h-[120px]">
        {day.places.map((place, index) => {
          const config = categoryConfig[place.category];
          return (
            <div
              key={place.id}
              draggable
              onDragStart={(e) => onDragStart(e, place.id, day.id)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.stopPropagation();
                onDrop(e, day.id, index);
              }}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-lg bg-background border border-border/50",
                "cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm">{config.icon}</span>
              <span className="flex-1 text-sm font-medium truncate">
                {isRu ? place.name : (place.nameEn || place.name)}
              </span>
              <button
                onClick={() => onRemovePlace(day.id, place.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
              >
                <X className="h-3 w-3 text-destructive" />
              </button>
            </div>
          );
        })}

        {day.places.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <MapPin className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs text-center">
              {isRu ? 'Перетащите места сюда' : 'Drag places here'}
            </p>
          </div>
        )}
      </div>

      {/* Add button */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full mt-3">
            <Plus className="h-4 w-4 mr-1" />
            {isRu ? 'Добавить' : 'Add place'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-64 overflow-y-auto w-64">
          {availablePlaces.slice(0, 15).map((place) => {
            const config = categoryConfig[place.category];
            return (
              <DropdownMenuItem
                key={place.id}
                onClick={() => {
                  onAddPlace(day.id, place);
                  setIsDropdownOpen(false);
                }}
              >
                <span className="mr-2">{config.icon}</span>
                {isRu ? place.name : (place.nameEn || place.name)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
});

DayColumn.displayName = 'DayColumn';
