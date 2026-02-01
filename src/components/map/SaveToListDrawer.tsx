import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserList } from '@/hooks/useUserLists';
import { cn } from '@/lib/utils';

const EMOJI_OPTIONS = ['🏔️', '⭐', '🚗', '📍', '🌊', '🏕️', '🎿', '🌲', '❄️', '🦌'];

interface SaveToListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeId: string;
  lists: UserList[];
  onToggleInList: (listId: string, placeId: string) => void;
  onCreateList: (name: string, emoji: string) => string;
  onDeleteList: (id: string) => void;
  isInList: (listId: string, placeId: string) => boolean;
}

export const SaveToListDrawer = ({
  open,
  onOpenChange,
  placeId,
  lists,
  onToggleInList,
  onCreateList,
  onDeleteList,
  isInList,
}: SaveToListDrawerProps) => {
  const { t, language } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📍');

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newId = onCreateList(newListName.trim(), selectedEmoji);
      onToggleInList(newId, placeId);
      setNewListName('');
      setSelectedEmoji('📍');
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateList();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewListName('');
    }
  };

  const isDefaultList = (id: string) => id === 'want_to_visit' || id === 'favorites';

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="flex items-center gap-2 text-lg">
            🔖 {language === 'ru' ? 'Сохранить в список' : 'Save to list'}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-6 space-y-2">
          {/* Lists */}
          {lists.map((list) => (
            <div 
              key={list.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                "hover:bg-muted/50",
                isInList(list.id, placeId) && "bg-primary/5"
              )}
              onClick={() => onToggleInList(list.id, placeId)}
            >
              <Checkbox 
                checked={isInList(list.id, placeId)} 
                onCheckedChange={() => onToggleInList(list.id, placeId)}
                className="pointer-events-none"
              />
              <span className="text-xl">{list.emoji}</span>
              <span className="flex-1 font-medium text-sm">{list.name}</span>
              <span className="text-xs text-muted-foreground">
                {list.placeIds.length}
              </span>
              {!isDefaultList(list.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* Create new list */}
          {isCreating ? (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all",
                      selectedEmoji === emoji 
                        ? "bg-primary/20 ring-2 ring-primary" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={language === 'ru' ? 'Название списка' : 'List name'}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleCreateList} disabled={!newListName.trim()}>
                  {language === 'ru' ? 'Создать' : 'Create'}
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium text-sm">
                {language === 'ru' ? 'Создать список' : 'Create list'}
              </span>
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
