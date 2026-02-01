import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, PlaceCategory, categoryConfig } from '@/data/kolaPlaces';
import { saamiTerritoryGeoJSON } from '@/data/saamiHistoryLayer';
import { CategoryFilter } from './CategoryFilter';

interface MapViewProps {
  places: Place[];
  center: [number, number];
  zoom: number;
  favorites?: string[];
  selectedCategories: PlaceCategory[];
  showFavoritesOnly: boolean;
  favoritesCount: number;
  showHistoryLayer: boolean;
  onToggleCategory: (category: PlaceCategory) => void;
  onToggleFavoritesOnly: () => void;
  onToggleHistoryLayer: () => void;
  onMapReady?: () => void;
  onPlaceClick?: (place: Place) => void;
}

// Responsive marker size based on screen width
const getMarkerSize = () => {
  if (typeof window === 'undefined') return 44;
  return window.innerWidth < 768 ? 32 : 44;
};

export const MapView = ({ 
  places, 
  center, 
  zoom, 
  favorites = [], 
  selectedCategories,
  showFavoritesOnly,
  favoritesCount,
  showHistoryLayer,
  onToggleCategory,
  onToggleFavoritesOnly,
  onToggleHistoryLayer,
  onMapReady, 
  onPlaceClick 
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const historyLayerRef = useRef<L.GeoJSON | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    // CartoDB Positron - fast, minimal, free
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(mapInstanceRef.current);

    // Notify when tiles are loaded
    tileLayer.on('load', () => {
      onMapReady?.();
    });

    // Zoom control on bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  // Update history layer visibility
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showHistoryLayer && !historyLayerRef.current) {
      // Add Saami territory polygon
      historyLayerRef.current = L.geoJSON(saamiTerritoryGeoJSON as GeoJSON.Feature, {
        style: {
          fillColor: 'hsl(340, 65%, 45%)',
          fillOpacity: 0.12,
          color: 'hsl(340, 65%, 35%)',
          weight: 2,
          dashArray: '6, 4',
        },
      }).addTo(mapInstanceRef.current);
      
      // Add popup to polygon
      historyLayerRef.current.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong>📜 Территория саамов</strong><br/>
          <small style="color: #666;">Историческое расселение<br/>саамского народа</small>
        </div>
      `);
    } else if (!showHistoryLayer && historyLayerRef.current) {
      // Remove layer
      historyLayerRef.current.remove();
      historyLayerRef.current = null;
    }
  }, [showHistoryLayer]);

  // Update markers when places or favorites change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const markerSize = getMarkerSize();
    const iconFontSize = markerSize < 40 ? 14 : 20;

    // Add new markers
    places.forEach(place => {
      const config = categoryConfig[place.category];
      const isFavorite = favorites.includes(place.id);
      
      // Build marker HTML with optional favorite styling
      const favoriteStyles = isFavorite 
        ? `
          box-shadow: 0 0 0 3px hsl(45, 93%, 47%), 0 4px 12px rgba(0,0,0,0.25);
          animation: pulse-favorite 2s ease-in-out infinite;
        `
        : 'box-shadow: 0 4px 12px rgba(0,0,0,0.25);';
      
      const favoriteIndicator = isFavorite 
        ? `<div style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            background: hsl(45, 93%, 47%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            border: 2px solid white;
          ">❤️</div>`
        : '';

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container" style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${markerSize}px;
            height: ${markerSize}px;
            background: ${config.bgColor};
            border: 2px solid ${config.color};
            border-radius: 50%;
            ${favoriteStyles}
            font-size: ${iconFontSize}px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${config.icon}
            ${favoriteIndicator}
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -markerSize / 2],
      });

      const marker = L.marker(place.coordinates, { icon });

      // Click handler
      marker.on('click', () => {
        onPlaceClick?.(place);
      });

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [places, favorites, onPlaceClick]);

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ background: 'hsl(var(--muted))' }}
      />
      
      {/* Category filter overlay - right side, vertically centered */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3 z-[1000]">
        <div className="bg-background/95 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-border">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={onToggleCategory}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavoritesOnly={onToggleFavoritesOnly}
            favoritesCount={favoritesCount}
            showHistoryLayer={showHistoryLayer}
            onToggleHistoryLayer={onToggleHistoryLayer}
          />
        </div>
      </div>
      
      {/* History layer attribution */}
      {showHistoryLayer && (
        <div className="absolute bottom-2 left-2 z-[1000]">
          <a 
            href="https://atlaskmns.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            📜 Данные: atlaskmns.ru
          </a>
        </div>
      )}
    </div>
  );
};
