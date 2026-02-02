import { memo, useState } from 'react';
import { Share2, Send, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { Collection } from '@/data/collections';
import { kolaPlaces } from '@/data/kolaPlaces';
import { toast } from 'sonner';

const BOT_USERNAME = 'KolaGuideBot';

interface CollectionShareButtonProps {
  collection: Collection;
  onShare?: () => void;
}

export const CollectionShareButton = memo(({ 
  collection, 
  onShare 
}: CollectionShareButtonProps) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isRu = language === 'ru';
  const name = isRu ? collection.name : collection.nameEn;

  // Get place names for the collection
  const placesInCollection = collection.placeIds
    .map(id => kolaPlaces.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 5); // Max 5 places in preview

  const generateShareText = (): string => {
    const lines = [
      `${collection.emoji} ${isRu ? 'Коллекция' : 'Collection'}: ${name}`,
      `${collection.placeIds.length} ${isRu ? 'мест' : 'places'}`,
      '',
    ];

    placesInCollection.forEach((place, i) => {
      if (place) {
        lines.push(`${i + 1}. ${place.name}`);
      }
    });

    if (collection.placeIds.length > 5) {
      lines.push(`... ${isRu ? 'и ещё' : 'and'} ${collection.placeIds.length - 5}`);
    }

    lines.push('');
    lines.push(`🗺️ ${isRu ? 'Кольский полуостров' : 'Kola Peninsula'}`);

    return lines.join('\n');
  };

  const telegramDeepLink = `https://t.me/${BOT_USERNAME}?start=collection_${collection.id}`;

  const handleTelegramShare = () => {
    const text = generateShareText();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(telegramDeepLink)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
    onShare?.();
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      const text = generateShareText();
      await navigator.clipboard.writeText(`${text}\n\n${telegramDeepLink}`);
      setCopied(true);
      toast.success(t('social.linkCopied'));
      onShare?.();
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-40 p-2" 
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={handleTelegramShare}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-md hover:bg-muted transition-colors text-left"
          >
            <Send className="h-3 w-3 text-[#0088cc]" />
            Telegram
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-md hover:bg-muted transition-colors text-left"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {t('social.copyLink')}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
});

CollectionShareButton.displayName = 'CollectionShareButton';
