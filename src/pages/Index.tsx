import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { DiscoverPanel, TagFilter, TAG_FILTERS } from '@/components/landing/DiscoverPanel';
import { MapView } from '@/components/map/MapView';
import { PlaceCard } from '@/components/map/PlaceCard';
import { RestaurantCard } from '@/components/map/RestaurantCard';
import { ExploreMode } from '@/components/map/ExploreMode';
import { TelegramBridgeSheet } from '@/components/telegram/TelegramBridgeSheet';
import { CookieConsent } from '@/components/CookieConsent';
import { WelcomeModal } from '@/components/WelcomeModal';
import { Place } from '@/data/kolaPlaces';
import { kolaPlaces, locations } from '@/data/locations';
import { getAllCulturalCenters } from '@/data/indigenousPeoplesLayer';
import { unescoPlaces } from '@/data/unescoLayer';
import { restaurantPlaces } from '@/data/restaurantsLayer';
import { useStash } from '@/hooks/useStash';
import { useUserLists } from '@/hooks/useUserLists';
import { useTelegramCTA } from '@/hooks/useTelegramCTA';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const KOLA_CENTER: [number, number] = [68.0, 34.0];
const INITIAL_ZOOM = 7;

const Index = () => {
  const { t, language } = useLanguage();
  const { requireAuth } = useAuth();
  const navigate = useNavigate();
  const { items: stashItems, addToStash, removeFromStash, isInStash, count: stashCount } = useStash();
  const stashedIds = stashItems.map(i => i.id);
  const { 
    lists: userLists, 
    toggleInList, 
    createList, 
    deleteList, 
    isInList, 
    isInAnyList 
  } = useUserLists();

  const { 
    shouldShow: shouldShowTelegramCTA, 
    recordSave, 
    dismissCTA: dismissTelegramCTA 
  } = useTelegramCTA();
  const [telegramSheetOpen, setTelegramSheetOpen] = useState(false);

  useEffect(() => {
    if (shouldShowTelegramCTA) {
      setTelegramSheetOpen(true);
    }
  }, [shouldShowTelegramCTA]);

  const handleSaveToStash = useCallback((id: string, name: string) => {
    addToStash(id, name, 'someday');
    recordSave();
  }, [addToStash, recordSave]);
  
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHistoryLayer, setShowHistoryLayer] = useState(false);
  const [showUnescoLayer, setShowUnescoLayer] = useState(false);
  const [showRestaurantLayer, setShowRestaurantLayer] = useState(false);
  const [showTerrainLayer, setShowTerrainLayer] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState<TagFilter>('all');
  const [highlightCollections, setHighlightCollections] = useState(false);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleToggleFavoritesOnly = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  const handleToggleHistoryLayer = useCallback(() => {
    setShowHistoryLayer(prev => !prev);
  }, []);

  const handleToggleUnescoLayer = useCallback(() => {
    setShowUnescoLayer(prev => !prev);
  }, []);

  const handleToggleRestaurantLayer = useCallback(() => {
    setShowRestaurantLayer(prev => !prev);
  }, []);

  const handleToggleTerrainLayer = useCallback(() => {
    setShowTerrainLayer(prev => !prev);
  }, []);

  const filteredPlaces = useMemo(() => {
    let allPlaces = [...kolaPlaces];
    
    if (showHistoryLayer) {
      allPlaces = [...allPlaces, ...getAllCulturalCenters()];
    }
    if (showUnescoLayer) {
      allPlaces = [...allPlaces, ...unescoPlaces];
    }
    if (showRestaurantLayer) {
      allPlaces = [...allPlaces, ...restaurantPlaces];
    }
    
    let places = allPlaces;

    if (activeTagFilter !== 'all') {
      const filterDef = TAG_FILTERS.find(f => f.id === activeTagFilter);
      if (filterDef) {
        places = places.filter(place => {
          const loc = locations.find(l => l.id === place.id);
          if (!loc) return false;
          return loc.tags.some(tag => filterDef.matchTags.includes(tag));
        });
      }
    }
    
    if (showFavoritesOnly) {
      places = places.filter(place => stashedIds.includes(place.id));
    }
    
    return places;
  }, [showFavoritesOnly, stashedIds, showHistoryLayer, showUnescoLayer, showRestaurantLayer, activeTagFilter]);

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  // Welcome modal actions
  const handleWelcomeExplore = useCallback(() => {}, []);
  const handleWelcomeSwipe = useCallback(() => {
    setIsExploreMode(true);
  }, []);
  const handleWelcomeCollections = useCallback(() => {
    setIsSidebarOpen(true);
    setHighlightCollections(true);
    setTimeout(() => setHighlightCollections(false), 3000);
  }, []);
  const handleWelcomeStash = useCallback(() => {
    navigate('/stash');
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        stashCount={stashCount}
      />
      
      <main className="flex-1 pt-14 md:pt-16 flex flex-col md:flex-row overflow-hidden">
        <aside 
          className={cn(
            "order-2 md:order-1 overflow-y-auto border-t md:border-t-0 md:border-r border-border bg-background transition-all duration-300",
            "h-[40vh] md:h-full",
            isSidebarOpen ? "md:w-[320px]" : "md:w-0 md:overflow-hidden"
          )}
        >
          <DiscoverPanel
            activeFilter={activeTagFilter}
            onFilterChange={setActiveTagFilter}
            onPlaceClick={handlePlaceClick}
            onStartExplore={() => setIsExploreMode(true)}
            filteredCount={filteredPlaces.length}
            highlightCollections={highlightCollections}
          />
        </aside>
        
        <div className="order-1 md:order-2 flex-1 relative h-[60vh] md:h-full">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex absolute top-4 left-4 z-[1000] h-9 w-9 bg-background shadow-md"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>

          {!isMapReady && (
            <div className="absolute inset-0 z-[2000] bg-background flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">{t('loading')}</p>
            </div>
          )}

          <MapView 
            places={filteredPlaces}
            center={KOLA_CENTER}
            zoom={INITIAL_ZOOM}
            favorites={stashedIds}
            showFavoritesOnly={showFavoritesOnly}
            favoritesCount={stashCount}
            showHistoryLayer={showHistoryLayer}
            showUnescoLayer={showUnescoLayer}
            showRestaurantLayer={showRestaurantLayer}
            showTerrainLayer={showTerrainLayer}
            onToggleFavoritesOnly={handleToggleFavoritesOnly}
            onToggleHistoryLayer={handleToggleHistoryLayer}
            onToggleUnescoLayer={handleToggleUnescoLayer}
            onToggleRestaurantLayer={handleToggleRestaurantLayer}
            onToggleTerrainLayer={handleToggleTerrainLayer}
            onMapReady={handleMapReady}
            onPlaceClick={handlePlaceClick}
          />

          {selectedPlace && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] max-w-[calc(100%-2rem)]">
              {selectedPlace.category === 'restaurant' ? (
                <RestaurantCard 
                  place={selectedPlace} 
                  onClose={handleCloseCard}
                />
              ) : (
                <PlaceCard 
                  place={selectedPlace} 
                  onClose={handleCloseCard}
                />
              )}
            </div>
          )}

          {/* Empty state when filter returns 0 */}
          {isMapReady && filteredPlaces.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-background rounded-xl p-6 shadow-lg border border-border text-center">
              <p className="text-muted-foreground text-sm mb-2">
                {language === 'ru' ? 'Нет мест' : 'No places found'}
              </p>
              <button
                onClick={() => setActiveTagFilter('all')}
                className="text-sm text-primary hover:underline"
              >
                {language === 'ru' ? 'Сбросить фильтр →' : 'Reset filter →'}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CookieConsent />

      <WelcomeModal
        onExploreMap={handleWelcomeExplore}
        onSwipeMode={handleWelcomeSwipe}
        onHighlightCollections={handleWelcomeCollections}
        onOpenStash={handleWelcomeStash}
      />

      {isExploreMode && (
        <ExploreMode
          places={filteredPlaces}
          stashedIds={stashedIds}
          onSaveToStash={handleSaveToStash}
          onClose={() => setIsExploreMode(false)}
        />
      )}

      <TelegramBridgeSheet
        isOpen={telegramSheetOpen}
        onClose={() => {
          setTelegramSheetOpen(false);
          dismissTelegramCTA();
        }}
        trigger="save"
      />
    </div>
  );
};

export default Index;
