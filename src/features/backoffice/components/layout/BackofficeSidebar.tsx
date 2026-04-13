import { NavLink } from 'react-router-dom';
import { Home, Users, Settings } from 'lucide-react';
import { useLanguage } from '../../../../i18n/LanguageContext';

export default function BackofficeSidebar() {
  const { t } = useLanguage();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 me-8">
        <div className="mb-6 px-4">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
            VNHub Administration
          </h2>
        </div>
        
        <nav className="space-y-2">
          <NavLink
            to="/backoffice"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-main hover:bg-surface-hover hover:text-brand'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/backoffice/vendors"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-main hover:bg-surface-hover hover:text-brand'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span>Vendors Directory</span>
          </NavLink>

          <NavLink
            to="/backoffice/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-main hover:bg-surface-hover hover:text-brand'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>System Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
