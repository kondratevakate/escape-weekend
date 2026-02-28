import { Place, categoryConfig } from '@/data/kolaPlaces';
import { getRestaurantById } from '@/data/restaurantsLayer';
import { X, MapPin, ExternalLink, Star, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  place: Place;
  onClose: () => void;
}

export const RestaurantCard = ({ place, onClose }: RestaurantCardProps) => {
  const { language } = useLanguage();
  const restaurant = getRestaurantById(place.id);
  const config = categoryConfig[place.category];

  if (!restaurant) return null;

  return (
    <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden w-[320px]">
      {/* Photo or placeholder */}
      <div className="relative h-[160px] overflow-hidden">
        {restaurant.photo_url ? (
          <img
            src={restaurant.photo_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: config.bgColor }}
          >
            <span className="text-6xl">{config.icon}</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
        {/* Price badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-full text-xs font-bold text-foreground">
          {restaurant.price_range}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Name + cuisine */}
        <div>
          <h3 className="font-bold text-lg leading-tight text-foreground">{restaurant.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {restaurant.cuisine_type} · {restaurant.city}
          </p>
        </div>

        {/* Rating */}
        {restaurant.rating && (
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-foreground">{restaurant.rating}</span>
            {restaurant.rating_source && (
              <span className="text-xs text-muted-foreground">· {restaurant.rating_source}</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed">{restaurant.description}</p>

        {/* Signature dish */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {language === 'ru' ? 'Что пробовать' : 'Must try'}
          </p>
          <p className="text-sm text-foreground">{restaurant.signature_dish}</p>
        </div>

        {/* Awards */}
        {restaurant.awards.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {restaurant.awards.map(award => (
              <span
                key={award}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              >
                <Award className="h-2.5 w-2.5" />
                {award}
              </span>
            ))}
          </div>
        )}

        {/* Only here badge */}
        {restaurant.only_here && (
          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            🌟 {language === 'ru' ? 'Только здесь' : 'Only here'}
          </span>
        )}
      </div>
    </div>
  );
};
