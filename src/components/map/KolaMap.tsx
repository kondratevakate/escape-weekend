import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { kolaPlaces, PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { CategoryFilter } from './CategoryFilter';
import { PlaceMarker } from './PlaceMarker';

// Fix Leaflet default marker icon issue
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
      <MapContainer
        center={KOLA_CENTER}
        zoom={INITIAL_ZOOM}
        zoomControl={false}
        className="h-full w-full"
        style={{ background: '#e8f4f8' }}
      >
        {/* Artistic watercolor-style map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        />
        
        {/* Labels overlay */}
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
        />

        <ZoomControl position="bottomright" />

        {/* Place markers */}
        {filteredPlaces.map(place => (
          <PlaceMarker key={place.id} place={place} />
        ))}
      </MapContainer>

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
