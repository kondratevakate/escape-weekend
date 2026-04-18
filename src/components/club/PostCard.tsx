import { ClubPost, POST_TYPE_META } from '@/types/club';
import { getMember } from '@/data/clubMembers';
import { getNiche } from '@/data/niches';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClubReactions } from '@/hooks/useClubReactions';
import { useClubComments } from '@/hooks/useClubComments';
import { MemberBadge } from './MemberBadge';
import { ReactionButton } from './ReactionButton';
import { Link } from 'react-router-dom';
import { MessageCircle, ExternalLink, Calendar, Mountain, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: ClubPost;
  variant?: 'feed' | 'compact';
  onClick?: () => void;
}

export const PostCard = ({ post, variant = 'feed', onClick }: PostCardProps) => {
  const { language } = useLanguage();
  const meta = POST_TYPE_META[post.type];
  const author = getMember(post.authorId);
  const { isFired, fireCount, toggleFire } = useClubReactions();
  const { count: commentCount } = useClubComments();

  const title = post.title[language];
  const excerpt = post.excerpt[language];
  const typeLabel = language === 'ru' ? meta.ru : meta.en;

  const Wrapper: any = onClick ? 'button' : Link;
  const wrapperProps = onClick ? { onClick, type: 'button' } : { to: `/club/post/${post.id}` };

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'block w-full text-left bg-card rounded-xl border border-border overflow-hidden',
        'hover:border-primary/40 hover:shadow-lg transition-all',
        'relative group'
      )}
    >
      {/* Color bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: meta.color }} />

      {post.cover && variant === 'feed' && (
        <div className="h-40 overflow-hidden bg-muted">
          <img src={post.cover} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      <div className="p-4 pl-5 space-y-3">
        {/* Type + niches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${meta.color}22`, color: meta.color }}
          >
            {meta.emoji} {typeLabel}
          </span>
          {post.niches.slice(0, 3).map(nid => {
            const n = getNiche(nid);
            if (!n) return null;
            return (
              <span key={nid} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {n.emoji} {language === 'ru' ? n.ru : n.en}
              </span>
            );
          })}
        </div>

        {/* Title + excerpt */}
        <div>
          <h3 className="font-bold text-base leading-snug text-foreground line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{excerpt}</p>
        </div>

        {/* Type-specific meta */}
        {post.type === 'route' && (post.difficulty || post.durationDays) && (
          <div className="flex gap-3 text-xs text-muted-foreground">
            {post.durationDays && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{post.durationDays}{language === 'ru' ? 'д' : 'd'}</span>}
            {post.difficulty && <span className="inline-flex items-center gap-1"><Mountain className="h-3 w-3" />{post.difficulty}</span>}
          </div>
        )}
        {post.type === 'meetup' && post.meetupAt && (
          <div className="text-xs font-medium text-foreground inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.meetupAt).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            {post.meetupLocation && <span className="text-muted-foreground">· {post.meetupLocation[language]}</span>}
          </div>
        )}
        {post.type === 'guide' && post.readMinutes && (
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readMinutes} {language === 'ru' ? 'мин' : 'min'} read
          </div>
        )}

        {/* Footer: author + actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {author && <MemberBadge member={author} size="sm" />}
          <div className="flex items-center gap-2">
            {post.externalUrl && (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                title={post.externalLabel || 'External'}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> {commentCount(post.id)}
            </span>
            <ReactionButton
              count={fireCount(post.id)}
              active={isFired(post.id)}
              onClick={() => toggleFire(post.id)}
              size="sm"
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
