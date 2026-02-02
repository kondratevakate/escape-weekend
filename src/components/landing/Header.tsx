import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Search, Sparkles, User, LogOut, Heart, Menu, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export type CategoryGroup = 'nature' | 'hiking' | 'top';

interface CategoryTab {
  id: CategoryGroup;
  emoji: string;
  labelRu: string;
  labelEn: string;
}

const categoryTabs: CategoryTab[] = [
  { id: 'nature', emoji: '🏔️', labelRu: 'Природа', labelEn: 'Nature' },
  { id: 'hiking', emoji: '🥾', labelRu: 'Походы', labelEn: 'Hiking' },
  { id: 'top', emoji: '⭐', labelRu: 'Топ-места', labelEn: 'Top Places' },
];

interface HeaderProps {
  selectedCategory: CategoryGroup | 'all';
  onCategoryChange: (category: CategoryGroup | 'all') => void;
  onSearch?: (query: string) => void;
}

export const Header = ({ selectedCategory, onCategoryChange, onSearch }: HeaderProps) => {
  const { language, t } = useLanguage();
  const { isAuthenticated, user, logout, setShowLoginModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center gap-4">
        {/* Logo - Left */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🌌</span>
          <span className="font-semibold text-foreground hidden sm:inline">
            {t('landing.brand')}
          </span>
        </div>
        
        {/* Search / AI Input - Center */}
        <form 
          onSubmit={handleSearch}
          className={cn(
            "flex-1 max-w-md mx-auto relative transition-all",
            isSearchFocused && "max-w-lg"
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'ru' ? 'Поиск мест или спросите ИИ...' : 'Search places or ask AI...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 pr-10 h-10 rounded-full bg-muted/50 border-muted-foreground/20 focus:bg-background"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
          </div>
        </form>
        
        {/* Category Tabs - Right of search on desktop */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(
                selectedCategory === tab.id ? 'all' : tab.id
              )}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all",
                "hover:bg-muted",
                selectedCategory === tab.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden lg:inline">
                {language === 'ru' ? tab.labelRu : tab.labelEn}
              </span>
            </button>
          ))}
        </nav>
        
        {/* Language Switcher */}
        <div className="shrink-0">
          <LanguageSwitcher variant="globe" />
        </div>

        {/* User Menu */}
        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full gap-2 pl-2 pr-3 h-9 border-muted-foreground/20"
              >
                <Menu className="h-4 w-4" />
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                  {isAuthenticated ? (
                    <span className="text-xs font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/trip-planner" className="flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      {language === 'ru' ? 'Планировщик' : 'Trip Planner'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="h-4 w-4 mr-2" />
                    {language === 'ru' ? 'Избранное' : 'Favorites'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/trip-planner" className="flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      {language === 'ru' ? 'Планировщик' : 'Trip Planner'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowLoginModal(true)}>
                    <User className="h-4 w-4 mr-2" />
                    {t('auth.login')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLoginModal(true)}>
                    {language === 'ru' ? '✨ Регистрация' : '✨ Sign up'}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile category tabs - below header */}
      <div className="md:hidden flex items-center justify-center gap-1 pb-2 px-4">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onCategoryChange(
              selectedCategory === tab.id ? 'all' : tab.id
            )}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all",
              "hover:bg-muted",
              selectedCategory === tab.id
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            <span>{tab.emoji}</span>
            <span>{language === 'ru' ? tab.labelRu : tab.labelEn}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
