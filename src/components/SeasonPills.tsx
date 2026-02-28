import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const MONTHS = [
  { key: 'january', ruShort: 'Янв' },
  { key: 'february', ruShort: 'Фев' },
  { key: 'march', ruShort: 'Мар' },
  { key: 'april', ruShort: 'Апр' },
  { key: 'may', ruShort: 'Май' },
  { key: 'june', ruShort: 'Июн' },
  { key: 'july', ruShort: 'Июл' },
  { key: 'august', ruShort: 'Авг' },
  { key: 'september', ruShort: 'Сен' },
  { key: 'october', ruShort: 'Окт' },
  { key: 'november', ruShort: 'Ноя' },
  { key: 'december', ruShort: 'Дек' },
];

const MONTHS_EN_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface SeasonPillsProps {
  season: string[];
  language?: 'ru' | 'en';
  reasons?: Record<string, string>;
  avoid?: Record<string, string>;
}

export function getCurrentMonthKey(): string {
  return MONTHS[new Date().getMonth()].key;
}

export const SeasonPills = ({ season, language = 'ru', reasons, avoid }: SeasonPillsProps) => {
  const currentMonthKey = getCurrentMonthKey();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside click
  useEffect(() => {
    if (!activeTooltip) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeTooltip]);

  const handlePillClick = (monthKey: string) => {
    const isActive = season.includes(monthKey);
    const hasReason = reasons?.[monthKey];
    const hasAvoid = avoid?.[monthKey];

    if (isActive && hasReason) {
      setActiveTooltip(activeTooltip === monthKey ? null : monthKey);
    } else if (!isActive && hasAvoid) {
      setActiveTooltip(activeTooltip === monthKey ? null : monthKey);
    } else {
      setActiveTooltip(null);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex gap-0.5">
        {MONTHS.map((m, i) => {
          const isActive = season.includes(m.key);
          const isCurrent = m.key === currentMonthKey;
          const hasTooltip = (isActive && reasons?.[m.key]) || (!isActive && avoid?.[m.key]);
          
          return (
            <div key={m.key} className="relative flex-1">
              <div
                onClick={() => handlePillClick(m.key)}
                className={cn(
                  "text-center py-1 rounded text-[9px] font-medium leading-none transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/60 text-muted-foreground/50",
                  isCurrent && "ring-1 ring-foreground/30",
                  hasTooltip && "cursor-pointer hover:opacity-80"
                )}
                title={!hasTooltip ? m.key : undefined}
              >
                {language === 'ru' ? m.ruShort : MONTHS_EN_SHORT[i]}
              </div>

              {/* Tooltip */}
              {activeTooltip === m.key && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50">
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-2.5 text-xs leading-relaxed max-w-[220px] w-max">
                    {isActive && reasons?.[m.key] && (
                      <p className="text-foreground">{reasons[m.key]}</p>
                    )}
                    {!isActive && avoid?.[m.key] && (
                      <p className="text-muted-foreground">{avoid[m.key]}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
