import { Place, categoryConfig } from '@/data/kolaPlaces';
import { getLocationById } from '@/data/locations';
import { X, MapPin, UtensilsCrossed, AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
}

export const PlaceCard = ({ place, onClose }: PlaceCardProps) => {
  const { t, language } = useLanguage();
  const config = categoryConfig[place.category];
  const location = getLocationById(place.id);

  return (
    <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden w-[320px]">
      {/* 1. Photo */}
      <div className="relative h-[200px] overflow-hidden">
        {location?.photo_url ? (
          <img
            src={location.photo_url}
            alt={place.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: config.bgColor }}
          >
            <span className="text-6xl">{config.icon}</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* 2. Tags row */}
        <div className="flex flex-wrap gap-1.5">
          {location && location.season.length > 0 && location.season.length < 12 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
              📅 {location.season.join(', ')}
            </span>
          )}
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: config.bgColor, color: config.color }}
          >
            {config.icon} {t(`categories.${place.category}`)}
          </span>
          {location && location.tags.filter(tag => !['nature', 'hiking', 'museums', 'attractions', 'villages', 'cities', 'reserves', 'history', 'unesco'].includes(tag)).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* 3. Location name */}
        <div>
          <h3 className="font-bold text-lg leading-tight text-foreground">{place.name}</h3>
          {place.nameEn && language === 'ru' && (
            <p className="text-xs text-muted-foreground mt-0.5">{place.nameEn}</p>
          )}
        </div>

        {/* 4. Что делать */}
        {location?.what_to_do && location.what_to_do !== 'TODO: fill in' && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {language === 'ru' ? 'Что делать' : 'What to do'}
            </p>
            <p className="text-sm text-foreground leading-relaxed">{location.what_to_do}</p>
          </div>
        )}

        {/* 5. Пэйринг */}
        {location?.pairing && location.pairing !== 'TODO: fill in' && (
          <div className="flex gap-2">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                {language === 'ru' ? 'Пэйринг' : 'Pairing'}
              </p>
              <p className="text-sm text-foreground leading-relaxed">{location.pairing}</p>
            </div>
          </div>
        )}

        {/* 6. Permit warning */}
        {location?.permit_required && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(25_95%_95%)] border border-[hsl(25_95%_80%)]">
            <AlertTriangle className="h-4 w-4 text-[hsl(25_95%_53%)] shrink-0" />
            <span className="text-xs font-medium text-[hsl(25_80%_35%)]">
              {language === 'ru' ? 'Нужен пропуск у погранцов' : 'Border permit required'}
            </span>
          </div>
        )}

        {/* 7. External link */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg",
            "bg-primary text-primary-foreground text-sm font-medium",
            "hover:bg-primary/90 transition-colors active:scale-[0.98]"
          )}
        >
          <MapPin className="h-4 w-4" />
          {language === 'ru' ? 'Открыть на карте' : 'Open on map'}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};
