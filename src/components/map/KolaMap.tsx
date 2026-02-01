import { useState, useMemo, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { kolaPlaces, PlaceCategory, categoryConfig, Place } from '@/data/kolaPlaces';
import { CategoryFilter } from './CategoryFilter';
import { MapView } from './MapView';
import { PlaceCard } from './PlaceCard';
import { PlaceSheet } from './PlaceSheet';
import { Loader2 } from 'lucide-react';

// Kola Peninsula center
const KOLA_CENTER: [number, number] = [68.0, 34.0];
const INITIAL_ZOOM = 7;

export const KolaMap = () => {
  const allCategories = Object.keys(categoryConfig) as PlaceCategory[];
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>(allCategories);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const filteredPlaces = useMemo(() => {
    return kolaPlaces.filter(place => selectedCategories.includes(place.category));
  }, [selectedCategories]);

  const handleToggleCategory = (category: PlaceCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Don't allow deselecting all
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleOpenSheet = useCallback(() => {
    setIsSheetOpen(true);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 z-[2000] bg-background flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Загружаем карту...</p>
        </div>
      )}

      {/* Header with filters */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-background via-background/95 to-transparent pb-6 md:pb-8 pt-3 md:pt-4 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground tracking-tight">
                Исследуй Кольский
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-0.5 md:mt-1">
                Край северного сияния • {filteredPlaces.length} мест
              </p>
            </div>
          </div>
          <CategoryFilter 
            selectedCategories={selectedCategories} 
            onToggleCategory={handleToggleCategory}
          />
        </div>
      </div>

      {/* Map */}
      <MapView 
        places={filteredPlaces}
        center={KOLA_CENTER}
        zoom={INITIAL_ZOOM}
        onMapReady={handleMapReady}
        onPlaceClick={handlePlaceClick}
      />

      {/* Place card overlay */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] max-w-[calc(100%-2rem)]">
          <PlaceCard 
            place={selectedPlace} 
            onClose={handleCloseCard}
            onOpenFullMap={handleOpenSheet}
          />
        </div>
      )}

      {/* Reviews sheet */}
      <PlaceSheet 
        place={selectedPlace}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      {/* Legend - right side, hidden on mobile */}
      <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-[1000] bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
        <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Легенда</p>
        <div className="flex flex-col gap-2">
          {(Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][]).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{config.icon}</span>
              <span className="text-foreground/80">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
