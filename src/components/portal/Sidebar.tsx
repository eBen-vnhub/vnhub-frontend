import { Home, Building, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 mr-8">
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
            <span>Home</span>
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
            <span>Company Profile</span>
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
            <span>Vendor Admin</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
