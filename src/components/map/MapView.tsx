import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, categoryConfig } from '@/data/kolaPlaces';

interface MapViewProps {
  places: Place[];
  center: [number, number];
  zoom: number;
  onMapReady?: () => void;
}

export const MapView = ({ places, center, zoom, onMapReady }: MapViewProps) => {
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
            width: 44px;
            height: 44px;
            background: ${config.bgColor};
            border: 3px solid ${config.color};
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${config.icon}
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker(place.coordinates, { icon });

      const popupContent = `
        <div style="min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${config.bgColor};
              font-size: 16px;
            ">${config.icon}</span>
            <span style="
              font-size: 12px;
              font-weight: 500;
              padding: 2px 8px;
              border-radius: 9999px;
              background: ${config.bgColor};
              color: ${config.color};
            ">${config.label}</span>
          </div>
          <h3 style="font-weight: 700; font-size: 18px; margin-bottom: 4px; color: #1a1a1a;">${place.name}</h3>
          ${place.nameEn ? `<p style="font-size: 12px; color: #666; margin-bottom: 8px;">${place.nameEn}</p>` : ''}
          ${place.description ? `<p style="font-size: 14px; color: #444; line-height: 1.5;">${place.description}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [places]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full"
      style={{ background: '#e8f4f8' }}
    />
  );
};
