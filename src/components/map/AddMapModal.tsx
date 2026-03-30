import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export const AddMapModal = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // MVP: redirect to Telegram bot with prefilled data
    const text = encodeURIComponent(`New map: ${name}\nLink: ${link}\n${description}`);
    window.open(`https://t.me/dvushka_bot?start=add_map_${text}`, '_blank');
    toast.success(language === 'ru' ? 'Запрос отправлен!' : 'Request sent!');
    setOpen(false);
    setName('');
    setLink('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {language === 'ru' ? 'Добавить карту' : 'Add map'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {language === 'ru' ? 'Добавить свою карту' : 'Add your map'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Input
              placeholder={language === 'ru' ? 'Название карты' : 'Map name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder={language === 'ru' ? 'Ссылка (Google Maps / Яндекс / Maps.me)' : 'Link (Google Maps / Yandex / Maps.me)'}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder={language === 'ru' ? 'Описание (необязательно)' : 'Description (optional)'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!name || !link} className="w-full gap-2">
            <Send className="h-4 w-4" />
            {language === 'ru' ? 'Отправить' : 'Submit'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {language === 'ru'
              ? 'Карта будет добавлена после модерации'
              : 'Map will be added after moderation'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
