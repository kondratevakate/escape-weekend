import { hiddenGems } from '@/data/collections';
import { kolaPlaces, Place } from '@/data/kolaPlaces';
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
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          {language === 'ru' ? 'Места, о которых вы не знали' : 'Hidden Gems'}
        </h3>
      </div>
      
      <div className="space-y-2">
        {gems.map((gem) => (
          <button
            key={gem.id}
            onClick={() => gem.place && onPlaceClick(gem.place)}
            className={cn(
              "w-full flex items-stretch gap-3 rounded-xl overflow-hidden",
              "bg-card border border-border hover:border-primary/50",
              "transition-all duration-200 hover:shadow-md text-left"
            )}
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={gem.image}
                alt={gem.place?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 py-2 pr-3 flex flex-col justify-center">
              <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                {gem.place?.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {language === 'ru' ? gem.teaser : gem.teaserEn}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
