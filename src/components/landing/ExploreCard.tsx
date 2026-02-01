import { Compass, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExploreCardProps {
  onStart: () => void;
}

export const ExploreCard = ({ onStart }: ExploreCardProps) => {
  const { language } = useLanguage();

  return (
    <button
      onClick={onStart}
      className="relative w-full overflow-hidden rounded-lg text-left group"
    >
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&h=400&fit=crop)',
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      
      {/* Content */}
      <div className="relative p-3 min-h-[80px] flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Compass className="h-3.5 w-3.5 text-white shrink-0" />
            <span className="text-white font-semibold text-sm truncate">
              {language === 'ru' ? 'Свайпай и открывай' : 'Swipe & Discover'}
            </span>
          </div>
          <p className="text-white/70 text-[11px] line-clamp-1">
            {language === 'ru' ? 'Листайте места как карточки' : 'Browse places like cards'}
          </p>
        </div>
        
        <div className="shrink-0 h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <ChevronRight className="h-4 w-4 text-white" />
        </div>
      </div>
    </button>
  );
};
