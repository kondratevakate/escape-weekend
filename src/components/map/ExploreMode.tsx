import { useState, useMemo } from 'react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { SwipeableCard } from './SwipeableCard';
import { Button } from '@/components/ui/button';
import { X, MapPin, Star, RotateCcw, Map, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAllPlaceStats, formatCount } from '@/hooks/usePlaceStats';
import { ShareButton } from './ShareButton';

interface ExploreModeProps {
  places: Place[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

// Mock data for images
const getPlaceImage = (place: Place) => {
  const images = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
  ];
  // Deterministic image based on place id
  const index = place.id.charCodeAt(0) % images.length;
  return images[index];
};

export const ExploreMode = ({ places, favorites, onToggleFavorite, onClose }: ExploreModeProps) => {
  const { t, language } = useLanguage();
  const { getStats, recordShare } = useAllPlaceStats();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  // Filter out already viewed places
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
      <div className="flex-1 flex items-center justify-center p-4">
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
              {/* Image */}
              <div className="relative h-56">
                <img
                  src={getPlaceImage(currentPlace)}
                  alt={currentPlace.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{(4.5 + Math.random() * 0.4).toFixed(1)}</span>
                </div>
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

                {/* Social stats - minimalist */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <span>❤️</span>
                    <span>{formatCount(getStats(currentPlace.id).likesCount)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📤</span>
                    <span>{formatCount(getStats(currentPlace.id).sharesCount)}</span>
                  </span>
                </div>

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
                    onShare={() => recordShare(currentPlace.id)} 
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
