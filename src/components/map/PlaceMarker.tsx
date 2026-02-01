import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place, categoryConfig } from '@/data/kolaPlaces';

interface PlaceMarkerProps {
  place: Place;
}

const createCustomIcon = (place: Place) => {
  const config = categoryConfig[place.category];
  
  return L.divIcon({
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
};

export const PlaceMarker = ({ place }: PlaceMarkerProps) => {
  const config = categoryConfig[place.category];
  
  return (
    <Marker position={place.coordinates} icon={createCustomIcon(place)}>
      <Popup className="custom-popup">
        <div className="min-w-[200px] p-1">
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-lg"
              style={{ backgroundColor: config.bgColor }}
            >
              {config.icon}
            </span>
            <span 
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: config.bgColor, color: config.color }}
            >
              {config.label}
            </span>
          </div>
          <h3 className="font-bold text-lg text-foreground mb-1">{place.name}</h3>
          {place.nameEn && (
            <p className="text-xs text-muted-foreground mb-2">{place.nameEn}</p>
          )}
          {place.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {place.description}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
