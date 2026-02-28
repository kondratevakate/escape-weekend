import { hiddenGems } from '@/data/collections';
import { kolaPlaces } from '@/data/locations';
import { Place } from '@/data/kolaPlaces';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface HiddenGemsProps {
  onPlaceClick: (place: Place) => void;
}

export const HiddenGems = ({ onPlaceClick }: HiddenGemsProps) => {
  const { language } = useLanguage();

  const gems = hiddenGems.map(gem => ({
    ...gem,
    place: kolaPlaces.find(p => p.id === gem.placeId),
  })).filter(gem => gem.place);

  return (
    <div className="space-y-2 overflow-hidden">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
        <h3 className="text-xs font-semibold text-foreground truncate">
          {language === 'ru' ? 'Места, о которых вы не знали' : 'Hidden Gems'}
        </h3>
      </div>
      
      <div className="space-y-1.5">
        {gems.map((gem) => (
          <button
            key={gem.id}
            onClick={() => gem.place && onPlaceClick(gem.place)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-lg overflow-hidden",
              "bg-card border border-border hover:border-primary/50",
              "transition-all duration-200 hover:shadow-sm text-left p-1.5"
            )}
          >
            {/* Thumbnail */}
            <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
              <img
                src={gem.image}
                alt={gem.place?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5">
              <h4 className="font-medium text-xs text-foreground line-clamp-1">
                {gem.place?.name}
              </h4>
              <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
                {language === 'ru' ? gem.teaser : gem.teaserEn}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
