import { NavLink } from 'react-router-dom';
import { Home, Users, Settings } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

export default function BackofficeSidebar() {
  const { t } = useLanguage();

  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out fixed md:sticky top-[64px] z-10 h-[calc(100vh-64px)] w-64 hidden md:flex">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="mb-4 px-2">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {t.backoffice.sidebar.adminSection}
          </h2>
        </div>
        
        <nav className="space-y-1">
          <NavLink
            to="/backoffice"
            end
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.backoffice.sidebar.dashboard}</span>
          </NavLink>

          <NavLink
            to="/backoffice/vendors"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.backoffice.sidebar.vendorsDirectory}</span>
          </NavLink>

          <NavLink
            to="/backoffice/settings"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.backoffice.sidebar.systemSettings}</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
