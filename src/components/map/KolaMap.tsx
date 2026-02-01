import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { kolaPlaces, PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { CategoryFilter } from './CategoryFilter';
import { MapView } from './MapView';

// Kola Peninsula center
const KOLA_CENTER: [number, number] = [68.0, 34.0];
const INITIAL_ZOOM = 7;

export const KolaMap = () => {
  const allCategories = Object.keys(categoryConfig) as PlaceCategory[];
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>(allCategories);

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

  return (
    <div className="relative h-screen w-full">
      {/* Header with filters */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-background via-background/95 to-transparent pb-8 pt-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                🗺️ Кольский полуостров
              </h1>
              <p className="text-muted-foreground mt-1">
                {filteredPlaces.length} мест для исследования
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
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Легенда</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {(Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][]).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span>{config.icon}</span>
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
