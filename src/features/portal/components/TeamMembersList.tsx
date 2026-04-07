import { Users, Trash2, Shield, UserCheck } from 'lucide-react';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { User } from '../../../types';

interface TeamMembersListProps {
  members: User[];
  isLoading: boolean;
  currentUser: User | null;
  onRemove: (id: string) => void;
}

function RoleBadge({ role, t }: { role: string; t: any }) {
  const isPrimary = role === 'SUPER_ADMIN';
  return (
    <div className="flex flex-col gap-0.5">
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
        isPrimary ? 'bg-brand/10 text-brand' : 'bg-surface-hover text-muted'
      }`}>
        {isPrimary ? <Shield className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
        {isPrimary ? t.portal.vendorAdmin.primaryAdmin : t.portal.vendorAdmin.standardUser}
      </div>
      <span className="text-[11px] text-muted ps-1">
        {isPrimary ? t.portal.vendorAdmin.primaryAdminDescription : t.portal.vendorAdmin.standardUserDescription}
      </span>
    </div>
  );
}

export default function TeamMembersList({ members, isLoading, currentUser, onRemove }: TeamMembersListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6">
      <h2 className="text-lg font-bold text-main flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-brand" />
        {t.portal.vendorAdmin.teamMembers}
      </h2>
      
      {isLoading ? (
        <div className="py-8 text-center text-muted animate-pulse">{t.portal.vendorAdmin.loadingMembers}</div>
      ) : members.length === 0 ? (
        <div className="py-8 text-center text-muted">{t.portal.vendorAdmin.noMembers}</div>
      ) : (
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-hover/20">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-main">{member.email}</p>
                  {member.id === currentUser?.id && (
                    <span className="bg-brand/10 text-brand text-[10px] px-2 py-0.5 rounded-full font-bold">{t.portal.vendorAdmin.you}</span>
                  )}
                </div>
                <RoleBadge role={member.role || 'ADMIN'} t={t} />
              </div>
              {member.id !== currentUser?.id && (
                <button 
                  onClick={() => onRemove(member.id)}
                  className="p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors rounded-lg self-start sm:self-auto group flex items-center gap-2 text-sm"
                  title={t.portal.vendorAdmin.removeUser}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden">{t.portal.vendorAdmin.remove}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
