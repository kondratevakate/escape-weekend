import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Check, AlertTriangle } from 'lucide-react';
import { TripDay } from '@/types/trip';
import { categoryConfig } from '@/data/kolaPlaces';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AITripResultProps {
  days: TripDay[];
  tips: string[];
  warnings: string[];
  /** Free-text narrative from the LLM agent (markdown). */
  aiText?: string;
  onAccept: () => void;
  onEdit: () => void;
}

export const AITripResult = memo(({
  days,
  tips,
  warnings,
  aiText,
  onAccept,
  onEdit,
}: AITripResultProps) => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          {isRu ? 'AI собрал маршрут' : 'AI built your route'}
        </h3>
      </div>

      {/* AI narrative (LLM prose) */}
      {aiText && (
        <div className="mb-4 prose prose-sm prose-neutral dark:prose-invert max-w-none bg-background/40 rounded-lg p-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiText}</ReactMarkdown>
        </div>
      )}

      {/* Days preview */}
      <div className="space-y-3 mb-4">
        {days.map((day) => (
          <div key={day.id} className="bg-background/50 rounded-lg p-3">
            <p className="text-sm font-medium mb-2">
              {isRu ? 'День' : 'Day'} {day.dayNumber}
            </p>
            <div className="flex flex-wrap gap-1">
              {day.places.map((place) => {
                const config = categoryConfig[place.category];
                return (
                  <span
                    key={place.id}
                    className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded"
                  >
                    {config.icon} {isRu ? place.name : (place.nameEn || place.name)}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {isRu ? 'Рекомендации:' : 'Tips:'}
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1">
                <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4">
          <ul className="text-xs space-y-1">
            {warnings.map((warning, i) => (
              <li key={i} className="flex items-start gap-1 text-destructive">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={onAccept} className="flex-1">
          {isRu ? 'Принять' : 'Accept'}
        </Button>
        <Button variant="outline" onClick={onEdit}>
          {isRu ? 'Редактировать' : 'Edit'}
        </Button>
      </div>
    </Card>
  );
});

AITripResult.displayName = 'AITripResult';
