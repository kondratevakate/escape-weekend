import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { useClubMembership } from '@/hooks/useClubMembership';
import { useClubPosts } from '@/hooks/useClubPosts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStash } from '@/hooks/useStash';
import { getAllNiches, addCustomNiche } from '@/data/niches';
import { NicheChips } from '@/components/club/NicheChips';
import { POST_TYPE_META, ClubPost, ClubPostType } from '@/types/club';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { kolaPlaces } from '@/data/locations';

const NEW_AUTHOR_KEY = 'club_my_author_id';

const ClubNewPost = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { count: stashCount } = useStash();
  const { status } = useClubMembership();
  const { addPost } = useClubPosts();

  const [step, setStep] = useState(1);
  const [type, setType] = useState<ClubPostType>('spot');
  const [titleRu, setTitleRu] = useState('');
  const [excerptRu, setExcerptRu] = useState('');
  const [contentRu, setContentRu] = useState('');
  const [cover, setCover] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [niches, setNiches] = useState<string[]>([]);
  const [linkedPlaceIds, setLinkedPlaceIds] = useState<string[]>([]);
  const [customNiche, setCustomNiche] = useState('');
  const [allNiches, setAllNiches] = useState(getAllNiches);

  if (status !== 'member') {
    return (
      <div className="min-h-screen bg-background">
        <Header stashCount={stashCount} />
        <main className="pt-24 max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {language === 'ru' ? 'Только для членов клуба' : 'Members only'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ru' ? 'Подай заявку, чтобы постить' : 'Apply to start posting'}
          </p>
          <Button onClick={() => navigate('/club/join')}>{language === 'ru' ? 'Подать заявку' : 'Apply'}</Button>
        </main>
      </div>
    );
  }

  const toggleNiche = (id: string) => setNiches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const togglePlace = (id: string) => setLinkedPlaceIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAddCustomNiche = () => {
    const v = customNiche.trim();
    if (!v) return;
    const id = v.toLowerCase().replace(/\s+/g, '-').slice(0, 30);
    addCustomNiche({ id, emoji: '🏷️', ru: v, en: v });
    setAllNiches(getAllNiches());
    setNiches(prev => [...prev, id]);
    setCustomNiche('');
  };

  const canStep2 = !!type;
  const canStep3 = !!titleRu.trim() && !!excerptRu.trim() && !!contentRu.trim() && niches.length > 0;

  const handlePublish = () => {
    const authorId = localStorage.getItem(NEW_AUTHOR_KEY) || 'astra-nik'; // default to a seed for now
    const post: ClubPost = {
      id: `user-${Date.now()}`,
      type,
      authorId,
      createdAt: new Date().toISOString(),
      title: { ru: titleRu, en: titleRu },
      excerpt: { ru: excerptRu, en: excerptRu },
      content: { ru: contentRu, en: contentRu },
      cover: cover || undefined,
      niches,
      linkedPlaceIds: linkedPlaceIds.length ? linkedPlaceIds : undefined,
      externalUrl: externalUrl || undefined,
      externalLabel: externalUrl ? (language === 'ru' ? 'Подробнее' : 'More') : undefined,
    };
    addPost(post);
    navigate(`/club/post/${post.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header stashCount={stashCount} />
      <main className="pt-20 md:pt-24 pb-16 max-w-xl mx-auto px-4">
        <Link to="/club" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {language === 'ru' ? 'В клуб' : 'To club'}
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          {language === 'ru' ? 'Новый пост' : 'New post'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {language === 'ru' ? `Шаг ${step} из 3` : `Step ${step} of 3`}
        </p>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">{language === 'ru' ? 'Что это?' : 'What is it?'}</p>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(POST_TYPE_META) as ClubPostType[]).map(t => {
                const meta = POST_TYPE_META[t];
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      'text-left p-4 rounded-lg border transition-all',
                      active ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{language === 'ru' ? meta.ru : meta.en}</div>
                      </div>
                      {active && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <Button className="w-full" onClick={() => setStep(2)} disabled={!canStep2}>
              {language === 'ru' ? 'Дальше' : 'Next'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{language === 'ru' ? 'Заголовок' : 'Title'} *</label>
              <Input value={titleRu} onChange={e => setTitleRu(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{language === 'ru' ? 'Краткое описание' : 'Excerpt'} *</label>
              <Textarea value={excerptRu} onChange={e => setExcerptRu(e.target.value)} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{language === 'ru' ? 'Текст' : 'Body'} *</label>
              <Textarea value={contentRu} onChange={e => setContentRu(e.target.value)} rows={8} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{language === 'ru' ? 'Обложка (URL)' : 'Cover (URL)'}</label>
              <Input value={cover} onChange={e => setCover(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{language === 'ru' ? 'Внешняя ссылка (TG, vas3k, ютуб)' : 'External link'}</label>
              <Input value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://t.me/..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{language === 'ru' ? 'Ниши' : 'Niches'} *</label>
              <NicheChips niches={allNiches} selectedIds={niches} onToggle={toggleNiche} language={language} size="sm" />
              <div className="flex gap-2 mt-3">
                <Input value={customNiche} onChange={e => setCustomNiche(e.target.value)} placeholder={language === 'ru' ? 'Своя ниша' : 'Custom niche'} className="h-9 text-sm" />
                <Button type="button" size="sm" variant="outline" onClick={handleAddCustomNiche}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>{language === 'ru' ? 'Назад' : 'Back'}</Button>
              <Button className="flex-1" onClick={() => setStep(3)} disabled={!canStep3}>{language === 'ru' ? 'Дальше' : 'Next'}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">{language === 'ru' ? 'Привяжи места на карте (опционально)' : 'Link map places (optional)'}</p>
            <div className="max-h-80 overflow-auto border border-border rounded-lg p-2 space-y-1">
              {kolaPlaces.map(p => {
                const active = linkedPlaceIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlace(p.id)}
                    className={cn('w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between', active ? 'bg-primary/10 text-foreground' : 'hover:bg-muted')}
                  >
                    <span>{p.name}</span>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>{language === 'ru' ? 'Назад' : 'Back'}</Button>
              <Button className="flex-1" onClick={handlePublish}>{language === 'ru' ? 'Опубликовать' : 'Publish'}</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClubNewPost;
