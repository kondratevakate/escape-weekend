import { Link } from 'react-router-dom';
import { LABS_IDEAS } from '@/data/labsIdeas';
import { LabIdeaCard } from '@/components/labs/LabIdeaCard';
import { SubmitIdeaForm } from '@/components/labs/SubmitIdeaForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLabsVotes } from '@/hooks/useLabsVotes';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { MobileBottomNav } from '@/components/MobileBottomNav';

const formatRub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

const LabsPage = () => {
  const { language } = useLanguage();
  const { state } = useLabsVotes();
  const ru = language === 'ru';

  const totalVotes = LABS_IDEAS.reduce(
    (acc, idea) => acc + idea.baseVotes + (state.votes.includes(idea.id) ? 1 : 0),
    0
  );
  const totalPledged = LABS_IDEAS.reduce(
    (acc, idea) => acc + idea.basePledged + (state.pledges.includes(idea.id) ? idea.supportAmount : 0),
    0
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label={ru ? 'Назад' : 'Back'}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h1 className="text-base md:text-lg font-semibold text-foreground">
              {ru ? 'Лаборатория идей' : 'Idea Lab'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <section className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {ru
              ? 'Голосуй за фичи, которые хочешь увидеть'
              : 'Vote for the features you want to see'}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {ru
              ? 'Топ-3 уходят в работу первыми. Можно поддержать рублём — переводы вручную через Telegram, без посредников.'
              : 'Top-3 go into production first. You can pledge a small amount — transfers are handled manually via Telegram.'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
            <span>
              👍 <span className="font-medium text-foreground">{totalVotes}</span> {ru ? 'голосов' : 'votes'}
            </span>
            <span>
              💛 <span className="font-medium text-foreground">{formatRub(totalPledged)}</span> {ru ? 'обещано' : 'pledged'}
            </span>
            <span>
              🧪 <span className="font-medium text-foreground">{LABS_IDEAS.length}</span> {ru ? 'идей' : 'ideas'}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {LABS_IDEAS.map(idea => (
            <LabIdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        <SubmitIdeaForm />

        <p className="text-[11px] text-muted-foreground text-center pt-2">
          {ru
            ? 'Голоса и обещания хранятся локально на этом устройстве. Никаких автосписаний.'
            : 'Votes and pledges are stored locally on this device. No auto-charges.'}
        </p>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default LabsPage;
