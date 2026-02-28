import { useState } from 'react';
import { OnlyHere } from '@/data/locations';
import { getCurrentMonthKey } from '@/components/SeasonPills';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface OnlyHereSectionProps {
  onlyHere: OnlyHere;
  language: 'ru' | 'en';
}

export const OnlyHereSection = ({ onlyHere, language }: OnlyHereSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const currentMonth = getCurrentMonthKey();

  const food = onlyHere.food ?? [];
  const experience = (onlyHere.experience ?? []).filter(e => e.months.includes(currentMonth));
  const buy = onlyHere.buy ?? [];
  const totalItems = food.length + experience.length + buy.length;

  if (totalItems === 0) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-foreground">
          🍽 {language === 'ru' ? 'Только здесь' : 'Only here'}
          <span className="text-muted-foreground font-normal ml-1.5">· {totalItems}</span>
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          expanded && "rotate-180"
        )} />
      </button>

      {expanded && (
        <div className="px-3 py-3 space-y-3 border-t border-border">
          {food.length > 0 && (
            <Subsection
              title={language === 'ru' ? 'Попробовать' : 'Try'}
              emoji="🍴"
              items={food}
            />
          )}
          {experience.length > 0 && (
            <Subsection
              title={language === 'ru' ? 'Пережить' : 'Experience'}
              emoji="✨"
              items={experience}
            />
          )}
          {buy.length > 0 && (
            <Subsection
              title={language === 'ru' ? 'Увезти' : 'Take home'}
              emoji="🎁"
              items={buy}
            />
          )}
        </div>
      )}
    </div>
  );
};

function Subsection({ title, emoji, items }: { title: string; emoji: string; items: { name: string; where: string; description: string }[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        {emoji} {title}
      </p>
      {items.map((item, i) => (
        <div key={i} className="pl-1">
          <p className="text-xs">
            <span className="font-semibold text-foreground">{item.name}</span>
            {item.where && (
              <span className="text-muted-foreground ml-1">— {item.where}</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
