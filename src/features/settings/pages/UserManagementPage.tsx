import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import PageHeader from '../components/PageHeader';
import UsersToolbar from '../components/users/UsersToolbar';
import UsersTable from '../components/users/UsersTable';
import UserModal from '../components/users/UserModal';
import { Users, Loader2 } from 'lucide-react';
import authService from '../../../services/auth';

export default function UserManagementPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await authService.getUsers(page, debouncedSearch);
      setUsers(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (data: any) => {
    try {
      if (selectedUser) {
        await authService.updateUser(selectedUser.id, data);
      } else {
        await authService.createUser(data);
      }
      fetchUsers();
    } catch (err: any) {
      throw err;
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await authService.updateUser(user.id, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        icon={<Users />}
        title={t.settings?.usersTitle || 'User Management'}
        subtitle={t.settings?.usersSubtitle || 'Manage internal users, assign roles, and control access.'}
      />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <UsersToolbar 
          search={search}
          onSearchChange={setSearch}
          onAddClick={handleAddUser}
        />
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : (
          <>
            <UsersTable 
              users={users} 
              onEdit={handleEditUser} 
              onToggleStatus={handleToggleStatus} 
            />
            {totalPages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-between">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm font-bold text-muted hover:text-main disabled:opacity-50"
                >
                  {t.settings?.table?.previous || 'Previous'}
                </button>
                <span className="text-sm font-bold text-main">
                  {t.settings?.table?.page || 'Page'} {page} {t.settings?.table?.of || 'of'} {totalPages}
                </span>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 text-sm font-bold text-muted hover:text-main disabled:opacity-50"
                >
                  {t.settings?.table?.next || 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}
