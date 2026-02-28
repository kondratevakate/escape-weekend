import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header, CategoryGroup } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { DiscoverPanel, TagFilter, TAG_FILTERS } from '@/components/landing/DiscoverPanel';
import { MapView } from '@/components/map/MapView';
import { PlaceCard } from '@/components/map/PlaceCard';
import { ExploreMode } from '@/components/map/ExploreMode';
import { TelegramBridgeSheet } from '@/components/telegram/TelegramBridgeSheet';
import { CookieConsent } from '@/components/CookieConsent';
import { Place, PlaceCategory } from '@/data/kolaPlaces';
import { kolaPlaces, locations } from '@/data/locations';
import { getAllCulturalCenters } from '@/data/indigenousPeoplesLayer';
import { unescoPlaces } from '@/data/unescoLayer';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserLists } from '@/hooks/useUserLists';
import { useTelegramCTA } from '@/hooks/useTelegramCTA';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Category group mappings
const categoryGroupMap: Record<CategoryGroup, PlaceCategory[]> = {
  nature: ['nature', 'reserve'],
  hiking: ['hiking'],
  top: ['attraction', 'museum', 'village', 'city'],
};

// Kola Peninsula center
const KOLA_CENTER: [number, number] = [68.0, 34.0];
const INITIAL_ZOOM = 7;

const Index = () => {
  const { t } = useLanguage();
  const { requireAuth } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
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

  const handleToggleFavorite = useCallback((id: string) => {
    requireAuth(() => {
      toggleFavorite(id);
      if (!favorites.includes(id)) {
        recordSave();
      }
    });
  }, [requireAuth, toggleFavorite, favorites, recordSave]);
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryGroup | 'all'>('all');
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHistoryLayer, setShowHistoryLayer] = useState(false);
  const [showUnescoLayer, setShowUnescoLayer] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState<TagFilter>('all');

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleToggleCategory = useCallback((category: PlaceCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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

  // Filter places based on tag filter + header category + map category filter
  const filteredPlaces = useMemo(() => {
    let allPlaces = [...kolaPlaces];
    
    if (showHistoryLayer) {
      allPlaces = [...allPlaces, ...getAllCulturalCenters()];
    }
    if (showUnescoLayer) {
      allPlaces = [...allPlaces, ...unescoPlaces];
    }
    
    let places = allPlaces;

    // Apply tag filter from left panel
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
    
    // Header category group
    if (selectedCategory !== 'all') {
      const allowedCategories = categoryGroupMap[selectedCategory];
      places = places.filter(place => allowedCategories.includes(place.category));
    }
    
    // Map category filter (right sidebar icons)
    if (selectedCategories.length > 0) {
      places = places.filter(place => 
        selectedCategories.includes(place.category) || 
        (showHistoryLayer && place.category === 'history') ||
        (showUnescoLayer && place.category === 'unesco')
      );
    }
    
    if (showFavoritesOnly) {
      places = places.filter(place => favorites.includes(place.id));
    }
    
    return places;
  }, [selectedCategory, selectedCategories, showFavoritesOnly, favorites, showHistoryLayer, showUnescoLayer, activeTagFilter]);

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
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
          />
        </aside>
        
        <div className="order-1 md:order-2 flex-1 relative h-[60vh] md:h-full">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex absolute top-4 left-4 z-[1000] h-9 w-9 bg-background/95 backdrop-blur-sm shadow-md"
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
            favorites={favorites}
            selectedCategories={selectedCategories}
            showFavoritesOnly={showFavoritesOnly}
            favoritesCount={favorites.length}
            showHistoryLayer={showHistoryLayer}
            showUnescoLayer={showUnescoLayer}
            onToggleCategory={handleToggleCategory}
            onToggleFavoritesOnly={handleToggleFavoritesOnly}
            onToggleHistoryLayer={handleToggleHistoryLayer}
            onToggleUnescoLayer={handleToggleUnescoLayer}
            onMapReady={handleMapReady}
            onPlaceClick={handlePlaceClick}
          />

          {selectedPlace && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] max-w-[calc(100%-2rem)]">
              <PlaceCard 
                place={selectedPlace} 
                onClose={handleCloseCard}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CookieConsent />

      {isExploreMode && (
        <ExploreMode
          places={filteredPlaces}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
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
