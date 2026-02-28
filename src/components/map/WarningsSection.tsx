import { useState } from 'react';
import { LocationWarnings } from '@/data/locations';
import { getCurrentMonthKey } from '@/components/SeasonPills';
import { cn } from '@/lib/utils';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface WarningsSectionProps {
  warnings: LocationWarnings;
  language: 'ru' | 'en';
}

export const WarningsSection = ({ warnings, language }: WarningsSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const currentMonth = getCurrentMonthKey();

  // Count active warnings for current month
  const activeWarnings: { type: string; node: React.ReactNode }[] = [];

  // 1. Permit — always show if required
  if (warnings.permit?.required) {
    activeWarnings.push({
      type: 'permit',
      node: (
        <div key="permit" className="space-y-1.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30">
            <span className="text-sm">⛔</span>
            <span className="text-xs font-semibold text-destructive">
              {language === 'ru' ? 'Нужен пропуск' : 'Permit required'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed px-1">{warnings.permit.description}</p>
          {warnings.permit.link && (
            <a
              href={warnings.permit.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-1"
            >
              {language === 'ru' ? 'Оформить' : 'Apply'}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      ),
    });
  }

  // 2. Road closure — if current month is in bad_months
  if (warnings.road?.seasonal_closure && warnings.road.bad_months.includes(currentMonth)) {
    activeWarnings.push({
      type: 'road',
      node: (
        <div key="road" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(25_95%_95%)] border border-[hsl(25_95%_80%)]">
          <span className="text-sm">⚠️</span>
          <div>
            <span className="text-xs font-semibold text-[hsl(25_80%_35%)]">
              {language === 'ru' ? 'Дорога сейчас закрыта' : 'Road currently closed'}
            </span>
            <p className="text-[10px] text-[hsl(25_60%_40%)] mt-0.5">{warnings.road.description}</p>
          </div>
        </div>
      ),
    });
  }

  // 3. Crowds — if current month is peak
  if (warnings.crowds?.peak_months.includes(currentMonth)) {
    activeWarnings.push({
      type: 'crowds',
      node: (
        <div key="crowds" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(45_93%_95%)] border border-[hsl(45_93%_80%)]">
          <span className="text-sm">📅</span>
          <div>
            <span className="text-xs font-semibold text-[hsl(45_70%_30%)]">
              {language === 'ru' ? 'Сейчас высокий сезон' : 'Peak season now'}
            </span>
            <p className="text-[10px] text-[hsl(45_50%_35%)] mt-0.5">{warnings.crowds.description}</p>
          </div>
        </div>
      ),
    });
  }

  // 4. Closures
  const hasClosures = warnings.closures && (warnings.closures.sanitary_days || warnings.closures.seasonal);
  if (hasClosures) {
    activeWarnings.push({
      type: 'closures',
      node: (
        <div key="closures" className="space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            📋 {language === 'ru' ? 'Режим работы' : 'Schedule'}
          </p>
          {warnings.closures!.sanitary_days && (
            <p className="text-xs text-foreground">{warnings.closures!.sanitary_days}</p>
          )}
          {warnings.closures!.seasonal && (
            <p className="text-xs text-foreground">{warnings.closures!.seasonal}</p>
          )}
        </div>
      ),
    });
  }

  // Non-time-based: road description when not closed, traveler issues
  // Road info (always show description if exists, even when not closed)
  if (warnings.road?.description && !warnings.road.bad_months.includes(currentMonth)) {
    // Show as info, not warning
  }

  // 5. Traveler issues — always show
  const hasTravelerIssues = warnings.traveler_issues && warnings.traveler_issues.length > 0;

  const totalCount = activeWarnings.length + (hasTravelerIssues ? 1 : 0);
  const hasAnyContent = totalCount > 0;

  if (!hasAnyContent) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header — tap to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-foreground">
          {activeWarnings.length > 0 ? '⚠️' : '✅'}{' '}
          {language === 'ru' ? 'Важно знать' : 'What to know'}
          <span className="text-muted-foreground font-normal ml-1.5">
            · {activeWarnings.length > 0
              ? `${activeWarnings.length} ${language === 'ru' ? (activeWarnings.length === 1 ? 'предупреждение' : 'предупреждения') : 'warnings'}`
              : (language === 'ru' ? 'всё чисто' : 'all clear')
            }
          </span>
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          expanded && "rotate-180"
        )} />
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-3 py-3 space-y-2.5 border-t border-border">
          {activeWarnings.map(w => w.node)}

          {hasTravelerIssues && (
            <div className="flex flex-wrap gap-1.5">
              {warnings.traveler_issues!.map((issue, i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {issue}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
