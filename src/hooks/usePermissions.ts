import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const isInternal = user?.userType === 'INTERNAL';
  const isPrimaryAdmin = !isInternal && user?.role === 'ADMIN';
  const isStandardUser = !isInternal && user?.role === 'STANDARD_USER';

  return {
    isPrimaryAdmin,
    isStandardUser,
    canEditCompanyProfile: isPrimaryAdmin || isStandardUser,
    canManageTeam: isPrimaryAdmin,
    canCancelSubscription: isPrimaryAdmin,
  };
}
