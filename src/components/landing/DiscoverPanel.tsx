import { Place } from '@/data/kolaPlaces';
import { locations, Location } from '@/data/locations';
import { kolaPlaces } from '@/data/locations';
import { ExploreCard } from './ExploreCard';
import { ResourcesSection } from './ResourcesSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Sparkles, Sun } from 'lucide-react';
import { getCurrentMonthKey } from '@/components/SeasonPills';

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
}

export const DiscoverPanel = ({
  activeFilter,
  onFilterChange,
  onPlaceClick,
  onStartExplore,
  filteredCount,
}: DiscoverPanelProps) => {
  const { language } = useLanguage();

  const hiddenGemLocations = locations.filter(loc => loc.hidden_gem && locationMatchesFilter(loc, activeFilter));
  const permitLocations = locations.filter(loc => loc.permit_required && locationMatchesFilter(loc, activeFilter));

  const findPlace = (id: string) => kolaPlaces.find(p => p.id === id);

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-3 md:p-4 space-y-4 md:space-y-5 overflow-hidden">
        {/* "Сейчас хорошо ехать" banner */}
        {(() => {
          const currentMonth = getCurrentMonthKey();
          const inSeasonNow = locations
            .filter(loc => loc.season.includes(currentMonth) && locationMatchesFilter(loc, activeFilter));
          if (inSeasonNow.length === 0) return null;
          
          const monthLabel = language === 'ru' 
            ? ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][new Date().getMonth()]
            : new Date().toLocaleString('en', { month: 'long' });

          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/15 border border-accent/30">
                <Sun className="h-4 w-4 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {language === 'ru' ? 'Сейчас хорошо ехать' : 'Good to visit now'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {monthLabel} • {inSeasonNow.length} {language === 'ru' ? 'мест' : 'places'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
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
            </div>
          );
        })()}

        {/* Explore Mode Card */}
        <ExploreCard onStart={onStartExplore} />

        {/* 1. Коллекции — filter buttons */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground px-1">
            {language === 'ru' ? '📚 Коллекции' : '📚 Collections'}
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
          <p className="text-xs text-muted-foreground px-1">
            {filteredCount} {language === 'ru' ? 'мест' : 'places'}
          </p>
        </div>

        {/* 2. Скрытые места */}
        {hiddenGemLocations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <h3 className="text-sm font-semibold text-foreground">
                {language === 'ru' ? 'Скрытые места' : 'Hidden Gems'}
              </h3>
            </div>
            <div className="space-y-1.5">
              {hiddenGemLocations.map(loc => {
                const place = findPlace(loc.id);
                if (!place) return null;
                return (
                  <button
                    key={loc.id}
                    onClick={() => onPlaceClick(place)}
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-lg overflow-hidden",
                      "bg-card border border-border hover:border-primary/50",
                      "transition-all duration-200 hover:shadow-sm text-left p-2"
                    )}
                  >
                    {loc.photo_url ? (
                      <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden">
                        <img src={loc.photo_url} alt={loc.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 shrink-0 rounded-md bg-muted flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-foreground line-clamp-1">{loc.name}</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {loc.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Нужен пропуск */}
        {permitLocations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle className="h-3.5 w-3.5 text-[hsl(25_95%_53%)] shrink-0" />
              <h3 className="text-sm font-semibold text-foreground">
                {language === 'ru' ? 'Нужен пропуск' : 'Permit Required'}
              </h3>
            </div>
            <div className="space-y-1.5">
              {permitLocations.map(loc => {
                const place = findPlace(loc.id);
                if (!place) return null;
                return (
                  <button
                    key={loc.id}
                    onClick={() => onPlaceClick(place)}
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-lg overflow-hidden",
                      "bg-[hsl(25_95%_97%)] border border-[hsl(25_95%_85%)]",
                      "hover:border-[hsl(25_95%_70%)]",
                      "transition-all duration-200 hover:shadow-sm text-left p-2"
                    )}
                  >
                    <div className="w-10 h-10 shrink-0 rounded-md bg-[hsl(25_95%_92%)] flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-[hsl(25_95%_53%)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-foreground line-clamp-1">{loc.name}</h4>
                      <p className="text-[10px] text-[hsl(25_80%_40%)] line-clamp-1 mt-0.5">
                        {language === 'ru' ? '⚠️ Погранзона' : '⚠️ Border zone'}
                      </p>
                    </div>
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
