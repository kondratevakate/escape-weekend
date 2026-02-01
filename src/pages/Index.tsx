import { useState, useCallback, useMemo } from 'react';
import { Header, CategoryGroup } from '@/components/landing/Header';
import { PlacesList } from '@/components/landing/PlacesList';
import { MapView } from '@/components/map/MapView';
import { PlaceCard } from '@/components/map/PlaceCard';
import { PlaceSheet } from '@/components/map/PlaceSheet';
import { CookieConsent } from '@/components/CookieConsent';
import { kolaPlaces, Place, PlaceCategory } from '@/data/kolaPlaces';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryGroup | 'all'>('all');
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  // Filter places based on header category group AND map category filter
  const filteredPlaces = useMemo(() => {
    let places = kolaPlaces;
    
    // First filter by header category group
    if (selectedCategory !== 'all') {
      const allowedCategories = categoryGroupMap[selectedCategory];
      places = places.filter(place => allowedCategories.includes(place.category));
    }
    
    // Then filter by map category filter
    if (selectedCategories.length > 0) {
      places = places.filter(place => selectedCategories.includes(place.category));
    }
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      places = places.filter(place => favorites.includes(place.id));
    }
    
    return places;
  }, [selectedCategory, selectedCategories, showFavoritesOnly, favorites]);

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleOpenSheet = useCallback(() => {
    setIsSheetOpen(true);
  }, []);

  const handleToggleSelectedFavorite = useCallback(() => {
    if (selectedPlace) {
      toggleFavorite(selectedPlace.id);
    }
  }, [selectedPlace, toggleFavorite]);

  return (
    <div className="h-screen flex flex-col bg-background">
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
          <PlacesList
            places={filteredPlaces}
            favorites={favorites}
            selectedPlaceId={selectedPlace?.id}
            onToggleFavorite={toggleFavorite}
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
            onToggleCategory={handleToggleCategory}
            onToggleFavoritesOnly={handleToggleFavoritesOnly}
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
                onOpenFullMap={handleOpenSheet}
                onToggleFavorite={handleToggleSelectedFavorite}
              />
            </div>
          )}
        </div>
      </main>

      {/* Reviews sheet */}
      <PlaceSheet 
        place={selectedPlace}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      {/* Cookie consent */}
      <CookieConsent />
    </div>
  );
};

export default Index;
