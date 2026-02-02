import { useState, useRef } from 'react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { X, Star, Heart, ChevronUp, ChevronDown, ExternalLink, Clock, ThumbsUp, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { usePlaceStats, formatCount } from '@/hooks/usePlaceStats';
import { ShareButton } from './ShareButton';
import { SaveToListDrawer } from './SaveToListDrawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserList } from '@/hooks/useUserLists';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

interface PlaceBottomSheetProps {
  place: Place | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  // Navigation
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
  // User lists props
  userLists?: UserList[];
  onToggleInList?: (listId: string, placeId: string) => void;
  onCreateList?: (name: string, emoji: string) => string;
  onDeleteList?: (id: string) => void;
  isInList?: (listId: string, placeId: string) => boolean;
  isInAnyList?: (placeId: string) => boolean;
}

// Mock data
const getMockPlaceData = (place: Place) => {
  const mockImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  ];
  
  const index = place.id.charCodeAt(0) % mockImages.length;

  return {
    imageUrl: mockImages[index],
    rating: 4.5 + (place.id.charCodeAt(0) % 5) * 0.1,
    reviewCount: 50 + (place.id.charCodeAt(1) % 150),
    summaryRu: 'Посетители отмечают невероятные виды и атмосферу дикой природы. Лучшее время — закат или полярная ночь для северного сияния.',
    summaryEn: 'Visitors praise the incredible views and wild nature atmosphere. Best time to visit is sunset or polar night for Northern Lights.',
  };
};

const getMockReviews = () => [
  { id: 1, author: 'Алексей М.', avatar: 'А', rating: 5, text: 'Потрясающее место! Виды невероятные.', date: '2 нед.', helpful: 12 },
  { id: 2, author: 'Мария К.', avatar: 'М', rating: 4, text: 'Красиво, но дорога сложная.', date: '1 мес.', helpful: 8 },
  { id: 3, author: 'Дмитрий С.', avatar: 'Д', rating: 5, text: 'Был зимой — северное сияние!', date: '2 мес.', helpful: 24 },
];

export const PlaceBottomSheet = ({ 
  place, 
  isFavorite, 
  onClose, 
  onToggleFavorite,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex,
  totalCount,
  userLists = [],
  onToggleInList,
  onCreateList,
  onDeleteList,
  isInList,
  isInAnyList,
}: PlaceBottomSheetProps) => {
  const { t, language } = useLanguage();
  const [showReviews, setShowReviews] = useState(false);
  const [showSaveDrawer, setShowSaveDrawer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const lastTap = useRef(0);

  if (!place) return null;

  const config = categoryConfig[place.category];
  const mockData = getMockPlaceData(place);
  const reviews = getMockReviews();
  const googleMapsReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;

  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setShowBigHeart(true);
      if (!isFavorite) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
        onToggleFavorite();
      }
      setTimeout(() => setShowBigHeart(false), 800);
    }
    lastTap.current = now;
  };

  const handleLike = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onToggleFavorite();
  };

  return (
    <>
      <Drawer open={!!place} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh] focus:outline-none">
          {/* Handle bar */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-2 mt-2" />
          
          {/* Navigation header */}
          <div className="flex items-center justify-between px-4 pb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {currentIndex !== undefined && totalCount !== undefined && (
              <span className="text-xs text-muted-foreground">
                {currentIndex + 1} / {totalCount}
              </span>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              disabled={!hasNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-4 pb-6">
              {/* Image with actions */}
              <div 
                className="relative h-40 rounded-xl overflow-hidden mb-3"
                onClick={handleImageTap}
              >
                <img 
                  src={mockData.imageUrl} 
                  alt={place.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Big heart animation */}
                {showBigHeart && (
                  <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 fill-red-500 text-red-500 animate-heart-pop pointer-events-none z-10" />
                )}
                
                {/* Bookmark button */}
                {onToggleInList && onCreateList && onDeleteList && isInList && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowSaveDrawer(true); }}
                    className="absolute top-2 right-16 flex items-center gap-1 px-2 py-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <Bookmark className={cn("h-4 w-4", isInAnyList?.(place.id) && "fill-primary text-primary")} />
                  </button>
                )}
                
                {/* Like button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLike(); }}
                  className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                >
                  <Heart className={cn(
                    "h-4 w-4 transition-all",
                    isFavorite ? "fill-red-500 text-red-500" : "",
                    isAnimating && "scale-125"
                  )} />
                </button>

                {/* Rating badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockData.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({mockData.reviewCount})</span>
                </div>
              </div>

              {/* Category badge + Title */}
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                  style={{ background: config.bgColor }}
                >
                  {config.icon}
                </span>
                <span 
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: config.bgColor, color: config.color }}
                >
                  {t(`categories.${place.category}`)}
                </span>
              </div>

              <h3 className="font-bold text-lg leading-tight mb-1">{place.name}</h3>
              {place.nameEn && language === 'ru' && (
                <p className="text-xs text-muted-foreground mb-3">{place.nameEn}</p>
              )}

              {/* AI Summary */}
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-semibold text-primary">✨ {t('place.aiSummary')}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === 'ru' ? mockData.summaryRu : mockData.summaryEn}
                </p>
              </div>

              {/* Collapsible Reviews */}
              <Collapsible open={showReviews} onOpenChange={setShowReviews}>
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors mb-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      📝 {t('actions.reviews')} ({reviews.length})
                    </span>
                    {showReviews ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 mb-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-muted/30 rounded-lg p-2.5">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-xs truncate">{review.author}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{review.text}</p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                              <ThumbsUp className="h-2.5 w-2.5" />
                              <span>{review.helpful}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a 
                    href={googleMapsReviewsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors mb-3"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {language === 'ru' ? 'Все отзывы в Google Maps' : 'All reviews on Google Maps'}
                  </a>
                </CollapsibleContent>
              </Collapsible>

              {/* Share button */}
              <div className="flex justify-center">
                <ShareButton place={place} onShare={() => {}} />
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Save to List Drawer */}
      {place && onToggleInList && onCreateList && onDeleteList && isInList && (
        <SaveToListDrawer
          open={showSaveDrawer}
          onOpenChange={setShowSaveDrawer}
          placeId={place.id}
          lists={userLists}
          onToggleInList={onToggleInList}
          onCreateList={onCreateList}
          onDeleteList={onDeleteList}
          isInList={isInList}
        />
      )}
    </>
  );
};
