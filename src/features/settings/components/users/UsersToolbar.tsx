import { Search, Plus } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

interface UsersToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
}

export default function UsersToolbar({ search, onSearchChange, onAddClick }: UsersToolbarProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative flex-1 w-full max-w-md">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder={t.settings?.searchUsers || 'Search users by name or email...'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-hover/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all"
        />
      </div>
      <button 
        onClick={onAddClick}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        {t.settings?.addUser || 'Add User'}
      </button>
    </div>
  );
}
