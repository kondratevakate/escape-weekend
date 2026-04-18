import { Place, categoryConfig } from '@/data/kolaPlaces';
import { getLocationById } from '@/data/locations';
import { X, MapPin, UtensilsCrossed, ExternalLink, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { SeasonPills } from '@/components/SeasonPills';
import { WarningsSection } from './WarningsSection';
import { OnlyHereSection } from './OnlyHereSection';
import { SafetySection } from './SafetySection';
import { Link } from 'react-router-dom';
import { useClubPosts } from '@/hooks/useClubPosts';
import { POST_TYPE_META } from '@/types/club';

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

        {/* Best time to visit — month pills */}
        {location && location.season.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {language === 'ru' ? 'Лучшее время' : 'Best time'}
            </p>
            <SeasonPills
              season={location.season}
              language={language}
              reasons={location.best_time?.reasons}
              avoid={location.best_time?.avoid}
            />
          </div>
        )}

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

        {/* 6. Только здесь */}
        {location?.only_here && (
          <OnlyHereSection onlyHere={location.only_here} language={language} />
        )}

        {/* 7. Важно знать — safety */}
        {location?.safety && (
          <SafetySection safety={location.safety} language={language} />
        )}

        {/* 8. Warnings (road/permit/crowds) */}
        {location?.warnings && Object.keys(location.warnings).length > 0 && (
          <WarningsSection warnings={location.warnings} language={language} />
        )}

        {/* Club posts about this place */}
        {clubPosts.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 inline-flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {language === 'ru' ? 'О месте писали в клубе' : 'From the club'}
            </p>
            <div className="space-y-1.5">
              {clubPosts.slice(0, 3).map(p => {
                const meta = POST_TYPE_META[p.type];
                return (
                  <Link
                    key={p.id}
                    to={`/club/post/${p.id}`}
                    className="flex items-start gap-2 p-2 rounded-md bg-muted/40 hover:bg-muted text-xs"
                  >
                    <span className="text-base shrink-0" style={{ color: meta.color }}>{meta.emoji}</span>
                    <span className="text-foreground line-clamp-2 leading-snug">{p.title[language]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* External link */}
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
