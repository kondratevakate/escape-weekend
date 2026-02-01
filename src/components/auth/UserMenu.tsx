import { User, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserMenuProps {
  onSuggestPlace: () => void;
}

export const UserMenu = ({ onSuggestPlace }: UserMenuProps) => {
  const { isAuthenticated, user, logout, setShowLoginModal } = useAuth();
  const { language } = useLanguage();

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 gap-2"
        onClick={() => setShowLoginModal(true)}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">
          {language === 'ru' ? 'Войти' : 'Log in'}
        </span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-muted-foreground">
            {language === 'ru' ? 'Демо-аккаунт' : 'Demo account'}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSuggestPlace}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'ru' ? 'Предложить место' : 'Suggest a place'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          {language === 'ru' ? 'Выйти' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
