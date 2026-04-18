import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { useClubMembership } from '@/hooks/useClubMembership';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStash } from '@/hooks/useStash';
import { getAllNiches, addCustomNiche } from '@/data/niches';
import { NicheChips } from '@/components/club/NicheChips';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Plus, CheckCircle2, ExternalLink } from 'lucide-react';
import { sendApplicationToBot, buildBotUrl } from '@/lib/telegram';
import { TG_BOT_USERNAME } from '@/lib/constants';

const ClubJoin = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { count: stashCount } = useStash();
  const { status, app, submitApplication, reset } = useClubMembership();

  const [name, setName] = useState(app.name || '');
  const [contact, setContact] = useState(app.contact || '');
  const [niches, setNiches] = useState<string[]>(app.niches || []);
  const [whyJoin, setWhyJoin] = useState(app.whyJoin || '');
  const [customNicheInput, setCustomNicheInput] = useState('');
  const [allNiches, setAllNiches] = useState(getAllNiches);

  const toggleNiche = (id: string) => setNiches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAddCustom = () => {
    const v = customNicheInput.trim();
    if (!v) return;
    const id = v.toLowerCase().replace(/\s+/g, '-').slice(0, 30);
    addCustomNiche({ id, emoji: '🏷️', ru: v, en: v });
    setAllNiches(getAllNiches());
    setNiches(prev => [...prev, id]);
    setCustomNicheInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whyJoin.trim() || !contact.trim() || niches.length === 0) return;
    const payload = {
      name: name.trim(),
      contact: contact.trim(),
      niches,
      whyJoin: whyJoin.trim(),
    };
    submitApplication(payload);
    sendApplicationToBot(payload);
  };

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <Header stashCount={stashCount} />
        <main className="pt-24 max-w-md mx-auto px-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {language === 'ru' ? 'Заявка отправлена' : 'Application sent'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ru'
              ? 'Куратор посмотрит вручную в течение 1-3 дней. Если одобрят — пришлют ссылку с доступом.'
              : 'A curator will review manually within 1–3 days. If approved, you\'ll get an access link.'}
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <a href="https://t.me/dvushka_bot" target="_blank" rel="noopener noreferrer">
                <Send className="h-4 w-4 mr-2" /> {language === 'ru' ? 'Написать куратору' : 'Message curator'}
              </a>
            </Button>
            <Button variant="ghost" className="w-full" onClick={reset}>
              {language === 'ru' ? 'Отозвать заявку' : 'Withdraw'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (status === 'member') {
    return (
      <div className="min-h-screen bg-background">
        <Header stashCount={stashCount} />
        <main className="pt-24 max-w-md mx-auto px-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {language === 'ru' ? 'Ты уже в клубе' : 'You\'re already in'}
          </h1>
          <Button onClick={() => navigate('/club')} className="mt-4">{language === 'ru' ? 'В клуб' : 'To club'}</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header stashCount={stashCount} />
      <main className="pt-20 md:pt-24 pb-16 max-w-xl mx-auto px-4">
        <Link to="/club" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> {language === 'ru' ? 'В клуб' : 'To club'}
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {language === 'ru' ? 'Заявка в клуб' : 'Apply to join'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === 'ru'
            ? 'Клуб для энтузиастов адвенчур-туризма. Заявки модерируются вручную, чтобы не было рекламы и токсиков.'
            : 'For adventure-travel enthusiasts. Manually moderated to keep out ads and toxicity.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              {language === 'ru' ? 'Кто ты (1 строка)' : 'Who are you (1 line)'} *
            </label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder={language === 'ru' ? 'Никита, фотограф, Мурманск' : 'Nick, photographer, Murmansk'} required />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              {language === 'ru' ? 'Контакт (TG / email / любой)' : 'Contact (TG / email / any)'} *
            </label>
            <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="@username / mail@x.com" required />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              {language === 'ru' ? 'Чем увлекаешься' : 'What you\'re into'} * <span className="text-xs text-muted-foreground font-normal">({niches.length})</span>
            </label>
            <NicheChips niches={allNiches} selectedIds={niches} onToggle={toggleNiche} language={language} size="sm" />

            <div className="flex gap-2 mt-3">
              <Input
                value={customNicheInput}
                onChange={e => setCustomNicheInput(e.target.value)}
                placeholder={language === 'ru' ? 'Своя ниша (напр. собирательство грибов)' : 'Custom niche (e.g. mushroom foraging)'}
                className="text-sm h-9"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCustom}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              {language === 'ru' ? 'Почему хочешь в клуб (3-5 предложений)' : 'Why join (3-5 sentences)'} *
            </label>
            <Textarea value={whyJoin} onChange={e => setWhyJoin(e.target.value)} rows={5} placeholder={language === 'ru' ? 'Расскажи, чем поделишься и что хочешь найти' : 'Tell what you bring and what you seek'} required />
          </div>

          <Button type="submit" className="w-full" disabled={!name.trim() || !whyJoin.trim() || !contact.trim() || niches.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            {language === 'ru' ? 'Отправить через Telegram' : 'Submit via Telegram'}
            <ExternalLink className="h-3.5 w-3.5 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {language === 'ru' ? 'Откроется бот @dvushka_bot — нажми Start' : 'Opens @dvushka_bot — press Start'}
          </p>
        </form>
      </main>
    </div>
  );
};

export default ClubJoin;
