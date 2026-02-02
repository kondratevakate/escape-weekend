import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, 
  List, 
  BookOpen, 
  Layers, 
  Plus, 
  Package, 
  FileEdit, 
  CheckCircle,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface SourcesPanelProps {
  isCreator: boolean;
}

// Mock data for tourist
const touristSources = [
  { id: 'favorites', icon: Heart, count: 12 },
  { id: 'lists', icon: List, count: 3 },
  { id: 'guides', icon: BookOpen, count: 5 },
  { id: 'layers', icon: Layers, count: 8 },
];

// Mock data for creator
const creatorSources = [
  { id: 'myLayers', icon: Layers, count: 4 },
  { id: 'collections', icon: Package, count: 2 },
  { id: 'drafts', icon: FileEdit, count: 3 },
  { id: 'published', icon: CheckCircle, count: 1 },
];

const touristLabels = {
  ru: { favorites: 'Избранное', lists: 'Мои списки', guides: 'Гиды', layers: 'Слои' },
  en: { favorites: 'Favorites', lists: 'My Lists', guides: 'Guides', layers: 'Layers' },
};

const creatorLabels = {
  ru: { myLayers: 'Мои слои', collections: 'Коллекции', drafts: 'Черновики', published: 'Опубликовано' },
  en: { myLayers: 'My Layers', collections: 'Collections', drafts: 'Drafts', published: 'Published' },
};

// Mock saved places
const mockPlaces = [
  { id: '1', name: 'Териберка', emoji: '🌊' },
  { id: '2', name: 'Ловозеро', emoji: '🦌' },
  { id: '3', name: 'Сейдозеро', emoji: '⛰️' },
  { id: '4', name: 'Хибины', emoji: '🏔️' },
];

export const SourcesPanel = ({ isCreator }: SourcesPanelProps) => {
  const { language } = useLanguage();
  const [activeSource, setActiveSource] = useState<string | null>(null);
  
  const sources = isCreator ? creatorSources : touristSources;
  const labels = isCreator 
    ? creatorLabels[language] 
    : touristLabels[language];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {language === 'ru' ? 'Источники' : 'Sources'}
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sources.map((source) => {
            const Icon = source.icon;
            const label = labels[source.id as keyof typeof labels];
            const isActive = activeSource === source.id;
            
            return (
              <button
                key={source.id}
                onClick={() => setActiveSource(isActive ? null : source.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left
                           transition-colors ${isActive 
                             ? 'bg-primary/10 text-primary' 
                             : 'hover:bg-accent/50'}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {source.count}
                  </span>
                  <ChevronRight className={`h-3 w-3 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded source content */}
        {activeSource && (
          <div className="px-2 pb-2">
            <div className="ml-6 border-l-2 border-border pl-3 space-y-1">
              {mockPlaces.map((place) => (
                <button
                  key={place.id}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 
                             transition-colors text-left text-sm"
                >
                  <span>{place.emoji}</span>
                  <span>{place.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          {isCreator 
            ? (language === 'ru' ? 'Создать слой' : 'Create layer')
            : (language === 'ru' ? 'Добавить источник' : 'Add source')}
        </Button>
      </div>
    </div>
  );
};
