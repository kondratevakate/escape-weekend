import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Map, Layers, Search, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'wowatlas_welcome_seen';

interface WelcomeModalProps {
  onExploreMap: () => void;
  onSwipeMode: () => void;
  onHighlightCollections: () => void;
  onOpenStash: () => void;
}

export const WelcomeModal = ({
  onExploreMap,
  onSwipeMode,
  onHighlightCollections,
  onOpenStash,
}: WelcomeModalProps) => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  const handleAction = (action: () => void) => {
    dismiss();
    action();
  };

  const actions = [
    {
      icon: Map,
      emoji: '🗺',
      titleRu: 'Исследуй карту',
      titleEn: 'Explore the map',
      descRu: 'Все места на интерактивной карте',
      descEn: 'All places on an interactive map',
      onClick: () => handleAction(onExploreMap),
    },
    {
      icon: Layers,
      emoji: '🃏',
      titleRu: 'Свайп-режим',
      titleEn: 'Swipe mode',
      descRu: 'Листай карточки как в Tinder',
      descEn: 'Swipe cards like Tinder',
      onClick: () => handleAction(onSwipeMode),
    },
    {
      icon: Search,
      emoji: '🔍',
      titleRu: 'Фильтруй по интересам',
      titleEn: 'Filter by interests',
      descRu: 'Коллекции: киты, сияние, хайкинг...',
      descEn: 'Collections: whales, aurora, hiking...',
      onClick: () => handleAction(onHighlightCollections),
    },
    {
      icon: Bookmark,
      emoji: '🗄',
      titleRu: 'Собери маршрут',
      titleEn: 'Build your route',
      descRu: 'Сохраняй места в свой тайник',
      descEn: 'Save places to your secret stash',
      onClick: () => handleAction(onOpenStash),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="sm:max-w-md p-6 gap-5">
        <DialogTitle className="text-center text-lg font-bold">
          {language === 'ru' ? 'Что тут можно сделать?' : 'What can you do here?'}
        </DialogTitle>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((a) => (
            <button
              key={a.emoji}
              onClick={a.onClick}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border border-border",
                "bg-card hover:bg-muted/60 hover:border-primary/40 transition-all",
                "active:scale-95 text-center"
              )}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-sm font-semibold text-foreground">
                {language === 'ru' ? a.titleRu : a.titleEn}
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                {language === 'ru' ? a.descRu : a.descEn}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={dismiss}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center pt-1"
        >
          {language === 'ru' ? 'Разберусь сам →' : "I'll figure it out →"}
        </button>
      </DialogContent>
    </Dialog>
  );
};
