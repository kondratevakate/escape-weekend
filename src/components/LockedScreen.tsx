import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LockedScreen = () => {
  const { language } = useLanguage();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="space-y-6 max-w-sm">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'ru'
              ? 'Это для покупателей гайда'
              : 'For guide buyers only'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'ru'
              ? 'Гид по Мурманску — 1500₽ в боте. После оплаты придёт ссылка с доступом.'
              : 'Murmansk guide — 1500₽ in the bot. After payment you get an access link.'}
          </p>
        </div>

        <Button asChild size="lg" className="w-full gap-2">
          <a href="https://t.me/twoushka_bot" target="_blank" rel="noopener noreferrer">
            <Send className="h-5 w-5" />
            {language === 'ru' ? 'Открыть в Telegram' : 'Open in Telegram'}
          </a>
        </Button>
      </div>
    </div>
  );
};
