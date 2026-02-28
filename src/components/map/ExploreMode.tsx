import { useState, useMemo } from 'react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { getLocationById } from '@/data/locations';
import { SwipeableCard } from './SwipeableCard';
import { Button } from '@/components/ui/button';
import { X, MapPin, RotateCcw, Map } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareButton } from './ShareButton';

interface ExploreModeProps {
  places: Place[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export const ExploreMode = ({ places, favorites, onToggleFavorite, onClose }: ExploreModeProps) => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  const remainingPlaces = useMemo(() => {
    return places.filter(place => !viewedIds.has(place.id));
  }, [places, viewedIds]);

  const currentPlace = remainingPlaces[0];
  const totalPlaces = places.length;
  const viewedCount = viewedIds.size;

  const handleSwipeLeft = () => {
    if (currentPlace) {
      setViewedIds(prev => new Set([...prev, currentPlace.id]));
    }
  };

  const handleSwipeRight = () => {
    if (currentPlace) {
      if (!favorites.includes(currentPlace.id)) {
        onToggleFavorite(currentPlace.id);
      }
      setViewedIds(prev => new Set([...prev, currentPlace.id]));
    }
  };

  const handleRestart = () => {
    setViewedIds(new Set());
    setCurrentIndex(0);
  };

  const isComplete = !currentPlace;
  const location = currentPlace ? getLocationById(currentPlace.id) : undefined;

  return (
    <div className="fixed inset-0 z-[2000] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-bold text-lg">{t('exploreMode.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {viewedCount} {t('exploreMode.of')} {totalPlaces}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(viewedCount / totalPlaces) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!isComplete && (
          <div className="mb-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {language === 'ru' 
                ? `Открыто ${viewedCount} из ${totalPlaces} мест` 
                : `Discovered ${viewedCount} of ${totalPlaces} places`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ru'
                ? `❤️ Сохранено: ${favorites.length}`
                : `❤️ Saved: ${favorites.length}`}
            </p>
          </div>
        )}

        {isComplete ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">{t('exploreMode.finish')}</h3>
            <p className="text-muted-foreground mb-6">{t('exploreMode.allViewed')}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('exploreMode.restart')}
              </Button>
              <Button onClick={onClose}>
                <Map className="h-4 w-4 mr-2" />
                {t('actions.back')}
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                ❤️ {favorites.length} {t('favorites.count')}
              </p>
            </div>
          </div>
        ) : (
          <SwipeableCard
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="w-full max-w-sm"
          >
            <div className="bg-card rounded-xl shadow-2xl border overflow-hidden">
              {/* Photo or placeholder */}
              <div className="relative h-56">
                {location?.photo_url ? (
                  <img
                    src={location.photo_url}
                    alt={currentPlace.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: categoryConfig[currentPlace.category].bgColor }}
                  >
                    <span className="text-6xl">{categoryConfig[currentPlace.category].icon}</span>
                  </div>
                )}
                {favorites.includes(currentPlace.id) && (
                  <div className="absolute top-3 right-3 p-1.5 bg-accent/90 rounded-full">
                    <span className="text-sm">❤️</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span 
                    className="text-lg w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ background: categoryConfig[currentPlace.category].bgColor }}
                  >
                    {categoryConfig[currentPlace.category].icon}
                  </span>
                  <span 
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ 
                      background: categoryConfig[currentPlace.category].bgColor,
                      color: categoryConfig[currentPlace.category].color 
                    }}
                  >
                    {t(`categories.${currentPlace.category}`)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl mb-1">{currentPlace.name}</h3>
                {currentPlace.nameEn && language === 'ru' && (
                  <p className="text-sm text-muted-foreground mb-2">{currentPlace.nameEn}</p>
                )}

                {/* Description */}
                {currentPlace.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentPlace.description}
                  </p>
                )}

                {/* Location hint */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{currentPlace.region}</span>
                  </div>
                  <ShareButton 
                    place={currentPlace} 
                    onShare={() => {}} 
                    variant="icon"
                  />
                </div>
              </div>
            </div>
          </SwipeableCard>
        )}
      </div>

      {/* Hint */}
      {!isComplete && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          ← {t('actions.skip')} | {t('actions.like')} →
        </div>
      )}
    </div>
  );
};
