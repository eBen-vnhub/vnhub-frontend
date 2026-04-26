import { useAuth } from '../../../contexts/AuthContext';
import AdminOnboardingPage from './AdminOnboardingPage';
import VsmTasksPage from './VsmTasksPage';
import { Navigate } from 'react-router-dom';

export default function OnboardingPage() {
  const { user } = useAuth();
  const role = user?.role || '';

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return <AdminOnboardingPage />;
  }

  if (role === 'VSM') {
    return <VsmTasksPage />;
  }

  if (role === 'OPERATIONS') {
    return <Navigate to="/backoffice/vendor-setup" replace />;
  }

  return <Navigate to="/backoffice" replace />;
}
