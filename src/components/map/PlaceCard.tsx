import { useState, useRef } from 'react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { X, Star, Heart, ChevronUp, ChevronDown, ExternalLink, Clock, ThumbsUp, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { usePlaceStats, formatCount } from '@/hooks/usePlaceStats';
import { ShareButton } from './ShareButton';
import { SaveToListDrawer } from './SaveToListDrawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserList } from '@/hooks/useUserLists';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  // User lists props
  userLists?: UserList[];
  onToggleInList?: (listId: string, placeId: string) => void;
  onCreateList?: (name: string, emoji: string) => string;
  onDeleteList?: (id: string) => void;
  isInList?: (listId: string, placeId: string) => boolean;
  isInAnyList?: (placeId: string) => boolean;
}

// Mock data - in real implementation this would come from Google Places API
const getMockPlaceData = (place: Place) => {
  const mockImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  ];
  
  // Deterministic based on place id
  const index = place.id.charCodeAt(0) % mockImages.length;

  const mockSummaryRu = `Посетители отмечают невероятные виды и атмосферу дикой природы. Лучшее время — закат или полярная ночь для северного сияния. Рекомендуют брать тёплую одежду и запас еды.`;
  const mockSummaryEn = `Visitors praise the incredible views and wild nature atmosphere. Best time to visit is sunset or polar night for Northern Lights. Warm clothes and food supplies recommended.`;

  return {
    imageUrl: mockImages[index],
    rating: 4.5 + (place.id.charCodeAt(0) % 5) * 0.1,
    reviewCount: 50 + (place.id.charCodeAt(1) % 150),
    summaryRu: mockSummaryRu,
    summaryEn: mockSummaryEn,
  };
};

// Mock reviews data
const getMockReviews = () => [
  { 
    id: 1,
    author: 'Алексей Морозов', 
    avatar: 'А',
    rating: 5, 
    text: 'Потрясающее место! Виды невероятные, особенно на закате.', 
    date: '2 недели назад',
    helpful: 12
  },
  { 
    id: 2,
    author: 'Мария Ковалёва', 
    avatar: 'М',
    rating: 4, 
    text: 'Красиво, но дорога сложная. Берите внедорожник.', 
    date: '1 месяц назад',
    helpful: 8
  },
  { 
    id: 3,
    author: 'Дмитрий Соколов', 
    avatar: 'Д',
    rating: 5, 
    text: 'Был зимой — северное сияние видно отлично!', 
    date: '2 месяца назад',
    helpful: 24
  },
];

const SWIPE_THRESHOLD = 80;

export const PlaceCard = ({ 
  place, 
  isFavorite, 
  onClose, 
  onToggleFavorite,
  userLists = [],
  onToggleInList,
  onCreateList,
  onDeleteList,
  isInList,
  isInAnyList,
}: PlaceCardProps) => {
  const { t, language } = useLanguage();
  const config = categoryConfig[place.category];
  const mockData = getMockPlaceData(place);
  const { stats, recordShare } = usePlaceStats(place.id);
  const reviews = getMockReviews();

  // Reviews toggle state
  const [showReviews, setShowReviews] = useState(false);
  
  // Save to list drawer state
  const [showSaveDrawer, setShowSaveDrawer] = useState(false);
  
  // Like animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Double-tap state
  const [showBigHeart, setShowBigHeart] = useState(false);
  const lastTap = useRef(0);
  const DOUBLE_TAP_DELAY = 300;

  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
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

  // Swipe state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const googleMapsReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = (clientY - startPos.current.y) * 0.2;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offset.x > SWIPE_THRESHOLD) {
      // Swipe right - add to favorites
      if (!isFavorite) onToggleFavorite();
      setOffset({ x: 0, y: 0 });
    } else if (offset.x < -SWIPE_THRESHOLD) {
      // Swipe left - close
      onClose();
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation = offset.x * 0.05;
  const leftIndicatorOpacity = Math.min(1, Math.abs(Math.min(0, offset.x)) / SWIPE_THRESHOLD);
  const rightIndicatorOpacity = Math.min(1, Math.max(0, offset.x) / SWIPE_THRESHOLD);

  return (
    <div className="relative">
      <div
        className={cn(
          "bg-card rounded-xl shadow-2xl border overflow-hidden w-[340px] md:w-[380px] touch-none select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          transform: `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'all 0.3s ease-out',
        }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {/* Image with double-tap */}
        <div 
          className="relative h-40 overflow-hidden"
          onClick={handleImageTap}
        >
          <img 
            src={mockData.imageUrl} 
            alt={place.name}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          {/* Big heart animation on double-tap */}
          {showBigHeart && (
            <Heart 
              className="absolute top-1/2 left-1/2 h-16 w-16 fill-red-500 text-red-500 animate-heart-pop pointer-events-none z-10" 
            />
          )}
          {/* Bookmark button */}
          {onToggleInList && onCreateList && onDeleteList && isInList && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowSaveDrawer(true);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute top-2 right-24 flex items-center gap-1 px-2 py-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
            >
              <Bookmark className={cn(
                "h-4 w-4 transition-colors", 
                isInAnyList?.(place.id) ? "fill-primary text-primary" : ""
              )} />
            </button>
          )}
          {/* Like button on photo */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 400);
              onToggleFavorite(); 
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute top-2 right-12 flex items-center gap-1 px-2 py-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
          >
            <Heart className={cn(
              "h-4 w-4 transition-colors", 
              isFavorite ? "fill-red-500 text-red-500" : "",
              isAnimating && "animate-heart-bounce"
            )} />
            <span className="text-xs font-medium">{formatCount(stats.likesCount + (isFavorite ? 1 : 0))}</span>
          </button>
          {/* Close button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Rating badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{mockData.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({mockData.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-lg"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: config.bgColor,
              }}
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

          {/* Title */}
          <h3 className="font-bold text-lg leading-tight mb-1">{place.name}</h3>
          {place.nameEn && language === 'ru' && (
            <p className="text-xs text-muted-foreground mb-2">{place.nameEn}</p>
          )}


          {/* AI Summary */}
          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-primary">✨ {t('place.aiSummary')}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === 'ru' ? mockData.summaryRu : mockData.summaryEn}
            </p>
          </div>

          {/* Collapsible Reviews Section */}
          <Collapsible open={showReviews} onOpenChange={setShowReviews}>
            <CollapsibleTrigger asChild>
              <button 
                className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors mb-3"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  📝 {t('actions.reviews')} ({reviews.length})
                </span>
                {showReviews ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <ScrollArea className="max-h-48 mb-3">
                <div className="space-y-3 pr-2">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-xs truncate">{review.author}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
                              <Clock className="h-2.5 w-2.5" />
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {review.text}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
                            <ThumbsUp className="h-2.5 w-2.5" />
                            <span>{review.helpful}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <a 
                href={googleMapsReviewsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors mb-3"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                {language === 'ru' ? 'Все отзывы в Google Maps' : 'All reviews on Google Maps'}
              </a>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions - only Share */}
          <div className="flex justify-center">
            <ShareButton place={place} onShare={recordShare} />
          </div>
        </div>
      </div>

      {/* Save to List Drawer */}
      {onToggleInList && onCreateList && onDeleteList && isInList && (
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
    </div>
  );
};
