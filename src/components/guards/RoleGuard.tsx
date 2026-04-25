import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { ReactNode } from 'react';

interface RoleGuardProps {
  allowedRoles: string[];
  children?: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role || '';

  if (!allowedRoles.includes(role)) {
    if (role === 'OPERATIONS') {
      return <Navigate to="/backoffice/onboarding" replace />;
    }
    return <Navigate to="/backoffice/vendors" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
