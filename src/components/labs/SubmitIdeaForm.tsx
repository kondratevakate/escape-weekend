import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLabsSubmissions } from '@/hooks/useLabsSubmissions';
import { sendIdeaToBot } from '@/lib/telegram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SubmitIdeaForm = () => {
  const { language } = useLanguage();
  const { submissions, addSubmission } = useLabsSubmissions();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');

  const ru = language === 'ru';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addSubmission({ title: title.trim(), description: description.trim(), expectedPrice: expectedPrice.trim() });
    sendIdeaToBot({ title: title.trim(), description: description.trim(), expectedPrice: expectedPrice.trim() });
    toast({
      title: ru ? 'Идея отправлена в Telegram' : 'Idea sent via Telegram',
      description: ru ? 'Спасибо! Мы посмотрим её в течение пары дней.' : 'Thanks! We will review it within a few days.',
    });
    setTitle('');
    setDescription('');
    setExpectedPrice('');
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <header className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          {ru ? 'Предложи свою идею' : 'Suggest your idea'}
        </h2>
      </header>
      <p className="text-sm text-muted-foreground mb-4">
        {ru
          ? 'Что бы ты хотел увидеть в WoWAtlas? Опиши кратко — отправим в чат куратора.'
          : 'What would you like to see in WoWAtlas? Describe briefly — we will receive it in our curator chat.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={ru ? 'Название идеи' : 'Idea title'}
          maxLength={80}
          required
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={ru ? 'Что это, для кого и зачем (2–4 предложения)' : 'What is it, for whom, and why (2–4 sentences)'}
          maxLength={500}
          rows={4}
          required
        />
        <Input
          value={expectedPrice}
          onChange={(e) => setExpectedPrice(e.target.value)}
          placeholder={ru ? 'Сколько готов заплатить (необязательно)' : 'What you would pay (optional)'}
          maxLength={40}
        />
        <Button type="submit" className="w-full gap-2">
          <Send className="h-4 w-4" />
          {ru ? 'Отправить через Telegram' : 'Send via Telegram'}
        </Button>
      </form>

      {submissions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {ru ? 'Твои идеи' : 'Your ideas'} · {submissions.length}
          </p>
          <ul className="space-y-1.5">
            {submissions.slice(0, 5).map(s => (
              <li key={s.id} className="text-sm text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                <span className="line-clamp-1">{s.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
