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
}

export function getCurrentMonthKey(): string {
  return MONTHS[new Date().getMonth()].key;
}

export const SeasonPills = ({ season, language = 'ru' }: SeasonPillsProps) => {
  const currentMonthKey = getCurrentMonthKey();

  return (
    <div className="flex gap-0.5">
      {MONTHS.map((m, i) => {
        const isActive = season.includes(m.key);
        const isCurrent = m.key === currentMonthKey;
        return (
          <div
            key={m.key}
            className={cn(
              "flex-1 text-center py-1 rounded text-[9px] font-medium leading-none transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "bg-muted/60 text-muted-foreground/50",
              isCurrent && "ring-1 ring-foreground/30"
            )}
            title={m.key}
          >
            {language === 'ru' ? m.ruShort : MONTHS_EN_SHORT[i]}
          </div>
        );
      })}
    </div>
  );
};
