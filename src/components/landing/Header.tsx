import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌌</span>
          <span className="font-semibold text-foreground">{t('landing.brand')}</span>
        </div>
        
        <nav className="flex items-center gap-6">
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};
