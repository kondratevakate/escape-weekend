import { useState, useRef } from 'react';
import { Place, categoryConfig } from '@/data/kolaPlaces';
import { getLocationById } from '@/data/locations';
import { X, Bookmark, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ShareButton } from './ShareButton';
import { SaveToListDrawer } from './SaveToListDrawer';
import { UserList } from '@/hooks/useUserLists';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  userLists?: UserList[];
  onToggleInList?: (listId: string, placeId: string) => void;
  onCreateList?: (name: string, emoji: string) => string;
  onDeleteList?: (id: string) => void;
  isInList?: (listId: string, placeId: string) => boolean;
  isInAnyList?: (placeId: string) => boolean;
}

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
  const location = getLocationById(place.id);
  
  const [showSaveDrawer, setShowSaveDrawer] = useState(false);

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
      if (!isFavorite) onToggleFavorite();
      setOffset({ x: 0, y: 0 });
    } else if (offset.x < -SWIPE_THRESHOLD) {
      onClose();
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation = offset.x * 0.05;

  return (
    <div className="relative">
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
        {/* Photo or placeholder */}
        <div className="relative h-40 overflow-hidden">
          {location?.photo_url ? (
            <img 
              src={location.photo_url} 
              alt={place.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: config.bgColor }}
            >
              <span className="text-5xl">{config.icon}</span>
            </div>
          )}
          {/* Bookmark button */}
          {onToggleInList && onCreateList && onDeleteList && isInList && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSaveDrawer(true); }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute top-2 right-12 flex items-center gap-1 px-2 py-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
            >
              <Bookmark className={cn(
                "h-4 w-4 transition-colors", 
                isInAnyList?.(place.id) ? "fill-primary text-primary" : ""
              )} />
            </button>
          )}
          {/* Close button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
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
            {location?.permit_required && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                ⚠️ {language === 'ru' ? 'Нужен пропуск' : 'Permit required'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg leading-tight mb-1">{place.name}</h3>
          {place.nameEn && language === 'ru' && (
            <p className="text-xs text-muted-foreground mb-2">{place.nameEn}</p>
          )}

          {/* Description */}
          {place.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {place.description}
            </p>
          )}

          {/* Tags */}
          {location && location.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {location.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Season */}
          {location && location.season.length > 0 && location.season.length < 12 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <span>📅</span>
              <span>{location.season.join(', ')}</span>
            </div>
          )}

          {/* Actions - only Share */}
          <div className="flex justify-center">
            <ShareButton place={place} onShare={() => {}} />
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
