import { LabIdea } from '@/types/labs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLabsVotes } from '@/hooks/useLabsVotes';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { openSupportFeature } from '@/lib/telegram';
import { ThumbsUp, Heart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LabIdeaCardProps {
  idea: LabIdea;
}

const formatRub = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

export const LabIdeaCard = ({ idea }: LabIdeaCardProps) => {
  const { language } = useLanguage();
  const { hasVoted, hasPledged, toggleVote, markPledged } = useLabsVotes();

  const voted = hasVoted(idea.id);
  const pledged = hasPledged(idea.id);

  const totalVotes = idea.baseVotes + (voted ? 1 : 0);
  const totalPledged = idea.basePledged + (pledged ? idea.supportAmount : 0);
  const progress = Math.min(100, Math.round((totalPledged / idea.goal) * 100));

  const title = language === 'ru' ? idea.title.ru : idea.title.en;
  const description = language === 'ru' ? idea.description.ru : idea.description.en;

  const categoryLabel: Record<typeof idea.category, { ru: string; en: string }> = {
    ai: { ru: 'AI', en: 'AI' },
    content: { ru: 'Контент', en: 'Content' },
    service: { ru: 'Сервис', en: 'Service' },
  };

  const handleSupport = () => {
    markPledged(idea.id);
    openSupportFeature(idea.id, idea.supportAmount, title);
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-4 md:p-5 flex flex-col gap-4 transition-shadow hover:shadow-md">
      <header className="flex items-start gap-3">
        <span className="text-3xl leading-none shrink-0" aria-hidden>
          {idea.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5">
              {categoryLabel[idea.category][language === 'ru' ? 'ru' : 'en']}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      <div className="space-y-1.5">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {formatRub(totalPledged)}
          </span>
          <span>
            {language === 'ru' ? 'из' : 'of'} {formatRub(idea.goal)} · {progress}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={voted ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleVote(idea.id)}
          className={cn('flex-1 gap-1.5', voted && 'bg-primary')}
          aria-pressed={voted}
        >
          {voted ? <Check className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
          <span>
            {voted
              ? (language === 'ru' ? 'Голос учтён' : 'Voted')
              : (language === 'ru' ? 'Голосовать' : 'Vote')}
          </span>
          <span className="text-xs opacity-80 ml-1">· {totalVotes}</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSupport}
          className="flex-1 gap-1.5"
        >
          <Heart className={cn('h-4 w-4', pledged && 'fill-current')} />
          {pledged
            ? (language === 'ru' ? 'Обещано' : 'Pledged')
            : `${language === 'ru' ? 'Поддержать' : 'Support'} ${idea.supportAmount} ₽`}
        </Button>
      </div>

      {pledged && (
        <p className="text-[11px] text-muted-foreground -mt-1">
          {language === 'ru'
            ? 'Спасибо! Согласие отправлено в Telegram — детали перевода вручную.'
            : 'Thanks! We received your pledge in Telegram — transfer is handled manually.'}
        </p>
      )}
    </article>
  );
};
