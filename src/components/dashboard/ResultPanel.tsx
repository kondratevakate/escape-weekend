import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Route, 
  Download, 
  Share2, 
  MapPin, 
  Clock, 
  Car,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Star
} from 'lucide-react';

interface ResultPanelProps {
  isCreator: boolean;
}

// Mock route data for tourist
const mockRoute = {
  name: 'Северный Кольский',
  nameEn: 'Northern Kola',
  days: [
    {
      number: 1,
      title: 'Мурманск → Териберка',
      titleEn: 'Murmansk → Teriberka',
      places: [
        { name: 'Териберка', emoji: '🌊' },
        { name: 'Водопад', emoji: '💧' },
        { name: 'Пляж Драконов', emoji: '🥚' },
      ],
      distance: 130,
      duration: 4,
    },
    {
      number: 2,
      title: 'Ловозеро',
      titleEn: 'Lovozero',
      places: [
        { name: 'Ловозеро', emoji: '🦌' },
        { name: 'Сейдозеро', emoji: '⛰️' },
      ],
      distance: 180,
      duration: 5,
    },
    {
      number: 3,
      title: 'Хибины',
      titleEn: 'Khibiny',
      places: [
        { name: 'Кировск', emoji: '🏔️' },
        { name: 'Апатиты', emoji: '💎' },
      ],
      distance: 100,
      duration: 3,
    },
  ],
  totalDistance: 410,
  totalDuration: 12,
};

// Mock stats for creator
const mockStats = {
  views: 1234,
  saves: 89,
  reviews: 12,
  rating: 4.7,
  trend: '+15%',
};

const TouristResult = () => {
  const { language } = useLanguage();
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">
            {language === 'ru' ? mockRoute.name : mockRoute.nameEn}
          </h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Route className="h-3 w-3" />
            <span>{mockRoute.totalDistance} км</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {mockRoute.days.length} {language === 'ru' ? 'дня' : 'days'} • {mockRoute.totalDuration} {language === 'ru' ? 'ч' : 'h'}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {mockRoute.days.map((day) => (
            <div key={day.number} className="relative">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {day.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-2">
                    {language === 'ru' ? day.title : day.titleEn}
                  </h3>
                  <div className="space-y-1.5">
                    {day.places.map((place, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span>{place.emoji}</span>
                        <span>{place.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      <span>{day.distance} км</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{day.duration} ч</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {day.number < mockRoute.days.length && (
                <div className="absolute left-4 top-10 bottom-0 w-px bg-border -mb-2" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-2">
        <Button className="w-full gap-2">
          <Download className="h-4 w-4" />
          {language === 'ru' ? 'Экспорт в PDF' : 'Export to PDF'}
        </Button>
        <Button variant="outline" className="w-full gap-2">
          <Share2 className="h-4 w-4" />
          {language === 'ru' ? 'Поделиться' : 'Share'}
        </Button>
      </div>
    </div>
  );
};

const CreatorResult = () => {
  const { language } = useLanguage();
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">
          {language === 'ru' ? 'Статистика' : 'Statistics'}
        </h2>
        <div className="flex items-center gap-1 text-xs text-primary mt-1">
          <TrendingUp className="h-3 w-3" />
          <span>{mockStats.trend} {language === 'ru' ? 'за неделю' : 'this week'}</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{language === 'ru' ? 'Просмотры' : 'Views'}</span>
              </div>
              <p className="text-2xl font-semibold">{mockStats.views.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs">{language === 'ru' ? 'Сохранения' : 'Saves'}</span>
              </div>
              <p className="text-2xl font-semibold">{mockStats.saves}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{language === 'ru' ? 'Отзывы' : 'Reviews'}</span>
              </div>
              <p className="text-2xl font-semibold">{mockStats.reviews}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Star className="h-4 w-4" />
                <span className="text-xs">{language === 'ru' ? 'Рейтинг' : 'Rating'}</span>
              </div>
              <p className="text-2xl font-semibold">{mockStats.rating}</p>
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <h3 className="font-medium text-sm mb-3">
              {language === 'ru' ? 'Последняя активность' : 'Recent Activity'}
            </h3>
            <div className="space-y-2">
              {[
                { action: 'saved', user: 'Анна М.', time: '2 мин' },
                { action: 'viewed', user: 'Иван К.', time: '15 мин' },
                { action: 'review', user: 'Мария С.', time: '1 ч' },
              ].map((activity, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {activity.user.charAt(0)}
                    </span>
                    <span>{activity.user}</span>
                    <span className="text-muted-foreground">
                      {activity.action === 'saved' && (language === 'ru' ? 'сохранил(а)' : 'saved')}
                      {activity.action === 'viewed' && (language === 'ru' ? 'посмотрел(а)' : 'viewed')}
                      {activity.action === 'review' && (language === 'ru' ? 'оставил(а) отзыв' : 'left review')}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button className="w-full gap-2">
          <TrendingUp className="h-4 w-4" />
          {language === 'ru' ? 'Продвигать слой' : 'Promote Layer'}
        </Button>
      </div>
    </div>
  );
};

export const ResultPanel = ({ isCreator }: ResultPanelProps) => {
  return isCreator ? <CreatorResult /> : <TouristResult />;
};
