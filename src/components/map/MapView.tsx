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

// Responsive marker size based on screen width
const getMarkerSize = () => {
  if (typeof window === 'undefined') return 44;
  return window.innerWidth < 768 ? 32 : 44;
};

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

    const markerSize = getMarkerSize();
    const iconFontSize = markerSize < 40 ? 14 : 20;
    const popupIconSize = markerSize < 40 ? 24 : 32;
    const popupFontSize = markerSize < 40 ? 14 : 16;

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

      // Google Maps URL for navigation
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates[0]},${place.coordinates[1]}`;

      const popupContent = `
        <div style="min-width: 180px; max-width: 260px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: ${popupIconSize}px;
              height: ${popupIconSize}px;
              border-radius: 50%;
              background: ${config.bgColor};
              font-size: ${popupFontSize}px;
            ">${config.icon}</span>
            <span style="
              font-size: 11px;
              font-weight: 500;
              padding: 2px 8px;
              border-radius: 9999px;
              background: ${config.bgColor};
              color: ${config.color};
            ">${config.label}</span>
          </div>
          <h3 style="font-weight: 700; font-size: 16px; margin-bottom: 4px; color: #1a1a1a;">${place.name}</h3>
          ${place.nameEn ? `<p style="font-size: 11px; color: #666; margin-bottom: 8px;">${place.nameEn}</p>` : ''}
          ${place.description ? `<p style="font-size: 13px; color: #444; line-height: 1.4; margin-bottom: 12px;">${place.description}</p>` : ''}
          <a 
            href="${googleMapsUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 8px 12px;
              background: #4285F4;
              color: white;
              border-radius: 8px;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#3367D6'"
            onmouseout="this.style.background='#4285F4'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Открыть в Google Maps
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'custom-popup'
      });
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
