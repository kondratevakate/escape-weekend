import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-muted/60 backdrop-blur-sm rounded-full p-0.5 text-xs font-medium">
      <button
        onClick={() => setLanguage('ru')}
        className={cn(
          "px-2 py-1 rounded-full transition-all duration-200",
          language === 'ru'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        🇷🇺 RU
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-2 py-1 rounded-full transition-all duration-200",
          language === 'en'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};
