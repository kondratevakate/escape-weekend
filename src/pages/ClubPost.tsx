import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { useClubPosts } from '@/hooks/useClubPosts';
import { useClubReactions } from '@/hooks/useClubReactions';
import { getMember } from '@/data/clubMembers';
import { getNiche } from '@/data/niches';
import { POST_TYPE_META } from '@/types/club';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStash } from '@/hooks/useStash';
import { MemberBadge } from '@/components/club/MemberBadge';
import { ReactionButton } from '@/components/club/ReactionButton';
import { CommentThread } from '@/components/club/CommentThread';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mountain, Clock, ExternalLink, MapPin } from 'lucide-react';
import { kolaPlaces } from '@/data/locations';

const ClubPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { count: stashCount } = useStash();
  const { getById } = useClubPosts();
  const { isFired, fireCount, toggleFire } = useClubReactions();

  const post = id ? getById(id) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header stashCount={stashCount} />
        <main className="pt-24 max-w-2xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">{language === 'ru' ? 'Пост не найден' : 'Post not found'}</p>
          <Button onClick={() => navigate('/club')} variant="link">{language === 'ru' ? 'Назад в клуб' : 'Back to club'}</Button>
        </main>
      </div>
    );
  }

  const meta = POST_TYPE_META[post.type];
  const author = getMember(post.authorId);
  const linkedPlaces = (post.linkedPlaceIds || [])
    .map(pid => kolaPlaces.find(p => p.id === pid))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header stashCount={stashCount} />

      <main className="pt-20 md:pt-24 pb-16 max-w-3xl mx-auto px-4">
        <Link to="/club" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {language === 'ru' ? 'В клуб' : 'To club'}
        </Link>

        {post.cover && (
          <div className="rounded-xl overflow-hidden h-64 md:h-80 mb-6 bg-muted">
            <img src={post.cover} alt={post.title[language]} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${meta.color}22`, color: meta.color }}>
            {meta.emoji} {language === 'ru' ? meta.ru : meta.en}
          </span>
          {post.niches.map(nid => {
            const n = getNiche(nid);
            return n ? (
              <span key={nid} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {n.emoji} {language === 'ru' ? n.ru : n.en}
              </span>
            ) : null;
          })}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{post.title[language]}</h1>
        <p className="text-lg text-muted-foreground mb-5">{post.excerpt[language]}</p>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
          {author && <MemberBadge member={author} />}
          <ReactionButton count={fireCount(post.id)} active={isFired(post.id)} onClick={() => toggleFire(post.id)} size="lg" />
        </div>

        {/* Type-specific blocks */}
        <div className="flex flex-wrap gap-3 mb-6 text-sm">
          {post.durationDays && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
              <Calendar className="h-4 w-4" /> {post.durationDays} {language === 'ru' ? 'дней' : 'days'}
            </div>
          )}
          {post.difficulty && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
              <Mountain className="h-4 w-4" /> {post.difficulty}
            </div>
          )}
          {post.readMinutes && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
              <Clock className="h-4 w-4" /> {post.readMinutes} min
            </div>
          )}
          {post.meetupAt && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 font-medium">
              <Calendar className="h-4 w-4" />
              {new Date(post.meetupAt).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              {post.meetupLocation && ` · ${post.meetupLocation[language]}`}
            </div>
          )}
        </div>

        {/* Body */}
        <article className="prose prose-sm md:prose-base max-w-none text-foreground whitespace-pre-wrap mb-8">
          {post.content[language]}
        </article>

        {/* External link */}
        {post.externalUrl && (
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors mb-8"
          >
            <ExternalLink className="h-4 w-4" />
            {post.externalLabel || (language === 'ru' ? 'Перейти' : 'Open')}
          </a>
        )}

        {/* Linked places */}
        {linkedPlaces.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3">
              {language === 'ru' ? 'Места на карте' : 'Places on map'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {linkedPlaces.map(p => p && (
                <Link
                  key={p.id}
                  to={`/?place=${p.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-sm transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="border-t border-border pt-6">
          <CommentThread postId={post.id} />
        </div>
      </main>
    </div>
  );
};

export default ClubPostPage;
