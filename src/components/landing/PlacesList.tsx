import { Place } from '@/data/kolaPlaces';
import { PlaceListCard } from './PlaceListCard';

interface PlacesListProps {
  places: Place[];
  favorites: string[];
  selectedPlaceId?: string | null;
  onToggleFavorite: (placeId: string) => void;
  onPlaceClick: (place: Place) => void;
}

export const PlacesList = ({
  places,
  favorites,
  selectedPlaceId,
  onToggleFavorite,
  onPlaceClick,
}: PlacesListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {places.map((place) => (
        <PlaceListCard
          key={place.id}
          place={place}
          isFavorite={favorites.includes(place.id)}
          isSelected={selectedPlaceId === place.id}
          onToggleFavorite={() => onToggleFavorite(place.id)}
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
