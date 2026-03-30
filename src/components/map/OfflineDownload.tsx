import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { usePremiumAccess } from '@/components/PremiumGate';
import { kolaPlaces } from '@/data/locations';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export const OfflineDownload = () => {
  const { language } = useLanguage();
  const { role } = useUser();
  const hasPremium = usePremiumAccess();

  const canDownload = hasPremium || role === 'creator' || role === 'admin';

  const handleDownload = () => {
    if (!canDownload) {
      toast.error(
        language === 'ru'
          ? '🔒 Офлайн-карта доступна владельцам гайда'
          : '🔒 Offline map is available to guide owners'
      );
      return;
    }

    const data = {
      version: 1,
      exported: new Date().toISOString(),
      places: kolaPlaces.map(p => ({
        id: p.id,
        name: p.name,
        coordinates: p.coordinates,
        category: p.category,
        description: p.description,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hedonist-odyssey-offline.json';
    a.click();
    URL.revokeObjectURL(url);

    toast.success(language === 'ru' ? '📥 Карта скачана!' : '📥 Map downloaded!');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">
        {language === 'ru' ? 'Офлайн' : 'Offline'}
      </span>
    </Button>
  );
};
