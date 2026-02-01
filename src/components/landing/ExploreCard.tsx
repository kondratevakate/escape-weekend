import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExploreCardProps {
  onStart: () => void;
}

export const ExploreCard = ({ onStart }: ExploreCardProps) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&h=400&fit=crop)',
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      
      {/* Content */}
      <div className="relative p-4 min-h-[140px] md:min-h-[160px] flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="h-5 w-5 text-white" />
          <span className="text-white/90 text-sm font-medium">
            {language === 'ru' ? 'Режим открытий' : 'Discovery Mode'}
          </span>
        </div>
        
        <h3 className="text-white font-bold text-lg md:text-xl mb-1.5">
          {language === 'ru' ? 'Свайпай и открывай' : 'Swipe & Discover'}
        </h3>
        
        <p className="text-white/70 text-xs md:text-sm mb-3 line-clamp-2">
          {language === 'ru' 
            ? 'Листайте места как карточки. Понравилось — свайп вправо!' 
            : 'Browse places like cards. Like it? Swipe right!'}
        </p>
        
        <Button 
          onClick={onStart}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          {language === 'ru' ? 'Начать исследование' : 'Start Exploring'}
        </Button>
      </div>
    </div>
  );
};
