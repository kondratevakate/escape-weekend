import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/landing/Header';
import { getMember } from '@/data/clubMembers';
import { getNiche } from '@/data/niches';
import { useClubPosts } from '@/hooks/useClubPosts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStash } from '@/hooks/useStash';
import { PostCard } from '@/components/club/PostCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Send, ExternalLink, Flame, FileText, MapPinned } from 'lucide-react';

const ClubMember = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { count: stashCount } = useStash();
  const { allPosts } = useClubPosts();
  const member = id ? getMember(id) : undefined;

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header stashCount={stashCount} />
        <main className="pt-24 text-center px-4">
          <p className="text-muted-foreground">{language === 'ru' ? 'Участник не найден' : 'Member not found'}</p>
        </main>
      </div>
    );
  }

  const posts = allPosts.filter(p => p.authorId === member.id);

  return (
    <div className="min-h-screen bg-background">
      <Header stashCount={stashCount} />

      <main className="pt-20 md:pt-24 pb-16 max-w-3xl mx-auto px-4">
        <Link to="/club" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> {language === 'ru' ? 'В клуб' : 'To club'}
        </Link>

        {/* Profile header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-muted border border-border flex items-center justify-center text-4xl shrink-0">
            {member.avatar?.startsWith('http')
              ? <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              : <span>{member.avatar || '👤'}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
            {member.location && (
              <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5" /> {member.location}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {member.niches.map(nid => {
                const n = getNiche(nid);
                return n ? (
                  <span key={nid} className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">
                    {n.emoji} {language === 'ru' ? n.ru : n.en}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-6">{member.bio[language]}</p>

        {/* Stats */}
        {member.stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <FileText className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="font-bold text-foreground">{member.stats.postsCount || 0}</div>
              <div className="text-[11px] text-muted-foreground">{language === 'ru' ? 'постов' : 'posts'}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Flame className="h-4 w-4 text-orange-500 mx-auto mb-1" />
              <div className="font-bold text-foreground">{member.stats.fireReceived || 0}</div>
              <div className="text-[11px] text-muted-foreground">🔥 {language === 'ru' ? 'получено' : 'received'}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <MapPinned className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="font-bold text-foreground">{member.stats.placesAdded || 0}</div>
              <div className="text-[11px] text-muted-foreground">{language === 'ru' ? 'мест' : 'places'}</div>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {member.links.telegram && (
            <Button asChild size="sm" className="rounded-full">
              <a href={member.links.telegram} target="_blank" rel="noopener noreferrer">
                <Send className="h-3.5 w-3.5 mr-1.5" /> Telegram
              </a>
            </Button>
          )}
          {member.links.instagram && (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={member.links.instagram} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Instagram</a>
            </Button>
          )}
          {member.links.youtube && (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={member.links.youtube} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> YouTube</a>
            </Button>
          )}
          {member.links.vas3k && (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={member.links.vas3k} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> vas3k.club</a>
            </Button>
          )}
          {member.links.website && (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={member.links.website} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Site</a>
            </Button>
          )}
        </div>

        {/* Posts */}
        <h2 className="font-semibold text-foreground mb-3">
          {language === 'ru' ? 'Посты' : 'Posts'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => <PostCard key={p.id} post={p} />)}
          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground italic col-span-full">
              {language === 'ru' ? 'Пока ничего не написал' : 'No posts yet'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClubMember;
