import { Compass, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExploreCardProps {
  onStart: () => void;
}

export const ExploreCard = ({ onStart }: ExploreCardProps) => {
  const { language } = useLanguage();

  return (
    <button
      onClick={onStart}
      className="relative w-full overflow-hidden rounded-lg text-left group border border-border bg-card hover:bg-muted/60 transition-colors"
    >
      <div className="relative p-2.5 min-h-[60px] flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Compass className="h-3 w-3 text-primary shrink-0" />
            <span className="font-semibold text-xs text-foreground truncate">
              {language === 'ru' ? 'Быстрый просмотр' : 'Quick scan'}
            </span>
          </div>
          <p className="text-muted-foreground text-[10px] line-clamp-1">
            {language === 'ru' ? 'Карточки одна за другой — пролистать все места за 2 минуты' : 'Cards one by one — flip through every place in 2 minutes'}
          </p>
        </div>

        <div className="shrink-0 h-6 w-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <ChevronRight className="h-3.5 w-3.5 text-foreground" />
        </div>
      </div>
    </button>
  );
};
