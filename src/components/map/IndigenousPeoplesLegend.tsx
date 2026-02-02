import { useState, memo } from 'react';
import { Scroll, ChevronDown, ChevronUp } from 'lucide-react';
import { indigenousPeoples, IndigenousPeople } from '@/data/indigenousPeoplesLayer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Language } from '@/lib/i18n';

interface LegendItemProps {
  people: IndigenousPeople;
  language: Language;
  onClick: () => void;
}

// Memoized legend item to prevent re-renders
const LegendItem = memo(({ people, language, onClick }: LegendItemProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 w-full p-1.5 rounded 
               hover:bg-accent/50 transition-colors text-left group"
  >
    <span className="text-lg w-6 text-center" role="img" aria-label={people.name}>
      {people.emoji}
    </span>
    <div 
      className="w-3 h-3 rounded-full shrink-0 border border-background/50"
      style={{ backgroundColor: people.color }}
    />
    <span className="text-xs flex-1 truncate group-hover:text-primary transition-colors">
      {language === 'ru' ? people.name : people.nameEn}
    </span>
    <span className="text-[10px] text-muted-foreground tabular-nums">
      ~{people.population.toLocaleString()}
    </span>
  </button>
));

LegendItem.displayName = 'LegendItem';

// Utility to calculate territory centroid for flyTo
const getTerritoryCentroid = (territory: GeoJSON.Feature): [number, number] => {
  const geometry = territory.geometry as GeoJSON.Polygon;
  const coords = geometry.coordinates[0];
  const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
  const lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
  return [lat, lng];
};

interface IndigenousPeoplesLegendProps {
  isVisible: boolean;
  onPeopleClick?: (peopleId: string, center: [number, number]) => void;
}

export const IndigenousPeoplesLegend = memo(({ isVisible, onPeopleClick }: IndigenousPeoplesLegendProps) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-16 left-2 z-[1000] 
                    bg-background/95 backdrop-blur-sm 
                    rounded-lg shadow-lg border max-w-[220px]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between 
                                        w-full p-2.5 hover:bg-accent/30 rounded-t-lg transition-colors">
          <div className="flex items-center gap-2">
            <Scroll className="h-4 w-4 text-primary" />
            <span className="font-medium text-xs">
              {language === 'ru' ? 'Коренные народы' : 'Indigenous Peoples'}
            </span>
          </div>
          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-2 pb-2 space-y-0.5 max-h-[40vh] overflow-y-auto">
            {indigenousPeoples.map(people => (
              <LegendItem 
                key={people.id}
                people={people}
                language={language}
                onClick={() => onPeopleClick?.(people.id, getTerritoryCentroid(people.territory))}
              />
            ))}
          </div>
          
          <div className="border-t px-2.5 py-2">
            <a 
              href="https://atlaskmns.ru" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'ru' ? 'Источник: atlaskmns.ru' : 'Source: atlaskmns.ru'}
            </a>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

IndigenousPeoplesLegend.displayName = 'IndigenousPeoplesLegend';
