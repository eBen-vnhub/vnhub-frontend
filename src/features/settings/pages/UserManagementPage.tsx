import { useState, useMemo } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import SettingsTabs from '../components/SettingsTabs';
import PageHeader from '../components/PageHeader';
import UsersToolbar from '../components/users/UsersToolbar';
import UsersTable from '../components/users/UsersTable';
import { Users } from 'lucide-react';

export default function UserManagementPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@vnhub.com', role: 'ADMIN', status: 'ACTIVE' },
    { id: 2, name: 'Ahmed Ali', email: 'ahmed@vnhub.com', role: 'VSM', status: 'ACTIVE' },
    { id: 3, name: 'Sara Tech', email: 'sara@vnhub.com', role: 'OPERATIONS', status: 'INACTIVE' },
  ]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const lower = search.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower));
  }, [users, search]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        icon={<Users />}
        title={t.settings?.usersTitle || 'User Management'}
        subtitle={t.settings?.usersSubtitle || 'Manage internal users, assign roles, and control access.'}
      />

      <SettingsTabs />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <UsersToolbar 
          search={search}
          onSearchChange={setSearch}
          onAddClick={() => {}}
        />
        <UsersTable users={filteredUsers} />
      </div>
    </div>
  );
}
