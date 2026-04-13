import { Navigate, Outlet } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/portal/Header';
import BackofficeSidebar from '../features/backoffice/components/layout/BackofficeSidebar';

export default function BackofficeLayout() {
  const { direction } = useLanguage();
  const { user } = useAuth();

  if (user && user.userType !== 'INTERNAL') {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div dir={direction} className="min-h-screen flex flex-col bg-surface-hover">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex gap-8">
        <BackofficeSidebar />

        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
