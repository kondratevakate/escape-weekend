import { NavLink, useLocation } from 'react-router-dom';
import { Map, Route, Flame, Bookmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  stashCount?: number;
}

export const MobileBottomNav = ({ stashCount = 0 }: MobileBottomNavProps) => {
  const { language } = useLanguage();
  const { pathname } = useLocation();

  const items = [
    { to: '/', icon: Map, labelRu: 'Карта', labelEn: 'Map', exact: true },
    { to: '/trip-planner', icon: Route, labelRu: 'Маршрут', labelEn: 'Trip' },
    { to: '/club', icon: Flame, labelRu: 'Клуб', labelEn: 'Club' },
    { to: '/stash', icon: Bookmark, labelRu: 'Тайник', labelEn: 'Stash', badge: stashCount },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[1400] bg-background border-t border-border h-14 flex items-stretch"
      aria-label={language === 'ru' ? 'Основная навигация' : 'Main navigation'}
    >
      {items.map((item) => {
        const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {item.badge != null && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{language === 'ru' ? item.labelRu : item.labelEn}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
