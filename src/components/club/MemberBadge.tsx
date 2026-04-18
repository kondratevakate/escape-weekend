import { ClubMember } from '@/types/club';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MemberBadgeProps {
  member: ClubMember;
  size?: 'sm' | 'md';
  showName?: boolean;
}

export const MemberBadge = ({ member, size = 'md', showName = true }: MemberBadgeProps) => {
  const dims = size === 'sm' ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-base';
  return (
    <Link
      to={`/club/u/${member.id}`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-2 group"
    >
      <div className={cn('rounded-full bg-muted flex items-center justify-center shrink-0 border border-border', dims)}>
        {member.avatar?.startsWith('http')
          ? <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
          : <span>{member.avatar || '👤'}</span>}
      </div>
      {showName && (
        <span className="text-sm font-medium text-foreground group-hover:text-primary truncate">
          {member.name}
        </span>
      )}
    </Link>
  );
};
