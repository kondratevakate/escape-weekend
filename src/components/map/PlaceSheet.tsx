import { Place, categoryConfig } from '@/data/kolaPlaces';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, ExternalLink, MapPin, Clock, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceSheetProps {
  place: Place | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock reviews data
const getMockReviews = () => [
  { 
    id: 1,
    author: 'Алексей Морозов', 
    avatar: 'А',
    rating: 5, 
    text: 'Потрясающее место! Виды невероятные, особенно на закате. Приезжали с семьёй, дети в восторге. Обязательно берите термос с чаем и бутерброды — кафе рядом нет.', 
    date: '2 недели назад',
    helpful: 12
  },
  { 
    id: 2,
    author: 'Мария Ковалёва', 
    avatar: 'М',
    rating: 4, 
    text: 'Красиво, но дорога сложная. Берите внедорожник или хотя бы машину с высоким клиренсом. Последние 5 км — грунтовка с ямами.', 
    date: '1 месяц назад',
    helpful: 8
  },
  { 
    id: 3,
    author: 'Дмитрий Соколов', 
    avatar: 'Д',
    rating: 5, 
    text: 'Был зимой — северное сияние видно отлично! Главное — следить за прогнозом и выбирать ясные ночи. Фотографии получились космические.', 
    date: '2 месяца назад',
    helpful: 24
  },
  { 
    id: 4,
    author: 'Елена Петрова', 
    avatar: 'Е',
    rating: 4, 
    text: 'Очень красивое место, но много туристов летом. Советую приезжать рано утром или в будни. Есть парковка, но небольшая.', 
    date: '3 месяца назад',
    helpful: 5
  },
  { 
    id: 5,
    author: 'Игорь Васильев', 
    avatar: 'И',
    rating: 5, 
    text: 'Лучшая точка для фотографий на всём Кольском! Закат здесь просто магический. Приезжайте за час до заката и наслаждайтесь.', 
    date: '4 месяца назад',
    helpful: 18
  },
];

export const PlaceSheet = ({ place, open, onOpenChange }: PlaceSheetProps) => {
  if (!place) return null;

  const config = categoryConfig[place.category];
  const reviews = getMockReviews();
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates[0]},${place.coordinates[1]}`;
  const googleMapsReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-4 pt-4 pb-3 border-b">
            <div className="flex items-start gap-3">
              <span 
                className="text-2xl flex-shrink-0"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: config.bgColor,
                }}
              >
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-left text-lg leading-tight">{place.name}</SheetTitle>
                <SheetDescription className="text-left mt-1">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span 
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: config.bgColor, color: config.color }}
                    >
                      {config.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      4.7 · {reviews.length} отзывов
                    </span>
                  </span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Reviews list */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {review.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{review.author}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {review.text}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.helpful} нашли полезным</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t bg-background">
            <Button className="w-full" asChild>
              <a href={googleMapsReviewsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Все отзывы в Google Maps
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
