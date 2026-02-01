import { useState, useRef } from 'react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { X, MapPin, Star, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onClose: () => void;
  onOpenFullMap: () => void;
  onToggleFavorite: () => void;
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

const SWIPE_THRESHOLD = 80;

export const PlaceCard = ({ place, isFavorite, onClose, onOpenFullMap, onToggleFavorite }: PlaceCardProps) => {
  const { t, language } = useLanguage();
  const config = categoryConfig[place.category];
  const mockData = getMockPlaceData(place);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates[0]},${place.coordinates[1]}`;

  // Swipe state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

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
      {/* Swipe indicators */}
      <div 
        className="absolute inset-0 rounded-xl border-4 border-destructive pointer-events-none z-10"
        style={{ opacity: leftIndicatorOpacity }}
      />
      <div 
        className="absolute inset-0 rounded-xl border-4 border-accent pointer-events-none z-10"
        style={{ opacity: rightIndicatorOpacity }}
      />

      <div 
        className={cn(
          "bg-card rounded-xl shadow-2xl border overflow-hidden max-w-sm w-full touch-none select-none",
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
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img 
            src={mockData.imageUrl} 
            alt={place.name}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{mockData.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({mockData.reviewCount})</span>
          </div>
          {isFavorite && (
            <div className="absolute top-2 left-2 p-1.5 bg-accent/90 rounded-full">
              <Heart className="h-4 w-4 fill-current text-accent-foreground" />
            </div>
          )}
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
            <p className="text-xs text-muted-foreground mb-3">{place.nameEn}</p>
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

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            >
              <Heart className={cn("h-4 w-4 mr-1", isFavorite && "fill-current text-accent")} />
              {isFavorite ? '❤️' : t('actions.like')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onOpenFullMap(); }}
            >
              <MapPin className="h-4 w-4 mr-1" />
              {t('actions.reviews')}
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              asChild
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Maps
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="flex justify-center gap-6 mt-3">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleFavorite}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full transition-colors active:scale-95",
            isFavorite 
              ? "bg-accent text-accent-foreground"
              : "bg-accent/20 text-accent hover:bg-accent/30"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>
      </div>
    </div>
  );
};
