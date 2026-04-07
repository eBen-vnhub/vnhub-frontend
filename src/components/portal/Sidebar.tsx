import { Home, Building, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 me-8">
        <nav className="space-y-2">
          <NavLink 
            to="/portal" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-main hover:bg-surface-hover hover:text-brand'
              }`
            }
            end
          >
            <Home className="w-5 h-5" />
            <span>{t.portal.sidebar.home}</span>
          </NavLink>

          <NavLink 
            to="/portal/company-profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-main hover:bg-surface-hover hover:text-brand'
              }`
            }
          >
            <Building className="w-5 h-5" />
            <span>{t.portal.sidebar.companyProfile}</span>
          </NavLink>

          <NavLink 
            to="/portal/admin" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-main hover:bg-surface-hover hover:text-brand'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span>{t.portal.sidebar.vendorAdmin}</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
