import { useStash, PlannedSeason, SEASON_LABELS } from '@/hooks/useStash';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocationById } from '@/data/locations';
import { categoryConfig } from '@/data/kolaPlaces';
import { kolaPlaces } from '@/data/locations';
import { X, Bookmark, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const SEASON_ORDER: PlannedSeason[] = ['this-winter', 'this-spring', 'this-summer', 'this-autumn', 'someday'];

const StashPage = () => {
  const { items, removeFromStash } = useStash();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const grouped = SEASON_ORDER.reduce((acc, season) => {
    const seasonItems = items.filter(item => item.planned_season === season);
    if (seasonItems.length > 0) acc[season] = seasonItems;
    return acc;
  }, {} as Record<PlannedSeason, typeof items>);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="h-14 px-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Bookmark className="h-5 w-5 text-primary" />
          <div>
            <h1 className="font-bold text-base">
              {language === 'ru' ? 'Ваш тайник' : 'Your Secret Stash'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {items.length} {language === 'ru' ? 'мест запланировано' : 'places planned'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {items.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-sm">
              {language === 'ru' ? 'Нажми 🔖 на любом месте чтобы сохранить' : 'Tap 🔖 on any place to save it'}
            </p>
          </div>
        )}

        {SEASON_ORDER.map(season => {
          const seasonItems = grouped[season];
          if (!seasonItems) return null;
          const label = SEASON_LABELS[season];
          
          return (
            <div key={season} className="space-y-2">
              <h2 className="text-sm font-semibold flex items-center gap-2 px-1">
                <span>{label.emoji}</span>
                <span>{language === 'ru' ? label.ru : label.en}</span>
                <span className="text-muted-foreground font-normal">({seasonItems.length})</span>
              </h2>
              <div className="space-y-2">
                {seasonItems.map(item => {
                  const location = getLocationById(item.id);
                  const place = kolaPlaces.find(p => p.id === item.id);
                  const config = place ? categoryConfig[place.category] : null;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      {/* Photo or icon */}
                      <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                        {location?.photo_url ? (
                          <img src={location.photo_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: config?.bgColor || 'hsl(var(--muted))' }}
                          >
                            <span className="text-xl">{config?.icon || '📍'}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full mt-1",
                            "bg-primary/10 text-primary"
                          )}
                        >
                          {label.emoji} {language === 'ru' ? label.ru : label.en}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromStash(item.id)}
                        className="shrink-0 p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default StashPage;
