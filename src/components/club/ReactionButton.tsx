import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReactionButtonProps {
  count: number;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ReactionButton = ({ count, active, onClick, size = 'md' }: ReactionButtonProps) => {
  const dims = {
    sm: 'h-7 px-2 gap-1 text-xs',
    md: 'h-9 px-3 gap-1.5 text-sm',
    lg: 'h-11 px-4 gap-2 text-base',
  }[size];
  const icon = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' }[size];

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={cn(
        'inline-flex items-center rounded-full font-semibold border transition-all active:scale-95',
        dims,
        active
          ? 'bg-orange-500/15 border-orange-500/50 text-orange-600 dark:text-orange-400'
          : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
      )}
    >
      <Flame className={cn(icon, active && 'fill-orange-500 text-orange-500')} />
      <span>{count}</span>
    </button>
  );
};
