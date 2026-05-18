import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Footer — visible on every route, compact on mobile.
 *
 * Mobile: single thin line above the fold of the bottom nav (the wrapper's
 * `pb-14` clears MobileBottomNav). Desktop: two-column layout with attribution.
 *
 * Brand-voice: per BRAND.md §Don'ts "engagement farming", we don't use
 * decorative hearts. "Из Мурманска, лично." carries the same warmth without
 * the soft engagement signal.
 */
export const Footer = () => {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-2 px-3 md:py-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 md:gap-3 text-[11px] md:text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-base md:text-lg">🌌</span>
          <span className="font-medium text-foreground">Escape Weekend</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            {language === 'ru' ? 'от Катюшка 2 Ушка' : 'by Katyushka 2 Ushka'}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline">
            {language === 'ru' ? 'Из Мурманска, лично.' : 'From Murmansk, in person.'}
          </span>
          <span className="text-muted-foreground/60">© {year}</span>
        </div>
      </div>
    </footer>
  );
};
