import { useState } from 'react';
import { Safety } from '@/data/locations';
import { getCurrentMonthKey } from '@/components/SeasonPills';
import { cn } from '@/lib/utils';
import { ChevronDown, Skull } from 'lucide-react';

interface SafetySectionProps {
  safety: Safety;
  language: 'ru' | 'en';
}

export const SafetySection = ({ safety, language }: SafetySectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const currentMonth = getCurrentMonthKey();

  const incidents = safety.incidents ?? [];
  const goWith = safety.go_with ?? [];
  const essentials = safety.essentials ?? [];

  const activeIncidents = incidents.filter(i => i.risk_months.includes(currentMonth));
  const hasContent = incidents.length > 0 || goWith.length > 0 || essentials.length > 0;

  if (!hasContent) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-foreground">
          {activeIncidents.length > 0 ? '⚠️' : '✅'}{' '}
          {language === 'ru' ? 'Важно знать' : 'Safety'}
          <span className="text-muted-foreground font-normal ml-1.5">
            · {activeIncidents.length > 0
              ? `${activeIncidents.length} ${language === 'ru' ? (activeIncidents.length === 1 ? 'активный риск' : 'активных риска') : 'active risks'}`
              : (language === 'ru' ? 'рисков нет' : 'no risks')
            }
          </span>
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          expanded && "rotate-180"
        )} />
      </button>

      {expanded && (
        <div className="px-3 py-3 space-y-2.5 border-t border-border">
          {/* Incidents */}
          {incidents.map((incident, i) => (
            <IncidentCard
              key={i}
              incident={incident}
              isActive={incident.risk_months.includes(currentMonth)}
              language={language}
            />
          ))}

          {/* Go with */}
          {goWith.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                🧭 {language === 'ru' ? 'С кем ехать' : 'Go with'}
              </p>
              {goWith.map((g, i) => (
                <div key={i} className="pl-1">
                  <p className="text-xs font-semibold text-foreground">{g.name}</p>
                  <p className="text-[10px] text-muted-foreground">{g.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Essentials */}
          {essentials.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                🎒 {language === 'ru' ? 'Взять с собой' : 'Pack list'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {essentials.map((item, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function IncidentCard({
  incident,
  isActive,
  language,
}: {
  incident: { title: string; what_happened: string; lesson: string; risk_months: string[] };
  isActive: boolean;
  language: 'ru' | 'en';
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "rounded-lg overflow-hidden border",
      isActive ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/20"
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Skull className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {incident.title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {isActive && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">
              {language === 'ru' ? 'Сейчас' : 'Now'}
            </span>
          )}
          <ChevronDown className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )} />
        </div>
      </button>
      {open && (
        <div className="px-3 pb-2.5 space-y-1.5 border-t border-border/50 pt-2">
          <p className="text-[11px] text-foreground leading-relaxed">{incident.what_happened}</p>
          <p className="text-[11px] text-primary font-medium">
            {language === 'ru' ? 'Урок: ' : 'Lesson: '}{incident.lesson}
          </p>
        </div>
      )}
    </div>
  );
}
