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
              ? 'Доступ только для владельцев гайда 🗺'
              : 'Access for guide owners only 🗺'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'ru'
              ? 'Получите доступ через нашего Telegram-бота'
              : 'Get access via our Telegram bot'}
          </p>
        </div>

        <Button asChild size="lg" className="w-full gap-2">
          <a href="https://t.me/dvushka_bot" target="_blank" rel="noopener noreferrer">
            <Send className="h-5 w-5" />
            {language === 'ru' ? 'Открыть в Telegram' : 'Open in Telegram'}
          </a>
        </Button>
      </div>
    </div>
  );
};
