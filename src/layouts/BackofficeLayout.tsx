import { Navigate, Outlet } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import BackofficeHeader from '../features/backoffice/components/layout/BackofficeHeader';
import BackofficeSidebar from '../features/backoffice/components/layout/BackofficeSidebar';

export default function BackofficeLayout() {
  const { direction } = useLanguage();
  const { user } = useAuth();

  if (user && user.userType !== 'INTERNAL') {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div dir={direction} className="min-h-screen bg-white flex flex-col">
      <BackofficeHeader />

      <div className="flex-1 flex max-w-7xl w-full mx-auto sm:px-6">
        <BackofficeSidebar />

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
