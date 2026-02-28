import { Place } from '@/data/kolaPlaces';
import { PlaceListCard } from './PlaceListCard';
import { PlannedSeason } from '@/hooks/useStash';

interface PlacesListProps {
  places: Place[];
  stashedIds: string[];
  selectedPlaceId?: string | null;
  onSaveToStash: (placeId: string, placeName: string, season: PlannedSeason) => void;
  onRemoveFromStash: (placeId: string) => void;
  onPlaceClick: (place: Place) => void;
}

export const PlacesList = ({
  places,
  stashedIds,
  selectedPlaceId,
  onSaveToStash,
  onRemoveFromStash,
  onPlaceClick,
}: PlacesListProps) => {
  return (
    <div className="flex flex-col gap-2 p-3">
      {places.map((place) => (
        <PlaceListCard
          key={place.id}
          place={place}
          isStashed={stashedIds.includes(place.id)}
          isSelected={selectedPlaceId === place.id}
          onSaveToStash={(season) => onSaveToStash(place.id, place.name, season)}
          onRemoveFromStash={() => onRemoveFromStash(place.id)}
          onClick={() => onPlaceClick(place)}
        />
      ))}
      
      {places.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No places to display
        </div>
      )}
    </div>
  );
};
