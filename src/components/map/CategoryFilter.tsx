import { useState } from 'react';
import { categoryConfig } from '@/data/kolaPlaces';
import { creators } from '@/data/creators';
import { cn } from '@/lib/utils';
import { Bookmark, Scroll, Landmark, UtensilsCrossed, Plus, Mountain, Moon, Route, Flame, AlertTriangle } from 'lucide-react';
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
  showRestaurantLayer: boolean;
  onToggleRestaurantLayer: () => void;
  showTerrainLayer: boolean;
  onToggleTerrainLayer: () => void;
  showLightPollutionLayer: boolean;
  onToggleLightPollutionLayer: () => void;
  showRoadsLayer: boolean;
  onToggleRoadsLayer: () => void;
  showTouristPressureLayer: boolean;
  onToggleTouristPressureLayer: () => void;
  showHazardsLayer: boolean;
  onToggleHazardsLayer: () => void;
  orientation?: 'vertical' | 'horizontal';
}

export const CategoryFilter = ({ 
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  showHistoryLayer,
  onToggleHistoryLayer,
  showUnescoLayer,
  onToggleUnescoLayer,
  showRestaurantLayer,
  onToggleRestaurantLayer,
  showTerrainLayer,
  onToggleTerrainLayer,
  showLightPollutionLayer,
  onToggleLightPollutionLayer,
  showRoadsLayer,
  onToggleRoadsLayer,
  showTouristPressureLayer,
  onToggleTouristPressureLayer,
  showHazardsLayer,
  onToggleHazardsLayer,
  orientation = 'vertical',
}: CategoryFilterProps) => {
  const { language, t } = useLanguage();
  const [activeCreators, setActiveCreators] = useState<Set<string>>(new Set());

  const toggleCreator = (id: string) => {
    setActiveCreators(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
      key: 'restaurants',
      active: showRestaurantLayer,
      onClick: onToggleRestaurantLayer,
      icon: <UtensilsCrossed className="h-4 w-4" />,
      label: language === 'ru' ? 'Рестораны' : 'Restaurants',
      style: showRestaurantLayer ? { backgroundColor: categoryConfig.restaurant.bgColor, color: categoryConfig.restaurant.color } : undefined,
    },
    {
      key: 'terrain',
      active: showTerrainLayer,
      onClick: onToggleTerrainLayer,
      icon: <Mountain className="h-4 w-4" />,
      label: language === 'ru' ? 'Рельеф' : 'Terrain',
    },
    {
      key: 'lightPollution',
      active: showLightPollutionLayer,
      onClick: onToggleLightPollutionLayer,
      icon: <Moon className="h-4 w-4" />,
      label: language === 'ru' ? 'Световое загрязнение' : 'Light Pollution',
    },
    {
      key: 'roads',
      active: showRoadsLayer,
      onClick: onToggleRoadsLayer,
      icon: <Route className="h-4 w-4" />,
      label: language === 'ru' ? 'Дороги' : 'Roads',
    },
    {
      key: 'touristPressure',
      active: showTouristPressureLayer,
      onClick: onToggleTouristPressureLayer,
      icon: <Flame className="h-4 w-4" />,
      label: language === 'ru' ? 'Туристическая нагрузка' : 'Tourist Pressure',
    },
    {
      key: 'hazards',
      active: showHazardsLayer,
      onClick: onToggleHazardsLayer,
      icon: <AlertTriangle className="h-4 w-4" />,
      label: language === 'ru' ? 'Опасности и предупреждения' : 'Hazards & Warnings',
      style: showHazardsLayer ? { backgroundColor: 'hsl(0, 84%, 90%)', color: 'hsl(0, 84%, 40%)' } : undefined,
    },
    {
      key: 'addmap',
      active: false,
      onClick: () => window.open('https://t.me/twoushka_bot?start=custom_map', '_blank'),
      icon: <Plus className="h-4 w-4" />,
      label: language === 'ru' ? 'Добавить свою карту' : 'Add your map',
    },
  ];

  return (
    <div className={cn(orientation === 'horizontal' ? 'flex flex-row gap-1 items-center' : 'flex flex-col gap-1')}>
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
          <TooltipContent side={orientation === 'horizontal' ? 'bottom' : 'left'} className="text-xs">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Creators section */}
      {creators.length > 0 && (
        <>
          <div className={cn(orientation === 'horizontal' ? 'w-px h-7 bg-border mx-1' : 'h-px bg-border my-1')} />
          {creators.map((creator) => {
            const isActive = activeCreators.has(creator.id);
            return (
              <Tooltip key={creator.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleCreator(creator.id)}
                    className={cn(
                      "flex items-center justify-center p-1.5 rounded-lg transition-all duration-200",
                      "hover:scale-105 active:scale-95",
                      isActive
                        ? "ring-2 ring-primary/50 shadow-sm"
                        : "hover:bg-muted opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="h-7 w-7 rounded-full bg-muted"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side={orientation === 'horizontal' ? 'bottom' : 'left'} className="text-xs">
                  <div>
                    <span className="font-medium">{creator.name}</span>
                    <span className="block text-muted-foreground">
                      {language === 'ru' ? creator.layerLabel.ru : creator.layerLabel.en}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </>
      )}
    </div>
  );
};
