import { Link, useLocation } from 'react-router-dom';
import { Map, CalendarDays, Heart, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  labelRu: string;
  labelEn: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: <Map className="h-5 w-5" />, labelRu: 'Карта', labelEn: 'Map' },
  { to: '/trip-planner', icon: <CalendarDays className="h-5 w-5" />, labelRu: 'Маршрут', labelEn: 'Trip' },
];

export const MobileBottomNav = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const isRu = language === 'ru';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">
                {isRu ? item.labelRu : item.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
