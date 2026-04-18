import { useState } from 'react';
import { useClubComments } from '@/hooks/useClubComments';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CommentThreadProps {
  postId: string;
}

const NAME_KEY = 'club_guest_name_v1';

export const CommentThread = ({ postId }: CommentThreadProps) => {
  const { language } = useLanguage();
  const { list, add } = useClubComments(postId);
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    localStorage.setItem(NAME_KEY, name.trim());
    add(postId, name.trim(), text.trim());
    setText('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">
        {language === 'ru' ? `Комментарии (${list.length})` : `Comments (${list.length})`}
      </h3>

      <div className="space-y-3">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            {language === 'ru' ? 'Будь первым — задай вопрос или поделись опытом' : 'Be first — ask or share your experience'}
          </p>
        )}
        {list.map(c => (
          <div key={c.id} className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs shrink-0 border border-border">
              {c.authorName.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">{c.authorName}</span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                </span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 pt-3 border-t border-border">
        <Input
          placeholder={language === 'ru' ? 'Твоё имя' : 'Your name'}
          value={name}
          onChange={e => setName(e.target.value)}
          className="h-9 text-sm"
        />
        <Textarea
          placeholder={language === 'ru' ? 'Напиши комментарий…' : 'Write a comment…'}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={2}
          className="text-sm resize-none"
        />
        <Button type="submit" size="sm" disabled={!name.trim() || !text.trim()}>
          <Send className="h-3.5 w-3.5 mr-1.5" />
          {language === 'ru' ? 'Отправить' : 'Send'}
        </Button>
      </form>
    </div>
  );
};
