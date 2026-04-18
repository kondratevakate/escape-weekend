import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { useClubPosts } from '@/hooks/useClubPosts';
import { useClubReactions } from '@/hooks/useClubReactions';
import { useClubMembership } from '@/hooks/useClubMembership';
import { PostCard } from '@/components/club/PostCard';
import { NicheChips } from '@/components/club/NicheChips';
import { getAllNiches } from '@/data/niches';
import { POST_TYPE_META, ClubPostType } from '@/types/club';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, Users, Flame, Sparkles, ExternalLink } from 'lucide-react';
import { useStash } from '@/hooks/useStash';
import { cn } from '@/lib/utils';

const ClubFeed = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { count: stashCount } = useStash();
  const { allPosts, filterAndSort } = useClubPosts();
  const { counts } = useClubReactions();
  const { status } = useClubMembership();

  const [selectedTypes, setSelectedTypes] = useState<ClubPostType[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [sort, setSort] = useState<'recent' | 'fire'>('recent');

  const niches = useMemo(() => getAllNiches(), []);
  const posts = filterAndSort({ types: selectedTypes, niches: selectedNiches, sort, fireMap: counts });

  const toggleType = (t: ClubPostType) => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleNiche = (id: string) => setSelectedNiches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canPost = status === 'member';

  return (
    <div className="min-h-screen bg-background">
      <Header stashCount={stashCount} />

      <main className="pt-20 md:pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Hero */}
        <section className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4" />
            {language === 'ru' ? 'Для своих' : 'Insider only'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {language === 'ru' ? 'Клуб 🔥' : 'The Club 🔥'}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {language === 'ru'
              ? 'Узкое комьюнити экспертов адвенчур-туризма. Маршруты, тайные места, гайды и встречи — без алгоритмов и рекламы.'
              : 'Tight community of adventure-travel experts. Routes, secret spots, guides, meetups — no algorithms, no ads.'}
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {canPost ? (
              <Button onClick={() => navigate('/club/new')} className="rounded-full">
                <Plus className="h-4 w-4 mr-1.5" />
                {language === 'ru' ? 'Новый пост' : 'New post'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/club/join')} className="rounded-full">
                <Users className="h-4 w-4 mr-1.5" />
                {status === 'pending'
                  ? (language === 'ru' ? 'Заявка на рассмотрении' : 'Application pending')
                  : (language === 'ru' ? 'Подать заявку' : 'Apply to join')}
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-full">
              <a href="https://vas3k.club" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                vas3k.club
              </a>
            </Button>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {language === 'ru' ? 'Тип' : 'Type'}
            </span>
            {(Object.keys(POST_TYPE_META) as ClubPostType[]).map(type => {
              const meta = POST_TYPE_META[type];
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full border transition-all',
                    active
                      ? 'border-transparent text-white'
                      : 'bg-muted/50 border-border text-foreground hover:bg-muted'
                  )}
                  style={active ? { background: meta.color } : undefined}
                >
                  {meta.emoji} {language === 'ru' ? meta.ru : meta.en}
                </button>
              );
            })}
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {language === 'ru' ? 'Ниша' : 'Niche'}
            </p>
            <NicheChips niches={niches} selectedIds={selectedNiches} onToggle={toggleNiche} language={language} size="sm" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSort('recent')}
              className={cn('text-xs px-3 py-1 rounded-full', sort === 'recent' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground')}
            >
              {language === 'ru' ? 'Свежее' : 'Recent'}
            </button>
            <button
              onClick={() => setSort('fire')}
              className={cn('text-xs px-3 py-1 rounded-full inline-flex items-center gap-1', sort === 'fire' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground')}
            >
              <Flame className="h-3 w-3" /> {language === 'ru' ? 'Огонь' : 'Hot'}
            </button>
          </div>
        </section>

        {/* Posts grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => <PostCard key={p.id} post={p} />)}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              {language === 'ru' ? 'Ничего не нашлось — сбрось фильтры' : 'Nothing found — reset filters'}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-muted-foreground mt-12">
          {allPosts.length} {language === 'ru' ? 'постов · храним локально, без бэкенда' : 'posts · stored locally, no backend'}
        </p>
      </main>
    </div>
  );
};

export default ClubFeed;
