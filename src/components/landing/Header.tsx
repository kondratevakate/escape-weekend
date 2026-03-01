import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Search, Sparkles, Bookmark, Menu, User, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export type CategoryGroup = 'nature' | 'hiking' | 'top';

interface HeaderProps {
  onSearch?: (query: string) => void;
  stashCount?: number;
}

export const Header = ({ onSearch, stashCount = 0 }: HeaderProps) => {
  const { language, t } = useLanguage();
  const { accessMode } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const hasAccess = accessMode === 'telegram' || accessMode === 'token' || accessMode === 'dev';
  const isGuest = accessMode === 'guest';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}`;
    navigator.clipboard.writeText(link);
    toast({ title: language === 'ru' ? 'Ссылка скопирована!' : 'Link copied!' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1500] bg-background/95 backdrop-blur-md border-b border-border">
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🌌</span>
          <span className="font-semibold text-foreground hidden sm:inline">
            {t('landing.brand')}
          </span>
        </div>
        
        {/* Search */}
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
        
        {/* Stash icon */}
        <div className="shrink-0">
          <Link to="/stash" className="relative p-2 rounded-full hover:bg-muted transition-colors inline-flex">
            <Bookmark className="h-5 w-5 text-foreground" />
            {stashCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {stashCount}
              </span>
            )}
          </Link>
        </div>

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
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0 z-[2000]">
              {hasAccess ? (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold">✅ {language === 'ru' ? 'Доступ активен' : 'Access active'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === 'ru' ? 'Кольский · полный доступ' : 'Kola · full access'}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="m-0" />
                  <DropdownMenuItem
                    onClick={() => navigate('/stash')}
                    className="px-4 py-2.5 cursor-pointer"
                  >
                    <span className="mr-2">🗄</span>
                    <span className="flex-1">Secret Stash</span>
                    <span className="text-xs text-muted-foreground">
                      {stashCount} {language === 'ru' ? 'мест' : 'places'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleCopyReferral}
                    className="px-4 py-2.5 cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'ru' ? 'Реферальная ссылка' : 'Referral link'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="m-0" />
                  <div className="px-4 py-2.5">
                    <p className="text-[11px] text-muted-foreground">
                      {language === 'ru' ? 'Поделись — друг получит скидку 50%' : 'Share — your friend gets 50% off'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold">👋 {language === 'ru' ? 'Привет, путешественник' : 'Hey, traveler'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ru' ? 'У тебя пока нет доступа к полной карте' : "You don't have full map access yet"}
                    </p>
                  </div>
                  <div className="px-4 pb-3">
                    <a
                      href="https://t.me/dvushka_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-[hsl(174_60%_41%)] hover:bg-[hsl(174_60%_36%)] text-white text-sm font-medium py-2.5 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {language === 'ru' ? 'Получить доступ' : 'Get access'}
                    </a>
                  </div>
                  <DropdownMenuSeparator className="m-0" />
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-muted-foreground">
                      🗄 Secret Stash · {stashCount} {language === 'ru' ? 'мест сохранено' : 'places saved'}
                    </p>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
