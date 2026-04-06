import { Outlet } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const { direction } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <div dir={direction} className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-border-subtle px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-main">VN Hub</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user?.email}</span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted hover:text-error bg-white border border-border-subtle rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
