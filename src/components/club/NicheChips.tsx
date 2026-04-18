import { Niche } from '@/data/niches';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';

interface NicheChipsProps {
  niches: Niche[];
  selectedIds?: string[];
  onToggle?: (id: string) => void;
  language: Language;
  size?: 'sm' | 'md';
}

export const NicheChips = ({ niches, selectedIds = [], onToggle, language, size = 'md' }: NicheChipsProps) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {niches.map(n => {
        const active = selectedIds.includes(n.id);
        const isInteractive = !!onToggle;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onToggle?.(n.id)}
            disabled={!isInteractive}
            className={cn(
              'rounded-full border transition-all',
              size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
              active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/50 text-foreground border-border hover:bg-muted',
              !isInteractive && 'cursor-default'
            )}
          >
            <span className="mr-1">{n.emoji}</span>
            {language === 'ru' ? n.ru : n.en}
          </button>
        );
      })}
    </div>
  );
};
