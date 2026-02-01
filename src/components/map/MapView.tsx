import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, categoryConfig } from '@/data/kolaPlaces';

interface MapViewProps {
  places: Place[];
  center: [number, number];
  zoom: number;
  onMapReady?: () => void;
  onPlaceClick?: (place: Place) => void;
}

// Responsive marker size based on screen width
const getMarkerSize = () => {
  if (typeof window === 'undefined') return 44;
  return window.innerWidth < 768 ? 32 : 44;
};

export const MapView = ({ places, center, zoom, onMapReady, onPlaceClick }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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

  // Update markers when places change
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
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${markerSize}px;
            height: ${markerSize}px;
            background: ${config.bgColor};
            border: 2px solid ${config.color};
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            font-size: ${iconFontSize}px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${config.icon}
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
  }, [places, onPlaceClick]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full"
      style={{ background: '#e8f4f8' }}
    />
  );
};
