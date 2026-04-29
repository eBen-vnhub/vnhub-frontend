import { Edit2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface User {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status?: string;
  isActive?: boolean;
}

interface UsersTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  currentUserId?: string | number;
}

export default function UsersTable({ users, onEdit, onToggleStatus, currentUserId }: UsersTableProps) {
  const { t } = useLanguage();
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-hover/30 text-xs text-muted uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">{t.settings?.table?.user || 'User'}</th>
            <th className="px-6 py-4 font-bold">{t.settings?.table?.role || 'Role'}</th>
            <th className="px-6 py-4 font-bold">{t.settings?.table?.status || 'Status'}</th>
            <th className="px-6 py-4 font-bold text-right">{t.settings?.table?.actions || 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map(u => {
            const displayName = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown';
            const isActive = u.isActive ?? (u.status === 'ACTIVE');
            const isSelf = String(u.id) === String(currentUserId);
            return (
              <tr key={u.id} className="hover:bg-surface-hover/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-main">{displayName}</span>
                    {isSelf && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        {t.settings?.table?.you || 'You'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-1">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-brand/10 text-brand text-xs font-bold rounded-md">
                    {u.role ? u.role.replace('_', ' ') : 'USER'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isSelf ? (
                    <span className="text-xs text-muted italic">—</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      {onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(u)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-brand' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(u)}
                          className="p-2 text-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-muted">
                {t.settings?.table?.noUsers || 'No users found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

