import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'globe';
}

export const LanguageSwitcher = ({ variant = 'default' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  // Minimal text toggle
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

  // Globe icon with dropdown (Airbnb style)
  if (variant === 'globe') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-muted"
          >
            <Globe className="h-5 w-5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1" align="end">
          <button
            onClick={() => setLanguage('ru')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              language === 'ru' 
                ? "bg-muted font-medium" 
                : "hover:bg-muted/50"
            )}
          >
            <span>🇷🇺</span>
            <span>Русский</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              language === 'en' 
                ? "bg-muted font-medium" 
                : "hover:bg-muted/50"
            )}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </PopoverContent>
      </Popover>
    );
  }

  // Default: Flag buttons
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
