import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadCreatorProfileById } from '@/hooks/useCreatorProfile';
import { PLATFORM_LABELS, CURRENCY_SYMBOLS } from '@/types/creator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, ExternalLink, Link2, Navigation, Share2, Globe, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PLATFORM_ICONS: Record<string, string> = {
  google: '🗺️',
  yandex: '🟡',
  mapsme: '📍',
  other: '🌐',
};

const CreatorPublicPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRu = language === 'ru';

  const profile = loadCreatorProfileById(id || '');

  if (!profile || !profile.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <p className="text-muted-foreground text-lg">{isRu ? 'Профиль не найден' : 'Profile not found'}</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {isRu ? 'Возможно, креатор ещё не заполнил свой профиль' : 'The creator may not have set up their profile yet'}
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />{isRu ? 'На главную' : 'Go home'}
          </Button>
        </div>
      </div>
    );
  }

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${profile.avatarSeed}`;
  const profileUrl = `${window.location.origin}/creator/${id}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: profile.name, url: profileUrl });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({ title: isRu ? 'Ссылка скопирована!' : 'Link copied!' });
    }
  };

  const hasContent = profile.maps.length > 0 || profile.products.length > 0 || profile.links.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/8 via-background to-background">
      {/* Floating back + share */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between pointer-events-none">
        <Button variant="secondary" size="sm" className="pointer-events-auto shadow-md backdrop-blur-sm bg-background/80" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />{isRu ? 'Назад' : 'Back'}
        </Button>
        <Button variant="secondary" size="sm" className="pointer-events-auto shadow-md backdrop-blur-sm bg-background/80" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />{isRu ? 'Поделиться' : 'Share'}
        </Button>
      </div>

      <div className="max-w-md mx-auto px-4 pt-20 pb-12 space-y-8">
        {/* ── Profile Header ── */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-1 mx-auto">
              <img src={avatarUrl} className="h-full w-full rounded-full bg-card shadow-sm" alt={profile.name} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* ── Route Planning CTA ── */}
        {profile.routePlanEnabled && profile.routePlanPrice && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-[1px]">
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm p-5 text-center space-y-3">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/15">
                <Navigation className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-lg">
                {isRu ? 'Персональный маршрут' : 'Personal Route Plan'}
              </p>
              <p className="text-3xl font-bold text-primary">
                {profile.routePlanPrice} {CURRENCY_SYMBOLS[profile.routePlanCurrency]}
              </p>
              <Button size="lg" className="w-full rounded-xl text-base font-semibold h-12 bg-primary hover:bg-primary/90">
                {isRu ? '✨ Заказать маршрут' : '✨ Order route'}
              </Button>
            </div>
          </div>
        )}

        {/* ── Maps ── */}
        {profile.maps.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
              {isRu ? '🗺️ Мои карты' : '🗺️ My Maps'}
            </p>
            <div className="space-y-2">
              {profile.maps.map(m => (
                <a
                  key={m.id}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent/40 hover:border-primary/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="text-2xl">{PLATFORM_ICONS[m.platform] || '🌐'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{PLATFORM_LABELS[m.platform]}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {profile.products.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
              {isRu ? '📦 Инфопродукты' : '📦 Products'}
            </p>
            <div className="space-y-2">
              {profile.products.map(p => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-2xl border border-border bg-card hover:bg-accent/40 hover:border-primary/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{p.title}</p>
                      {p.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                      )}
                    </div>
                    <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {p.price} {CURRENCY_SYMBOLS[p.currency]}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Links ── */}
        {profile.links.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
              {isRu ? '🔗 Ссылки' : '🔗 Links'}
            </p>
            <div className="space-y-2">
              {profile.links.map(l => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent/40 hover:border-primary/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors flex-1">{l.label}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Share button ── */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full rounded-2xl h-12 text-base border-dashed hover:border-primary/40"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {isRu ? 'Поделиться профилем' : 'Share profile'}
          </Button>
        </div>

        {/* ── Footer ── */}
        <div className="text-center pt-4 pb-2 space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-lg">🌌</span>
            <span className="text-xs font-medium">Hedonist Odyssey</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60">Creator profile</p>
        </div>
      </div>
    </div>
  );
};

export default CreatorPublicPage;
