import { Place } from '@/data/kolaPlaces';
import { ExploreCard } from './ExploreCard';
import { CollectionsRow } from './CollectionsRow';
import { HiddenGems } from './HiddenGems';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiscoverPanelProps {
  activeCollectionId: string | null;
  onStartExplore: () => void;
  onSelectCollection: (collectionId: string | null) => void;
  onPlaceClick: (place: Place) => void;
}

export const DiscoverPanel = ({
  activeCollectionId,
  onStartExplore,
  onSelectCollection,
  onPlaceClick,
}: DiscoverPanelProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 md:p-4 space-y-4 md:space-y-5">
        {/* Explore Mode Card */}
        <ExploreCard onStart={onStartExplore} />
        
        {/* Collections Row */}
        <CollectionsRow 
          activeCollectionId={activeCollectionId}
          onSelectCollection={onSelectCollection}
        />
        
        {/* Hidden Gems */}
        <HiddenGems onPlaceClick={onPlaceClick} />
      </div>
    </ScrollArea>
  );
};
