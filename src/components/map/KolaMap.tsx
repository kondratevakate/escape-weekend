import { useState, useMemo, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { kolaPlaces, PlaceCategory, categoryConfig, Place } from '@/data/kolaPlaces';
import { saamiHistoryPlaces } from '@/data/saamiHistoryLayer';
import { unescoPlaces } from '@/data/unescoLayer';
import { CategoryFilter } from './CategoryFilter';
import { MapView } from './MapView';
import { PlaceCard } from './PlaceCard';
import { ExploreMode } from './ExploreMode';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CookieConsent } from '@/components/CookieConsent';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Kola Peninsula center
const KOLA_CENTER: [number, number] = [68.0, 34.0];
const INITIAL_ZOOM = 7;

interface KolaMapProps {
  embedded?: boolean;
}

export const KolaMap = ({ embedded = false }: KolaMapProps) => {
  const { t } = useLanguage();
  const { favorites, toggleFavorite, isFavorite, favoritesCount } = useFavorites();
  
  // Filter out 'history' from default selected categories - it's controlled by history layer toggle
  const defaultCategories = (Object.keys(categoryConfig) as PlaceCategory[]).filter(c => c !== 'history');
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>(defaultCategories);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHistoryLayer, setShowHistoryLayer] = useState(false);
  const [showUnescoLayer, setShowUnescoLayer] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isExploreMode, setIsExploreMode] = useState(false);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const filteredPlaces = useMemo(() => {
    // Combine base places with special layers
    let allPlaces = [...kolaPlaces];
    
    if (showHistoryLayer) {
      allPlaces = [...allPlaces, ...saamiHistoryPlaces];
    }
    if (showUnescoLayer) {
      allPlaces = [...allPlaces, ...unescoPlaces];
    }
    
    let places = allPlaces.filter(place => 
      selectedCategories.includes(place.category) ||
      (showHistoryLayer && place.category === 'history') ||
      (showUnescoLayer && place.category === 'unesco')
    );
    
    if (showFavoritesOnly) {
      places = places.filter(place => favorites.includes(place.id));
    }
    return places;
  }, [selectedCategories, showFavoritesOnly, favorites, showHistoryLayer, showUnescoLayer]);

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

  const handleToggleFavoritesOnly = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  const handleToggleHistoryLayer = () => {
    setShowHistoryLayer(prev => !prev);
  };

  const handleToggleUnescoLayer = () => {
    setShowUnescoLayer(prev => !prev);
  };

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleToggleSelectedFavorite = useCallback(() => {
    if (selectedPlace) {
      toggleFavorite(selectedPlace.id);
    }
  }, [selectedPlace, toggleFavorite]);

  // Explore mode
  if (isExploreMode) {
    return (
      <ExploreMode
        places={kolaPlaces}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onClose={() => setIsExploreMode(false)}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 z-[2000] bg-background flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">{t('loading')}</p>
        </div>
      )}

      {/* Header - only show when not embedded */}
      {!embedded && (
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-background via-background/95 to-transparent pb-6 md:pb-4 pt-3 md:pt-4 px-3 md:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3 md:mb-0">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  {t('explore')}
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                  {t('subtitle')} • {filteredPlaces.length} {t('places')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsExploreMode(true)}
                  className="hidden md:flex"
                >
                  <Compass className="h-4 w-4 mr-1.5" />
                  {t('actions.explore')}
                </Button>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile category filters - only when not embedded */}
      {!embedded && (
        <div className="md:hidden absolute top-20 left-0 right-0 z-[1000] px-3">
          <CategoryFilter 
            selectedCategories={selectedCategories} 
            onToggleCategory={handleToggleCategory}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavoritesOnly={handleToggleFavoritesOnly}
            favoritesCount={favoritesCount}
            showHistoryLayer={showHistoryLayer}
            onToggleHistoryLayer={handleToggleHistoryLayer}
            showUnescoLayer={showUnescoLayer}
            onToggleUnescoLayer={handleToggleUnescoLayer}
          />
        </div>
      )}

      {/* Explore button - mobile only, when not embedded */}
      {!embedded && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsExploreMode(true)}
          className="sm:hidden fixed bottom-20 right-4 z-[1000] h-12 w-12 rounded-full shadow-lg"
        >
          <Compass className="h-5 w-5" />
        </Button>
      )}

      {/* Map */}
      <MapView 
        places={filteredPlaces}
        center={KOLA_CENTER}
        zoom={INITIAL_ZOOM}
        favorites={favorites}
        selectedCategories={selectedCategories}
        showFavoritesOnly={showFavoritesOnly}
        favoritesCount={favoritesCount}
        showHistoryLayer={showHistoryLayer}
        showUnescoLayer={showUnescoLayer}
        onToggleCategory={handleToggleCategory}
        onToggleFavoritesOnly={handleToggleFavoritesOnly}
        onToggleHistoryLayer={handleToggleHistoryLayer}
        onToggleUnescoLayer={handleToggleUnescoLayer}
        onMapReady={handleMapReady}
        onPlaceClick={handlePlaceClick}
      />

      {/* Place card overlay */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] max-w-[calc(100%-2rem)]">
          <PlaceCard 
            place={selectedPlace} 
            isFavorite={isFavorite(selectedPlace.id)}
            onClose={handleCloseCard}
            onToggleFavorite={handleToggleSelectedFavorite}
          />
        </div>
      )}

      {/* Interactive Legend - right side, hidden on mobile */}
      <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-[1000] bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border">
        {/* Favorites filter */}
        <button
          onClick={handleToggleFavoritesOnly}
          className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-all mb-2 ${
            showFavoritesOnly 
              ? 'bg-accent/20 text-accent' 
              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-base">❤️</span>
          <span>{t('favorites.title')}</span>
          {favoritesCount > 0 && (
            <span className="ml-auto text-xs font-medium bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
              {favoritesCount}
            </span>
          )}
        </button>
        <div className="h-px bg-border mb-2" />
        {/* Category filters */}
        <div className="flex flex-col gap-1">
          {(Object.entries(categoryConfig) as [PlaceCategory, typeof categoryConfig[PlaceCategory]][]).map(([key, config]) => {
            const isSelected = selectedCategories.includes(key);
            return (
              <button
                key={key}
                onClick={() => handleToggleCategory(key)}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-all ${
                  isSelected 
                    ? 'text-foreground' 
                    : 'text-muted-foreground/50 hover:text-muted-foreground'
                }`}
                style={isSelected ? { backgroundColor: `${config.bgColor}` } : undefined}
              >
                <span className="text-base">{config.icon}</span>
                <span>{t(`categories.${key}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cookie consent - only when not embedded */}
      {!embedded && <CookieConsent />}
    </div>
  );
};
