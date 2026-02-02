import { memo } from 'react';
import { Send, Check, Bell, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';

const BOT_USERNAME = 'KolaGuideBot';

interface TelegramBridgeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'save' | 'plan' | 'ai';
  payload?: string; // e.g., place_teriberka, plan_abc123
}

const benefits = {
  ru: [
    { icon: Check, text: 'Сохранится навсегда' },
    { icon: Bell, text: 'Апдейты погоды и дорог' },
    { icon: MessageCircle, text: 'AI-помощник в диалоге' },
    { icon: Share2, text: 'Шеринг одним тапом' },
  ],
  en: [
    { icon: Check, text: 'Saved forever' },
    { icon: Bell, text: 'Weather & road updates' },
    { icon: MessageCircle, text: 'AI assistant in chat' },
    { icon: Share2, text: 'One-tap sharing' },
  ],
};

export const TelegramBridgeSheet = memo(({ 
  isOpen, 
  onClose, 
  trigger = 'save',
  payload 
}: TelegramBridgeSheetProps) => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  const titles = {
    save: isRu ? 'Не потеряй сохранённое!' : "Don't lose your saves!",
    plan: isRu ? 'Получай апдейты к плану' : 'Get plan updates',
    ai: isRu ? 'Продолжить в боте' : 'Continue in bot',
  };

  const descriptions = {
    save: isRu 
      ? 'Ты сохранил уже несколько мест. Подключи бота, чтобы они были всегда под рукой.' 
      : "You've saved several places. Connect the bot to keep them handy.",
    plan: isRu 
      ? 'Получай уведомления об изменении погоды и дорог для твоего маршрута.' 
      : 'Get notifications about weather and road changes for your route.',
    ai: isRu 
      ? 'Продолжи разговор с AI-помощником в Telegram.' 
      : 'Continue your conversation with AI assistant in Telegram.',
  };

  const deepLink = payload 
    ? `https://t.me/${BOT_USERNAME}?start=${payload}` 
    : `https://t.me/${BOT_USERNAME}`;

  const handleOpenBot = () => {
    window.open(deepLink, '_blank');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-[#0088cc]" />
            {titles[trigger]}
          </SheetTitle>
          <SheetDescription>
            {descriptions[trigger]}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-2">
          {benefits[language].map(({ icon: Icon, text }, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            {isRu ? 'Позже' : 'Later'}
          </Button>
          <Button 
            className="flex-1 bg-[#0088cc] hover:bg-[#0077b3]"
            onClick={handleOpenBot}
          >
            <Send className="h-4 w-4 mr-2" />
            {isRu ? 'Открыть бота' : 'Open bot'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
});

TelegramBridgeSheet.displayName = 'TelegramBridgeSheet';
