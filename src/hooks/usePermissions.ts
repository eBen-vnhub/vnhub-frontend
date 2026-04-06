import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return {
    isSuperAdmin,
    isAdmin,
    canEditCompanyProfile: isSuperAdmin,
    canManageTeam: isSuperAdmin,
  };
}
