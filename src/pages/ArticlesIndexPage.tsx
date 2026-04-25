import { Link } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { articles } from '@/content/articles';

const ArticlesIndexPage = () => {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-5xl">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {isRu ? 'Гайды и материалы' : 'Guides and articles'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {isRu
              ? 'Авторские маршруты по любимым направлениям. Часть статей открытая, часть — для покупателей.'
              : 'Curated guides for our favourite destinations. Some articles are open, some are for buyers.'}
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-2">
          {articles.map(article => (
            <li key={article.slug}>
              <Link
                to={`/articles/${article.slug}`}
                className="block rounded-2xl border border-border bg-card hover:bg-accent transition-colors p-6 h-full"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-2xl font-semibold">{article.title}</h2>
                  {article.gated ? (
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  ) : (
                    <Unlock className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
                {article.gated && article.priceRub && (
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {isRu ? `Гайд — ${article.priceRub}₽` : `Guide — ${article.priceRub}₽`}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlesIndexPage;
