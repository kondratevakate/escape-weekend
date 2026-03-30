import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { hasCapability } from '@/types/roles';
import { Send, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
}

export const PremiumGate = ({ children, feature }: PremiumGateProps) => {
  const { accessMode, role } = useUser();
  const { language } = useLanguage();
  const isRu = language === 'ru';

  const hasAccess =
    accessMode === 'telegram' ||
    accessMode === 'token' ||
    accessMode === 'dev' ||
    role === 'creator' ||
    role === 'admin';

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto gap-5">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          {isRu ? 'Премиум-функция' : 'Premium Feature'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {feature
            ? (isRu
              ? `${feature} — доступна владельцам гайда. Получите доступ через Telegram-бот.`
              : `${feature} is available to guide owners. Get access via our Telegram bot.`)
            : (isRu
              ? 'Эта функция доступна владельцам гайда. Получите доступ через Telegram-бот.'
              : 'This feature is available to guide owners. Get access via our Telegram bot.')}
        </p>
      </div>
      <Button asChild size="lg" className="w-full gap-2">
        <a href="https://t.me/dvushka_bot" target="_blank" rel="noopener noreferrer">
          <Send className="h-5 w-5" />
          {isRu ? 'Получить доступ' : 'Get access'}
        </a>
      </Button>
    </div>
  );
};

export const usePremiumAccess = () => {
  const { accessMode, role } = useUser();
  return (
    accessMode === 'telegram' ||
    accessMode === 'token' ||
    accessMode === 'dev' ||
    role === 'creator' ||
    role === 'admin'
  );
};
