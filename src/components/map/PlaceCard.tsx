import { Place, categoryConfig } from '@/data/kolaPlaces';
import { X, MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
  onOpenFullMap: () => void;
}

// Mock data - in real implementation this would come from Google Places API
const getMockPlaceData = (place: Place) => {
  const mockImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  ];
  
  const mockReviews = [
    { author: 'Алексей М.', rating: 5, text: 'Потрясающее место! Виды невероятные, особенно на закате.', date: '2 недели назад' },
    { author: 'Мария К.', rating: 4, text: 'Красиво, но дорога сложная. Берите внедорожник.', date: '1 месяц назад' },
    { author: 'Дмитрий С.', rating: 5, text: 'Был зимой — северное сияние видно отлично!', date: '2 месяца назад' },
  ];

  const mockSummary = `Посетители отмечают невероятные виды и атмосферу дикой природы. Лучшее время — закат или полярная ночь для северного сияния. Рекомендуют брать тёплую одежду и запас еды. Дорога может быть сложной — советуют внедорожник.`;

  return {
    imageUrl: mockImages[Math.floor(Math.random() * mockImages.length)],
    rating: 4.5 + Math.random() * 0.4,
    reviewCount: Math.floor(50 + Math.random() * 200),
    summary: mockSummary,
    reviews: mockReviews,
  };
};

export const PlaceCard = ({ place, onClose, onOpenFullMap }: PlaceCardProps) => {
  const config = categoryConfig[place.category];
  const mockData = getMockPlaceData(place);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates[0]},${place.coordinates[1]}`;

  return (
    <div className="bg-card rounded-xl shadow-2xl border overflow-hidden max-w-sm w-full">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={mockData.imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{mockData.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({mockData.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-lg"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: config.bgColor,
            }}
          >
            {config.icon}
          </span>
          <span 
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: config.bgColor, color: config.color }}
          >
            {config.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg leading-tight mb-1">{place.name}</h3>
        {place.nameEn && (
          <p className="text-xs text-muted-foreground mb-3">{place.nameEn}</p>
        )}

        {/* AI Summary */}
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-semibold text-primary">✨ AI резюме отзывов</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mockData.summary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onOpenFullMap}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Отзывы
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            asChild
          >
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Google Maps
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
