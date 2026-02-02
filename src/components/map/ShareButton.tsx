import { Share2, Send, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { Place } from '@/data/kolaPlaces';
import { useSharePostcard } from '@/hooks/useSharePostcard';
import { toast } from 'sonner';
import { track } from '@/lib/analytics';

interface ShareButtonProps {
  place: Place;
  onShare?: () => void;
  variant?: 'default' | 'icon';
}

export const ShareButton = ({ place, onShare, variant = 'default' }: ShareButtonProps) => {
  const { t, language } = useLanguage();
  const { generateFullShareText, generateTelegramDeepLink } = useSharePostcard();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareText = generateFullShareText(place);
  const telegramDeepLink = generateTelegramDeepLink(place);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: shareText,
        });
        track({ event: 'share_place', placeId: place.id, method: 'native' });
        onShare?.();
        setIsOpen(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(telegramDeepLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    track({ event: 'share_place', placeId: place.id, method: 'telegram' });
    onShare?.();
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success(t('social.linkCopied'));
      track({ event: 'share_place', placeId: place.id, method: 'copy' });
      onShare?.();
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // On mobile with Web Share API - use native share directly
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (canNativeShare && variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleNativeShare();
        }}
      >
        <Share2 className="h-4 w-4 mr-1" />
        {t('social.share')}
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={variant === 'icon' ? '' : 'flex-1'}
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 className="h-4 w-4 mr-1" />
          {t('social.share')}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-48 p-2" 
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={handleTelegramShare}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
          >
            <Send className="h-4 w-4 text-[#0088cc]" />
            Telegram
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {t('social.copyLink')}
          </button>
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            >
              <Share2 className="h-4 w-4" />
              {t('social.more')}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
