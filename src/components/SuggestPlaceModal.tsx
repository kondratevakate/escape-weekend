import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SuggestPlaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { id: 'nature', labelRu: 'Природа', labelEn: 'Nature', emoji: '🏔️' },
  { id: 'hiking', labelRu: 'Маршрут', labelEn: 'Hiking Trail', emoji: '🥾' },
  { id: 'attraction', labelRu: 'Достопримечательность', labelEn: 'Attraction', emoji: '⭐' },
  { id: 'museum', labelRu: 'Музей', labelEn: 'Museum', emoji: '🏛️' },
  { id: 'village', labelRu: 'Посёлок', labelEn: 'Village', emoji: '🏘️' },
  { id: 'reserve', labelRu: 'Заповедник', labelEn: 'Reserve', emoji: '🌲' },
];

export const SuggestPlaceModal = ({ open, onOpenChange }: SuggestPlaceModalProps) => {
  const { language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    coordinates: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder - just show success
    setIsSubmitted(true);
    toast.success(language === 'ru' ? 'Спасибо за предложение!' : 'Thanks for your suggestion!');
    
    // Reset after delay
    setTimeout(() => {
      setIsSubmitted(false);
      setForm({ name: '', category: '', description: '', coordinates: '' });
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {language === 'ru' ? 'Предложить место' : 'Suggest a Place'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ru' 
              ? 'Знаете интересное место на Кольском? Расскажите нам!' 
              : 'Know an interesting place on Kola Peninsula? Tell us!'}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <p className="text-center font-medium">
              {language === 'ru' ? 'Предложение отправлено!' : 'Suggestion submitted!'}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {language === 'ru' 
                ? 'Мы рассмотрим его и добавим на карту' 
                : 'We will review it and add to the map'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'ru' ? 'Название места' : 'Place name'}
              </label>
              <Input
                placeholder={language === 'ru' ? 'Например: Водопад на реке Титовка' : 'e.g., Titovka River Waterfall'}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'ru' ? 'Категория' : 'Category'}
              </label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ru' ? 'Выберите категорию' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{language === 'ru' ? cat.labelRu : cat.labelEn}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'ru' ? 'Описание' : 'Description'}
              </label>
              <Textarea
                placeholder={language === 'ru' ? 'Расскажите о месте...' : 'Tell us about the place...'}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'ru' ? 'Координаты (необязательно)' : 'Coordinates (optional)'}
              </label>
              <Input
                placeholder="68.1234, 33.5678"
                value={form.coordinates}
                onChange={(e) => setForm({ ...form, coordinates: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {language === 'ru' 
                  ? 'Можно скопировать из Google Maps или Яндекс.Карт' 
                  : 'You can copy from Google Maps or Yandex Maps'}
              </p>
            </div>

            <Button type="submit" className="w-full gap-2">
              <Send className="h-4 w-4" />
              {language === 'ru' ? 'Отправить' : 'Submit'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
