import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Lock, Send } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { articleBySlug } from '@/content/articles';

const TELEGRAM_BOT_URL = 'https://t.me/dvushka_bot';
const TEASER_FRACTION = 0.35;

const ArticlePage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { canAccessRegion } = useUser();
  const { language } = useLanguage();
  const isRu = language === 'ru';

  const article = articleBySlug(slug);
  const hasAccess = article ? canAccessRegion(article.region) : false;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">
            {isRu ? 'Статья не найдена' : 'Article not found'}
          </h1>
          <Button asChild variant="outline">
            <Link to="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isRu ? 'Все статьи' : 'All articles'}
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isLocked = article.gated && !hasAccess;
  const isComingSoon = !!article.comingSoon;
  const visibleBody = isComingSoon
    ? ''
    : isLocked
      ? article.body.slice(0, Math.floor(article.body.length * TEASER_FRACTION))
      : article.body;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/articles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isRu ? 'Все статьи' : 'All articles'}
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground">{article.summary}</p>
          {article.gated && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span>
                {hasAccess
                  ? isRu ? 'Доступно вам' : 'Unlocked for you'
                  : isRu
                    ? `Платный гайд${article.priceRub ? ` — ${article.priceRub}₽` : ''}`
                    : `Paid guide${article.priceRub ? ` — ${article.priceRub}₽` : ''}`}
              </span>
            </div>
          )}
        </header>

        {!isComingSoon && (
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{visibleBody}</ReactMarkdown>
          </article>
        )}

        {isComingSoon && (
          <aside className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center space-y-3">
            <h2 className="text-xl font-bold">
              {isRu ? 'Скоро' : 'Coming soon'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isRu
                ? 'Этот гайд в разработке. Подпишись на наш Telegram-бот, чтобы первым узнать о запуске.'
                : 'This guide is in the works. Follow our Telegram bot to be first when it ships.'}
            </p>
            <Button asChild size="lg" className="gap-2">
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                <Send className="h-5 w-5" />
                {isRu ? 'Подписаться' : 'Follow'}
              </a>
            </Button>
          </aside>
        )}

        {!isComingSoon && isLocked && (
          <aside className="mt-10 rounded-2xl border border-border bg-muted/40 p-6 md:p-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">
              {isRu ? 'Полный гайд для покупателей' : 'Full guide for buyers'}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isRu
                ? 'Купите гайд в нашем Telegram-боте и получите доступ к полной статье, авторской карте, AI-планировщику маршрута и приглашениям для друзей.'
                : 'Buy the guide in our Telegram bot to unlock the full article, the curated map, the AI trip planner, and invites for friends.'}
            </p>
            <Button asChild size="lg" className="gap-2">
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                <Send className="h-5 w-5" />
                {isRu ? 'Получить доступ' : 'Get access'}
              </a>
            </Button>
          </aside>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
