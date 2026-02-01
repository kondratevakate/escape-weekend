import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExploreCardProps {
  onStart: () => void;
}

export const ExploreCard = ({ onStart }: ExploreCardProps) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-lg">
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
      <div className="relative p-3 min-h-[100px] flex flex-col justify-end">
        <div className="flex items-center gap-1.5 mb-1">
          <Compass className="h-4 w-4 text-white" />
          <span className="text-white/90 text-xs font-medium">
            {language === 'ru' ? 'Режим открытий' : 'Discovery Mode'}
          </span>
        </div>
        
        <h3 className="text-white font-bold text-sm mb-1">
          {language === 'ru' ? 'Свайпай и открывай' : 'Swipe & Discover'}
        </h3>
        
        <p className="text-white/70 text-[11px] mb-2 line-clamp-1">
          {language === 'ru' 
            ? 'Листайте места как карточки' 
            : 'Browse places like cards'}
        </p>
        
        <Button 
          onClick={onStart}
          size="sm"
          className="w-full h-8 text-xs bg-white text-black hover:bg-white/90"
        >
          {language === 'ru' ? 'Начать' : 'Start'}
        </Button>
      </div>
    </div>
  );
};
