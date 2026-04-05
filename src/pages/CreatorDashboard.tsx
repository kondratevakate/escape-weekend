import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { PLATFORM_LABELS, CURRENCY_SYMBOLS } from '@/types/creator';
import type { CreatorMap, CreatorProduct, CreatorLink } from '@/types/creator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Plus, Trash2, Map, ShoppingBag, Link2, Navigation, Eye, User,
  Share2, Copy, CheckCircle2, Circle, X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreatorDashboard = () => {
  const { role } = useUser();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, update, addMap, removeMap, addProduct, removeProduct, addLink, removeLink } = useCreatorProfile();
  const [dismissedOnboarding, setDismissedOnboarding] = useState(() => {
    return localStorage.getItem('creator-onboarding-dismissed') === 'true';
  });
  const [activeTab, setActiveTab] = useState('profile');

  const isRu = language === 'ru';

  if (role !== 'creator' && role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">{isRu ? 'Доступ только для креаторов' : 'Creator access only'}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />{isRu ? 'На главную' : 'Go home'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${profile.avatarSeed}`;
  const profileUrl = `${window.location.origin}/creator/me`;

  // Onboarding steps
  const steps = [
    { key: 'name', done: !!profile.name.trim(), label: isRu ? 'Заполни имя и био' : 'Add name and bio', tab: 'profile' },
    { key: 'map', done: profile.maps.length > 0, label: isRu ? 'Добавь первую карту' : 'Add your first map', tab: 'maps' },
    { key: 'product', done: profile.products.length > 0 || profile.links.length > 0, label: isRu ? 'Добавь продукт или ссылку' : 'Add a product or link', tab: 'products' },
    { key: 'share', done: false, label: isRu ? 'Поделись профилем' : 'Share your profile', tab: null },
  ];
  const completedSteps = steps.filter(s => s.done).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  const showOnboarding = !dismissedOnboarding && completedSteps < steps.length;

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({ title: profile.name || 'Creator Profile', url: profileUrl });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({ title: isRu ? 'Ссылка на профиль скопирована!' : 'Profile link copied!' });
    }
  };

  const handleShareReferral = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const link = `${window.location.origin}?ref=${profile.name || 'creator'}&promo=${code}`;
    navigator.clipboard.writeText(link);
    toast({ title: isRu ? `Реферальная ссылка скопирована: ${code}` : `Referral link copied: ${code}` });
  };

  const handleDismissOnboarding = () => {
    setDismissedOnboarding(true);
    localStorage.setItem('creator-onboarding-dismissed', 'true');
  };

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-foreground">{isRu ? 'Кабинет креатора' : 'Creator Dashboard'}</h1>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleShareReferral}>
          <Copy className="h-4 w-4 mr-1" />{isRu ? 'Реферал' : 'Referral'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShareProfile}>
          <Share2 className="h-4 w-4 mr-1" />{isRu ? 'Профиль' : 'Profile'}
        </Button>
        <Button variant="default" size="sm" onClick={() => navigate('/creator/me')}>
          <Eye className="h-4 w-4 mr-1" />{isRu ? 'Превью' : 'Preview'}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-4">
        {/* Onboarding Checklist */}
        {showOnboarding && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <p className="font-semibold text-sm text-foreground">
                    {isRu ? 'Настрой свой профиль' : 'Set up your profile'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismissOnboarding}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedSteps}/{steps.length} {isRu ? 'шагов выполнено' : 'steps completed'}
              </p>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <button
                    key={step.key}
                    onClick={() => {
                      if (step.tab) setActiveTab(step.tab);
                      if (step.key === 'share') handleShareProfile();
                    }}
                    className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={`text-sm ${step.done ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                      {step.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="profile"><User className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="maps"><Map className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="products"><ShoppingBag className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="links"><Link2 className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="route"><Navigation className="h-4 w-4" /></TabsTrigger>
          </TabsList>

          {/* ── Profile ── */}
          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>{isRu ? 'Профиль' : 'Profile'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={avatarUrl} className="h-16 w-16 rounded-full bg-muted" alt="avatar" />
                  <Button variant="outline" size="sm" onClick={() => update({ avatarSeed: Math.random().toString(36).slice(2, 8) })}>
                    {isRu ? 'Новый аватар' : 'New avatar'}
                  </Button>
                </div>
                <div>
                  <Label>{isRu ? 'Имя' : 'Name'}</Label>
                  <Input value={profile.name} onChange={e => update({ name: e.target.value })} placeholder={isRu ? 'Ваше имя' : 'Your name'} />
                </div>
                <div>
                  <Label>{isRu ? 'О себе' : 'Bio'}</Label>
                  <Textarea value={profile.bio} onChange={e => update({ bio: e.target.value })} placeholder={isRu ? 'Расскажите о себе...' : 'Tell about yourself...'} rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Maps ── */}
          <TabsContent value="maps">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{isRu ? 'Мои карты' : 'My Maps'}</CardTitle>
                <AddMapDialog onAdd={addMap} isRu={isRu} />
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.maps.length === 0 && (
                  <div className="text-center py-6 space-y-2">
                    <Map className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm text-muted-foreground">{isRu ? 'Добавь свою первую карту' : 'Add your first map'}</p>
                    <p className="text-xs text-muted-foreground/60">{isRu ? 'Google Maps, Яндекс.Карты или Maps.me' : 'Google Maps, Yandex Maps or Maps.me'}</p>
                  </div>
                )}
                {profile.maps.map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{PLATFORM_LABELS[m.platform]}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeMap(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Products ── */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{isRu ? 'Инфопродукты' : 'Products'}</CardTitle>
                <AddProductDialog onAdd={addProduct} isRu={isRu} />
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.products.length === 0 && (
                  <div className="text-center py-6 space-y-2">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm text-muted-foreground">{isRu ? 'Добавь свой первый продукт' : 'Add your first product'}</p>
                    <p className="text-xs text-muted-foreground/60">{isRu ? 'Гайды, курсы, чек-листы' : 'Guides, courses, checklists'}</p>
                  </div>
                )}
                {profile.products.map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      <p className="text-sm font-semibold mt-1 text-primary">{p.price} {CURRENCY_SYMBOLS[p.currency]}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Links ── */}
          <TabsContent value="links">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{isRu ? 'Ссылки' : 'Links'}</CardTitle>
                <AddLinkDialog onAdd={addLink} isRu={isRu} />
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.links.length === 0 && (
                  <div className="text-center py-6 space-y-2">
                    <Link2 className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm text-muted-foreground">{isRu ? 'Добавь ссылку на свои ресурсы' : 'Add links to your resources'}</p>
                    <p className="text-xs text-muted-foreground/60">{isRu ? 'Блог, Telegram, Instagram, сайт' : 'Blog, Telegram, Instagram, website'}</p>
                  </div>
                )}
                {profile.links.map(l => (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{l.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{l.url}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeLink(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Route Planning ── */}
          <TabsContent value="route">
            <Card>
              <CardHeader><CardTitle>{isRu ? 'Планирование маршрута' : 'Route Planning'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{isRu ? 'Принимаю заказы' : 'Accepting orders'}</Label>
                  <Switch checked={profile.routePlanEnabled} onCheckedChange={v => update({ routePlanEnabled: v })} />
                </div>
                {profile.routePlanEnabled && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label>{isRu ? 'Цена' : 'Price'}</Label>
                      <Input type="number" value={profile.routePlanPrice ?? ''} onChange={e => update({ routePlanPrice: Number(e.target.value) || undefined })} placeholder="5000" />
                    </div>
                    <div className="w-24">
                      <Label>{isRu ? 'Валюта' : 'Currency'}</Label>
                      <Select value={profile.routePlanCurrency} onValueChange={v => update({ routePlanCurrency: v as any })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RUB">₽ RUB</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/* ── Add Map Dialog ── */
function AddMapDialog({ onAdd, isRu }: { onAdd: (m: Omit<CreatorMap, 'id'>) => void; isRu: boolean }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<CreatorMap['platform']>('google');

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) return;
    onAdd({ name: name.trim(), url: url.trim(), platform });
    setName(''); setUrl('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{isRu ? 'Добавить' : 'Add'}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isRu ? 'Новая карта' : 'New Map'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>{isRu ? 'Название' : 'Name'}</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div>
            <Label>{isRu ? 'Платформа' : 'Platform'}</Label>
            <Select value={platform} onValueChange={v => setPlatform(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PLATFORM_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>{isRu ? 'Ссылка' : 'URL'}</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." /></div>
          <DialogClose asChild><Button className="w-full" onClick={handleSubmit}>{isRu ? 'Добавить карту' : 'Add map'}</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Add Product Dialog ── */
function AddProductDialog({ onAdd, isRu }: { onAdd: (p: Omit<CreatorProduct, 'id'>) => void; isRu: boolean }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'RUB'|'USD'|'EUR'>('RUB');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), price: Number(price) || 0, currency, url: url.trim() });
    setTitle(''); setDescription(''); setPrice(''); setUrl('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{isRu ? 'Добавить' : 'Add'}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isRu ? 'Новый продукт' : 'New Product'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>{isRu ? 'Название' : 'Title'}</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div><Label>{isRu ? 'Описание' : 'Description'}</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} /></div>
          <div className="flex gap-3">
            <div className="flex-1"><Label>{isRu ? 'Цена' : 'Price'}</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
            <div className="w-24">
              <Label>{isRu ? 'Валюта' : 'Currency'}</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽</SelectItem>
                  <SelectItem value="USD">$</SelectItem>
                  <SelectItem value="EUR">€</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>{isRu ? 'Ссылка на покупку' : 'Purchase URL'}</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." /></div>
          <DialogClose asChild><Button className="w-full" onClick={handleSubmit}>{isRu ? 'Добавить продукт' : 'Add product'}</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Add Link Dialog ── */
function AddLinkDialog({ onAdd, isRu }: { onAdd: (l: Omit<CreatorLink, 'id'>) => void; isRu: boolean }) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!label.trim() || !url.trim()) return;
    onAdd({ label: label.trim(), url: url.trim() });
    setLabel(''); setUrl('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />{isRu ? 'Добавить' : 'Add'}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isRu ? 'Новая ссылка' : 'New Link'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>{isRu ? 'Название' : 'Label'}</Label><Input value={label} onChange={e => setLabel(e.target.value)} placeholder={isRu ? 'Мой блог' : 'My blog'} /></div>
          <div><Label>URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." /></div>
          <DialogClose asChild><Button className="w-full" onClick={handleSubmit}>{isRu ? 'Добавить ссылку' : 'Add link'}</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatorDashboard;
