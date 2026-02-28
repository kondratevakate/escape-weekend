import { PlannedSeason, SEASON_LABELS } from '@/hooks/useStash';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SeasonPickerProps {
  onSelect: (season: PlannedSeason) => void;
  onCancel: () => void;
}

const SEASONS: PlannedSeason[] = ['this-winter', 'this-spring', 'this-summer', 'this-autumn', 'someday'];

export const SeasonPicker = ({ onSelect, onCancel }: SeasonPickerProps) => {
  const { language } = useLanguage();

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 space-y-2 w-56">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {language === 'ru' ? 'Когда планируете?' : 'When are you planning?'}
      </p>
      <div className="flex flex-col gap-1">
        {SEASONS.map(season => {
          const label = SEASON_LABELS[season];
          return (
            <button
              key={season}
              onClick={() => onSelect(season)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left",
                "hover:bg-muted transition-colors"
              )}
            >
              <span>{label.emoji}</span>
              <span>{language === 'ru' ? label.ru : label.en}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={onCancel}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        {language === 'ru' ? 'Отмена' : 'Cancel'}
      </button>
    </div>
  );
};
