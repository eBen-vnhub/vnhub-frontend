import { Users, Trash2 } from 'lucide-react';
import type { User } from '../../../types';

interface TeamMembersListProps {
  members: User[];
  isLoading: boolean;
  currentUser: User | null;
  onRemove: (id: string) => void;
}

export default function TeamMembersList({ members, isLoading, currentUser, onRemove }: TeamMembersListProps) {
  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6">
      <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-brand" />
        Team Members
      </h2>
      
      {isLoading ? (
        <div className="py-8 text-center text-muted animate-pulse">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="py-8 text-center text-muted">No team members found.</div>
      ) : (
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-hover/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-main">{member.email}</p>
                  {member.id === currentUser?.id && (
                    <span className="bg-brand/10 text-brand text-[10px] px-2 py-0.5 rounded-full font-bold">YOU</span>
                  )}
                </div>
                <p className="text-xs text-muted font-medium bg-surface-hover inline-block px-2 py-1 rounded-md">
                  Role: {member.role === 'SUPER_ADMIN' ? 'Super Admin' : member.role}
                </p>
              </div>
              {member.id !== currentUser?.id && (
                <button 
                  onClick={() => onRemove(member.id)}
                  className="p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors rounded-lg self-start sm:self-auto group flex items-center gap-2 text-sm"
                  title="Remove User"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden">Remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
