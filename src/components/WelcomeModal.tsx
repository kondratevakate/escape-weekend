import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Map, BookOpen, Search, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

// localStorage key kept stable across rebrands — renaming would re-trigger the modal
// for every existing user. See .lovable/plan.md for the data-preservation rationale.
const STORAGE_KEY = 'wowatlas_welcome_seen';

interface WelcomeModalProps {
  onExploreMap: () => void;
  onSwipeMode: () => void;
  onHighlightCollections: () => void;
  onOpenStash: () => void;
}

export const WelcomeModal = ({
  onExploreMap,
  onSwipeMode: _onSwipeMode,
  onHighlightCollections,
  onOpenStash,
}: WelcomeModalProps) => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

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
      icon: BookOpen,
      emoji: '📖',
      titleRu: 'Гиды по регионам',
      titleEn: 'Region guides',
      descRu: 'Мурманск — 1500₽, дальше Алтай и Архангельск',
      descEn: 'Murmansk — 1500₽, Altai & Arkhangelsk coming',
      onClick: () => handleAction(() => navigate('/articles')),
    },
    {
      icon: Map,
      emoji: '🗺',
      titleRu: 'Карта',
      titleEn: 'Map',
      descRu: '120+ мест с честными комментариями',
      descEn: '120+ places with honest field notes',
      onClick: () => handleAction(onExploreMap),
    },
    {
      icon: Search,
      emoji: '🔍',
      titleRu: 'Фильтры по теме',
      titleEn: 'Filter by topic',
      descRu: 'Сияние, киты, хайкинг, каяк, история',
      descEn: 'Aurora, whales, hiking, kayak, history',
      onClick: () => handleAction(onHighlightCollections),
    },
    {
      icon: Bookmark,
      emoji: '🔖',
      titleRu: 'Тайник',
      titleEn: 'Stash',
      descRu: 'Сохраняй места — с месяцем поездки',
      descEn: 'Save places with the month you plan to go',
      onClick: () => handleAction(onOpenStash),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="sm:max-w-md p-6 gap-5">
        <DialogTitle className="text-center text-lg font-bold">
          {language === 'ru' ? 'Что тут есть' : "What's here"}
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
