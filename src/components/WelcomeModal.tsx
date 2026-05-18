import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { getCredits } from '@/lib/credits';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Map, BookOpen, Search, Bookmark, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Two independent dismissal flags so a user who first visited as a guest
// (and dismissed) still gets the buyer welcome on their first visit-as-buyer.
// localStorage prefix kept on `wowatlas_*` for data-preservation across the
// rebrand — see .lovable/plan.md.
const GUEST_STORAGE_KEY = 'wowatlas_welcome_seen';
const BUYER_STORAGE_KEY = 'wowatlas_buyer_welcome_seen';

// Region slug → human-readable case-marked label. Extend when new articles
// go live so the buyer welcome can name the region naturally.
const REGION_LABELS_RU: Record<string, string> = {
  murmansk: 'Мурманску',
  altai: 'Алтаю',
  arkhangelsk: 'Архангельску',
  norway: 'Норвегии',
  japan: 'Японии',
};
const REGION_LABELS_EN: Record<string, string> = {
  murmansk: 'Murmansk',
  altai: 'Altai',
  arkhangelsk: 'Arkhangelsk',
  norway: 'Norway',
  japan: 'Japan',
};

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
  const { accessMode, accessToken, buyer, role } = useUser();
  const isRu = language === 'ru';

  const hasAccess =
    accessMode === 'telegram' ||
    accessMode === 'token' ||
    accessMode === 'dev' ||
    role === 'creator' ||
    role === 'admin';

  const storageKey = hasAccess ? BUYER_STORAGE_KEY : GUEST_STORAGE_KEY;

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) setOpen(true);
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setOpen(false);
  };

  const handleAction = (action: () => void) => {
    dismiss();
    action();
  };

  // ─── Buyer welcome-back variant ─────────────────────────────────────────
  if (hasAccess) {
    // Resolve personalization. All fields are optional — fall back gracefully
    // for telegram-WebApp users, dev mode, and creators/admins without a buyer
    // token (these go through hasAccess but lack the buyer JSON).
    const regions = buyer?.regions ?? [];
    const singleRegion = regions.length === 1 && regions[0] !== 'all' ? regions[0] : null;
    const articleHref = singleRegion ? `/articles/${singleRegion}` : '/articles';

    const regionGreeting = (() => {
      if (regions.includes('all')) {
        return isRu ? 'все купленные гайды' : 'all your guides';
      }
      if (singleRegion) {
        const label = isRu ? REGION_LABELS_RU[singleRegion] : REGION_LABELS_EN[singleRegion];
        if (!label) return null;
        return isRu ? `гид по ${label}` : `${label} guide`;
      }
      if (regions.length > 1) return isRu ? 'твои гайды' : 'your guides';
      return null;
    })();

    const greetingName = (() => {
      const name = buyer?.username;
      if (!name) return null;
      return name.startsWith('@') ? name : `@${name}`;
    })();

    const credits = accessToken ? getCredits(accessToken) : null;

    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
        <DialogContent className="sm:max-w-md p-6 gap-4">
          <DialogTitle className="text-center text-lg font-bold">
            {greetingName
              ? (isRu ? `С возвращением, ${greetingName}` : `Welcome back, ${greetingName}`)
              : (isRu ? 'С возвращением' : 'Welcome back')}
          </DialogTitle>

          {regionGreeting && (
            <p className="text-center text-sm text-muted-foreground -mt-2">
              {isRu ? `Доступ открыт: ${regionGreeting}` : `Access unlocked: ${regionGreeting}`}
            </p>
          )}

          <div className="space-y-3 mt-1">
            {/* Primary: open the guide */}
            <button
              onClick={() => handleAction(() => navigate(articleHref))}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'transition-colors active:scale-[0.98] text-left'
              )}
            >
              <BookOpen className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  {isRu ? 'Открыть гайд' : 'Open the guide'}
                </div>
                <div className="text-[11px] opacity-85">
                  {isRu
                    ? 'Дороги, сезоны, опасности, маршруты'
                    : 'Roads, seasons, hazards, routes'}
                </div>
              </div>
            </button>

            {/* Secondary: AI trip-planner with credits */}
            <button
              onClick={() => handleAction(() => navigate('/trip-planner'))}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl',
                'border border-border bg-card hover:bg-muted/60 hover:border-primary/40',
                'transition-colors active:scale-[0.98] text-left'
              )}
            >
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">
                  {isRu ? 'Запланировать маршрут' : 'Plan a trip'}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {credits === null
                    ? (isRu ? 'AI-помощник по маршруту' : 'AI route helper')
                    : credits > 0
                      ? (isRu
                          // Drop the verb to avoid gender/number agreement issues
                          // ("1 кредит остался" vs "5 кредитов осталось") — count alone reads cleanly.
                          ? `AI-помощник · ${credits} ${pluralCreditsRu(credits)}`
                          : `AI helper · ${credits} ${credits === 1 ? 'credit' : 'credits'} left`)
                      : (isRu ? 'AI-помощник · кредиты закончились' : 'AI helper · out of credits')}
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={dismiss}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center pt-1"
          >
            {isRu ? 'Спасибо, я знаю →' : 'Got it →'}
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Guest 4-card grid (existing) ───────────────────────────────────────
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
          {isRu ? 'Что тут есть' : "What's here"}
        </DialogTitle>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((a) => (
            <button
              key={a.emoji}
              onClick={a.onClick}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border border-border',
                'bg-card hover:bg-muted/60 hover:border-primary/40 transition-all',
                'active:scale-95 text-center'
              )}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-sm font-semibold text-foreground">
                {isRu ? a.titleRu : a.titleEn}
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                {isRu ? a.descRu : a.descEn}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={dismiss}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center pt-1"
        >
          {isRu ? 'Разберусь сам →' : "I'll figure it out →"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

// Russian plural for "кредит": 1 → "кредит", 2-4 → "кредита", 5+ → "кредитов".
// Standard Slavic-plural rule, also handles teens (11-14 → "кредитов").
function pluralCreditsRu(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'кредитов';
  if (mod10 === 1) return 'кредит';
  if (mod10 >= 2 && mod10 <= 4) return 'кредита';
  return 'кредитов';
}
