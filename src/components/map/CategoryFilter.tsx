import { categoryConfig } from '@/data/kolaPlaces';
import { cn } from '@/lib/utils';
import { Bookmark, Scroll, Landmark, Map } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CategoryFilterProps {
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
  showHistoryLayer: boolean;
  onToggleHistoryLayer: () => void;
  showUnescoLayer: boolean;
  onToggleUnescoLayer: () => void;
}

export const CategoryFilter = ({ 
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  showHistoryLayer,
  onToggleHistoryLayer,
  showUnescoLayer,
  onToggleUnescoLayer,
}: CategoryFilterProps) => {
  const { language, t } = useLanguage();

  const items = [
    {
      key: 'stash',
      active: showFavoritesOnly,
      onClick: onToggleFavoritesOnly,
      icon: <Bookmark className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />,
      label: language === 'ru' ? 'Тайник' : 'Secret Stash',
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      key: 'unesco',
      active: showUnescoLayer,
      onClick: onToggleUnescoLayer,
      icon: <Landmark className="h-4 w-4" />,
      label: t('unescoLayer.title'),
      style: showUnescoLayer ? { backgroundColor: categoryConfig.unesco.bgColor, color: categoryConfig.unesco.color } : undefined,
    },
    {
      key: 'indigenous',
      active: showHistoryLayer,
      onClick: onToggleHistoryLayer,
      icon: <Scroll className="h-4 w-4" />,
      label: t('historyLayer.title'),
      style: showHistoryLayer ? { backgroundColor: categoryConfig.history.bgColor, color: categoryConfig.history.color } : undefined,
    },
    {
      key: 'mapstyle',
      active: false,
      onClick: () => {},
      icon: <Map className="h-4 w-4" />,
      label: language === 'ru' ? 'Стиль карты' : 'Map style',
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <Tooltip key={item.key}>
          <TooltipTrigger asChild>
            <button
              onClick={item.onClick}
              className={cn(
                "flex items-center justify-center gap-1.5 p-2 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:scale-105 active:scale-95",
                item.active
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "hover:bg-muted text-muted-foreground"
              )}
              style={item.style}
            >
              {item.icon}
              {item.badge != null && (
                <span className="text-xs font-bold">{item.badge}</span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
