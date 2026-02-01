import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export const LanguageSwitcher = ({ variant = 'default' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
      >
        {language === 'ru' ? 'EN' : 'RU'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage('ru')}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all",
          language === 'ru'
            ? "bg-primary/10 ring-2 ring-primary/30"
            : "opacity-50 hover:opacity-100"
        )}
        aria-label="Русский"
      >
        🇷🇺
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all",
          language === 'en'
            ? "bg-primary/10 ring-2 ring-primary/30"
            : "opacity-50 hover:opacity-100"
        )}
        aria-label="English"
      >
        🇬🇧
      </button>
    </div>
  );
};
