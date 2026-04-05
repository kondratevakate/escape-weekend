import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadCreatorProfileById, useCreatorProfile } from '@/hooks/useCreatorProfile';
import { PLATFORM_LABELS, CURRENCY_SYMBOLS } from '@/types/creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, ExternalLink, Link2, Navigation } from 'lucide-react';

const CreatorPublicPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRu = language === 'ru';

  const profile = loadCreatorProfileById(id || '');

  if (!profile || !profile.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{isRu ? 'Профиль не найден' : 'Profile not found'}</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />{isRu ? 'На главную' : 'Go home'}
          </Button>
        </div>
      </div>
    );
  }

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${profile.avatarSeed}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />{isRu ? 'Назад' : 'Back'}
        </Button>

        {/* Profile header */}
        <div className="text-center space-y-3">
          <img src={avatarUrl} className="h-20 w-20 rounded-full bg-muted mx-auto" alt={profile.name} />
          <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
          {profile.bio && <p className="text-sm text-muted-foreground max-w-xs mx-auto">{profile.bio}</p>}
        </div>

        {/* Route planning CTA */}
        {profile.routePlanEnabled && profile.routePlanPrice && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4 pb-4 text-center space-y-2">
              <Navigation className="h-5 w-5 text-primary mx-auto" />
              <p className="font-semibold text-foreground">{isRu ? 'Персональный маршрут' : 'Personal Route Plan'}</p>
              <p className="text-2xl font-bold text-primary">
                {profile.routePlanPrice} {CURRENCY_SYMBOLS[profile.routePlanCurrency]}
              </p>
              <Button className="w-full mt-2">
                {isRu ? 'Заказать маршрут' : 'Order route'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Maps */}
        {profile.maps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isRu ? 'Карты' : 'Maps'}
            </h2>
            {profile.maps.map(m => (
              <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{PLATFORM_LABELS[m.platform]}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        )}

        {/* Products */}
        {profile.products.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isRu ? 'Инфопродукты' : 'Products'}
            </h2>
            {profile.products.map(p => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground">{p.title}</p>
                    {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    {p.price} {CURRENCY_SYMBOLS[p.currency]}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Links */}
        {profile.links.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isRu ? 'Ссылки' : 'Links'}
            </h2>
            {profile.links.map(l => (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                <Link2 className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm text-foreground flex-1">{l.label}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pt-4">
          Hedonist Odyssey · Creator
        </p>
      </div>
    </div>
  );
};

export default CreatorPublicPage;
