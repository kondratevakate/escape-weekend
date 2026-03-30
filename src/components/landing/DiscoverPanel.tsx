import { useState } from 'react';
import { Place } from '@/data/kolaPlaces';
import { locations, Location } from '@/data/locations';
import { kolaPlaces } from '@/data/locations';
import { ExploreCard } from './ExploreCard';
import { ResourcesSection } from './ResourcesSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Sparkles, Sun, ChevronDown } from 'lucide-react';
import { getCurrentMonthKey } from '@/components/SeasonPills';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export type TagFilter = 'all' | 'whales' | 'aurora' | 'hiking' | 'kayak' | 'history' | 'nature';

const TAG_FILTERS: { id: TagFilter; emoji: string; labelRu: string; labelEn: string; matchTags: string[] }[] = [
  { id: 'all', emoji: '', labelRu: 'Все', labelEn: 'All', matchTags: [] },
  { id: 'whales', emoji: '🐋', labelRu: 'Киты', labelEn: 'Whales', matchTags: ['whales'] },
  { id: 'aurora', emoji: '🌌', labelRu: 'Сияние', labelEn: 'Aurora', matchTags: ['aurora', 'winter'] },
  { id: 'hiking', emoji: '🥾', labelRu: 'Хайкинг', labelEn: 'Hiking', matchTags: ['hiking'] },
  { id: 'kayak', emoji: '🛶', labelRu: 'Каяк', labelEn: 'Kayak', matchTags: ['kayak'] },
  { id: 'history', emoji: '🏛', labelRu: 'История', labelEn: 'History', matchTags: ['history', 'museums'] },
  { id: 'nature', emoji: '🏔', labelRu: 'Природа', labelEn: 'Nature', matchTags: ['nature', 'reserves'] },
];

function locationMatchesFilter(loc: Location, filter: TagFilter): boolean {
  if (filter === 'all') return true;
  const def = TAG_FILTERS.find(f => f.id === filter);
  if (!def) return true;
  return loc.tags.some(tag => def.matchTags.includes(tag));
}

interface DiscoverPanelProps {
  activeFilter: TagFilter;
  onFilterChange: (filter: TagFilter) => void;
  onPlaceClick: (place: Place) => void;
  onStartExplore: () => void;
  filteredCount: number;
  highlightCollections?: boolean;
}

export const DiscoverPanel = ({
  activeFilter,
  onFilterChange,
  onPlaceClick,
  onStartExplore,
  filteredCount,
  highlightCollections,
}: DiscoverPanelProps) => {
  const { language } = useLanguage();
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [gemsOpen, setGemsOpen] = useState(false);

  const hiddenGemLocations = locations.filter(loc => loc.hidden_gem && locationMatchesFilter(loc, activeFilter));
  const permitLocations = locations.filter(loc => loc.permit_required && locationMatchesFilter(loc, activeFilter));

  const findPlace = (id: string) => kolaPlaces.find(p => p.id === id);

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-3 md:p-4 space-y-3 md:space-y-4 overflow-hidden">
        {/* "Сейчас хорошо ехать" — collapsible compact */}
        {(() => {
          const currentMonth = getCurrentMonthKey();
          const inSeasonNow = locations
            .filter(loc => loc.season.includes(currentMonth) && locationMatchesFilter(loc, activeFilter));
          if (inSeasonNow.length === 0) return null;
          
          const monthLabel = language === 'ru' 
            ? ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][new Date().getMonth()]
            : new Date().toLocaleString('en', { month: 'long' });

          return (
            <Collapsible open={seasonOpen} onOpenChange={setSeasonOpen}>
              <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                <Sun className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="text-xs font-medium text-foreground flex-1 text-left">
                  {language === 'ru' ? 'Сейчас хорошо ехать' : 'Good to visit now'}
                </span>
                <span className="text-[10px] text-muted-foreground">{inSeasonNow.length}</span>
                <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", seasonOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1 pt-1.5 px-1">
                  {inSeasonNow.slice(0, 8).map(loc => {
                    const place = findPlace(loc.id);
                    if (!place) return null;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => onPlaceClick(place)}
                        className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors truncate max-w-[140px]"
                      >
                        {loc.name}
                      </button>
                    );
                  })}
                  {inSeasonNow.length > 8 && (
                    <span className="text-[10px] px-2 py-1 text-muted-foreground">
                      +{inSeasonNow.length - 8}
                    </span>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })()}

        {/* Explore Mode Card */}
        <ExploreCard onStart={onStartExplore} />

        {/* Collections — always visible filter pills */}
        <div className={cn(
          "space-y-2 transition-all duration-500",
          highlightCollections && "ring-2 ring-primary/50 rounded-lg p-2 bg-primary/5"
        )}>
          <h3 className="text-xs font-medium text-muted-foreground px-1 uppercase tracking-wide">
            {language === 'ru' ? 'Коллекции' : 'Collections'}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {TAG_FILTERS.map(f => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onFilterChange(f.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                    "border active:scale-95",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted"
                  )}
                >
                  {f.emoji && <span className="mr-1">{f.emoji}</span>}
                  {language === 'ru' ? f.labelRu : f.labelEn}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground px-1">
            {filteredCount} {language === 'ru' ? 'мест' : 'places'}
          </p>
        </div>

        {/* Hidden Gems — collapsible, compact list */}
        {hiddenGemLocations.length > 0 && (
          <Collapsible open={gemsOpen} onOpenChange={setGemsOpen}>
            <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground flex-1 text-left">
                {language === 'ru' ? 'Скрытые места' : 'Hidden Gems'}
              </span>
              <span className="text-[10px] text-muted-foreground">{hiddenGemLocations.length}</span>
              <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", gemsOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-0.5 pt-1.5">
                {hiddenGemLocations.map(loc => {
                  const place = findPlace(loc.id);
                  if (!place) return null;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => onPlaceClick(place)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span className="text-xs text-foreground line-clamp-1 flex-1">{loc.name}</span>
                    </button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Permit Required — compact */}
        {permitLocations.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1">
              <AlertTriangle className="h-3 w-3 text-[hsl(25_95%_53%)] shrink-0" />
              <span className="text-xs font-medium text-foreground">
                {language === 'ru' ? 'Нужен пропуск' : 'Permit Required'}
              </span>
              <span className="text-[10px] text-muted-foreground">{permitLocations.length}</span>
            </div>
            <div className="space-y-0.5">
              {permitLocations.map(loc => {
                const place = findPlace(loc.id);
                if (!place) return null;
                return (
                  <button
                    key={loc.id}
                    onClick={() => onPlaceClick(place)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(25_95%_53%)]/60 shrink-0" />
                    <span className="text-xs text-foreground line-clamp-1 flex-1">{loc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Resources */}
        <ResourcesSection />
      </div>
    </ScrollArea>
  );
};

export { TAG_FILTERS, locationMatchesFilter };
