import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header, CategoryGroup } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { DiscoverPanel } from '@/components/landing/DiscoverPanel';
import { MapView } from '@/components/map/MapView';
import { PlaceBottomSheet } from '@/components/map/PlaceBottomSheet';
import { ExploreMode } from '@/components/map/ExploreMode';
import { TelegramBridgeSheet } from '@/components/telegram/TelegramBridgeSheet';
import { CookieConsent } from '@/components/CookieConsent';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { kolaPlaces, Place, PlaceCategory } from '@/data/kolaPlaces';
import { getAllCulturalCenters } from '@/data/indigenousPeoplesLayer';
import { unescoPlaces } from '@/data/unescoLayer';
import { collections } from '@/data/collections';
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

  // Telegram CTA hook
  const { 
    shouldShow: shouldShowTelegramCTA, 
    recordSave, 
    dismissCTA: dismissTelegramCTA 
  } = useTelegramCTA();
  const [telegramSheetOpen, setTelegramSheetOpen] = useState(false);

  // Show Telegram CTA when threshold reached
  useEffect(() => {
    if (shouldShowTelegramCTA) {
      setTelegramSheetOpen(true);
    }
  }, [shouldShowTelegramCTA]);

  // Wrap toggleFavorite with auth check and Telegram CTA tracking
  const handleToggleFavorite = useCallback((id: string) => {
    requireAuth(() => {
      toggleFavorite(id);
      // Record save for Telegram CTA
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
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

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

  // Filter places based on header category group AND map category filter AND active collection
  const filteredPlaces = useMemo(() => {
    // Combine base places with special layers
    let allPlaces = [...kolaPlaces];
    
    if (showHistoryLayer) {
      allPlaces = [...allPlaces, ...getAllCulturalCenters()];
    }
    if (showUnescoLayer) {
      allPlaces = [...allPlaces, ...unescoPlaces];
    }
    
    let places = allPlaces;
    
    // If a collection is active, filter by collection placeIds
    if (activeCollectionId) {
      const collection = collections.find(c => c.id === activeCollectionId);
      if (collection) {
        places = places.filter(place => collection.placeIds.includes(place.id));
        return places; // Skip other filters when collection is active
      }
    }
    
    // First filter by header category group
    if (selectedCategory !== 'all') {
      const allowedCategories = categoryGroupMap[selectedCategory];
      places = places.filter(place => allowedCategories.includes(place.category));
    }
    
    // Then filter by map category filter
    if (selectedCategories.length > 0) {
      // Always include history/unesco places when their layers are on
      places = places.filter(place => 
        selectedCategories.includes(place.category) || 
        (showHistoryLayer && place.category === 'history') ||
        (showUnescoLayer && place.category === 'unesco')
      );
    }
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      places = places.filter(place => favorites.includes(place.id));
    }
    
    return places;
  }, [selectedCategory, selectedCategories, showFavoritesOnly, favorites, activeCollectionId, showHistoryLayer, showUnescoLayer]);

  const handlePlaceClick = useCallback((place: Place) => {
    const index = filteredPlaces.findIndex(p => p.id === place.id);
    setSelectedPlace(place);
    setSelectedPlaceIndex(index >= 0 ? index : 0);
  }, [filteredPlaces]);

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
    setSelectedPlaceIndex(0);
  }, []);

  const handleToggleSelectedFavorite = useCallback(() => {
    if (selectedPlace) {
      handleToggleFavorite(selectedPlace.id);
    }
  }, [selectedPlace, handleToggleFavorite]);

  // Navigation between places
  const handlePreviousPlace = useCallback(() => {
    if (selectedPlaceIndex > 0) {
      const newIndex = selectedPlaceIndex - 1;
      setSelectedPlaceIndex(newIndex);
      setSelectedPlace(filteredPlaces[newIndex]);
    }
  }, [selectedPlaceIndex, filteredPlaces]);

  const handleNextPlace = useCallback(() => {
    if (selectedPlaceIndex < filteredPlaces.length - 1) {
      const newIndex = selectedPlaceIndex + 1;
      setSelectedPlaceIndex(newIndex);
      setSelectedPlace(filteredPlaces[newIndex]);
    }
  }, [selectedPlaceIndex, filteredPlaces]);

  return (
    <div className="h-screen flex flex-col bg-background pb-14 md:pb-0">
      {/* Header with category tabs */}
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* Main content - Split layout */}
      <main className="flex-1 pt-14 md:pt-16 flex flex-col md:flex-row overflow-hidden">
        {/* Left panel - Places list (desktop) / Bottom drawer (mobile) */}
        <aside 
          className={cn(
            "order-2 md:order-1 overflow-y-auto border-t md:border-t-0 md:border-r border-border bg-background transition-all duration-300",
            // Mobile: always show bottom panel
            "h-[40vh] md:h-full",
            // Desktop: collapsible
            isSidebarOpen ? "md:w-[320px]" : "md:w-0 md:overflow-hidden"
          )}
        >
          <DiscoverPanel
            activeCollectionId={activeCollectionId}
            onStartExplore={() => setIsExploreMode(true)}
            onSelectCollection={setActiveCollectionId}
            onPlaceClick={handlePlaceClick}
          />
        </aside>
        
        {/* Right panel - Map */}
        <div className="order-1 md:order-2 flex-1 relative h-[60vh] md:h-full">
          {/* Sidebar toggle button - desktop only */}
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

          {/* Loading overlay */}
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

        </div>
      </main>

      {/* Place Bottom Sheet */}
      <PlaceBottomSheet
        place={selectedPlace}
        isFavorite={selectedPlace ? isFavorite(selectedPlace.id) : false}
        onClose={handleCloseCard}
        onToggleFavorite={handleToggleSelectedFavorite}
        onPrevious={handlePreviousPlace}
        onNext={handleNextPlace}
        hasPrevious={selectedPlaceIndex > 0}
        hasNext={selectedPlaceIndex < filteredPlaces.length - 1}
        currentIndex={selectedPlaceIndex}
        totalCount={filteredPlaces.length}
        userLists={userLists}
        onToggleInList={toggleInList}
        onCreateList={createList}
        onDeleteList={deleteList}
        isInList={isInList}
        isInAnyList={isInAnyList}
      />

      {/* Footer - hide on mobile to make room for bottom nav */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />

      {/* Cookie consent */}
      <CookieConsent />

      {/* Explore Mode */}
      {isExploreMode && (
        <ExploreMode
          places={filteredPlaces}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setIsExploreMode(false)}
        />
      )}

      {/* Telegram Bridge CTA */}
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
