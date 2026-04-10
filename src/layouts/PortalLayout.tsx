import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/portal/Header';
import Sidebar from '../components/portal/Sidebar';
import Footer from '../components/portal/Footer';

export default function PortalLayout() {
  const { direction } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  if (user && user.workspaces && user.workspaces.length > 1) {
    if (!sessionStorage.getItem('workspace_selected')) {
      return <Navigate to="/select-workspace" state={{ from: location }} replace />;
    }
  }

  return (
    <div dir={direction} className="min-h-screen flex flex-col bg-surface-hover">
      <Header />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex gap-8">
        <Sidebar />
        
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
