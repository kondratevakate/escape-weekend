import { useState, useRef, ReactNode } from 'react';
import { Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  showButtons?: boolean;
  className?: string;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_FACTOR = 0.1;

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  showButtons = true,
  className,
}: SwipeableCardProps) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState<'left' | 'right' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = (clientY - startPos.current.y) * 0.3; // Reduced vertical movement
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (offset.x > SWIPE_THRESHOLD) {
      exitRight();
    } else if (offset.x < -SWIPE_THRESHOLD) {
      exitLeft();
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const exitLeft = () => {
    setIsExiting('left');
    setOffset({ x: -500, y: 0 });
    setTimeout(() => {
      onSwipeLeft?.();
      resetCard();
    }, 300);
  };

  const exitRight = () => {
    setIsExiting('right');
    setOffset({ x: 500, y: 0 });
    setTimeout(() => {
      onSwipeRight?.();
      resetCard();
    }, 300);
  };

  const resetCard = () => {
    setIsExiting(null);
    setOffset({ x: 0, y: 0 });
  };

  const rotation = offset.x * ROTATION_FACTOR;
  const opacity = Math.max(0, 1 - Math.abs(offset.x) / 500);

  // Swipe indicator colors
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

      {/* Card */}
      <div
        className={cn(
          "touch-none select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          isExiting && "pointer-events-none",
          className
        )}
        style={{
          transform: `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${rotation}deg)`,
          opacity,
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
        {children}
      </div>

      {/* Action buttons */}
      {showButtons && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={exitLeft}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-95"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={exitRight}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors active:scale-95"
          >
            <Heart className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};
