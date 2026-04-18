import { useLanguage } from '@/contexts/LanguageContext';
import { Heart } from 'lucide-react';

export const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="hidden md:block bg-background border-t border-border py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌌</span>
          <span className="font-medium text-foreground">
            Escape Weekend
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            {language === 'ru'
              ? 'от Катюшка 2 Ушка'
              : 'by Katyushka 2 Ushka'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            {language === 'ru' ? 'Сделано с' : 'Made with'}
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />
            {language === 'ru' ? 'в Мурманске' : 'in Murmansk'}
          </span>
          <span className="text-muted-foreground/60">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
};