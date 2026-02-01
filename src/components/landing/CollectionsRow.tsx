import { collections, Collection } from '@/data/collections';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CollectionsRowProps {
  activeCollectionId: string | null;
  onSelectCollection: (collectionId: string | null) => void;
}

export const CollectionsRow = ({ activeCollectionId, onSelectCollection }: CollectionsRowProps) => {
  const { language } = useLanguage();

  const handleClick = (collection: Collection) => {
    if (activeCollectionId === collection.id) {
      onSelectCollection(null); // Deselect if already active
    } else {
      onSelectCollection(collection.id);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground px-1">
        {language === 'ru' ? '📚 Подборки' : '📚 Collections'}
      </h3>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => handleClick(collection)}
              className={cn(
                "flex-shrink-0 w-[100px] rounded-xl overflow-hidden transition-all duration-200",
                "border-2 hover:scale-105",
                activeCollectionId === collection.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-border"
              )}
            >
              {/* Image */}
              <div className="relative h-16">
                <img
                  src={collection.image}
                  alt={language === 'ru' ? collection.name : collection.nameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xl">
                  {collection.emoji}
                </span>
              </div>
              
              {/* Label */}
              <div className="bg-card px-2 py-1.5 text-center">
                <span className="text-xs font-medium text-foreground line-clamp-1">
                  {language === 'ru' ? collection.name : collection.nameEn}
                </span>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
