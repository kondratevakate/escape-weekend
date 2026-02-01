import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
}

export const LanguageSwitcher = ({ variant = 'default' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  // Compact: just a small toggle
  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase font-medium">{language}</span>
      </button>
    );
  }

  // Default: minimal pill toggle
  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
        "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
        "backdrop-blur-sm border border-transparent hover:border-border/50"
      )}
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="uppercase">{language === 'ru' ? 'RU' : 'EN'}</span>
    </button>
  );
};
