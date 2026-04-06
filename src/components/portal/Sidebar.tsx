import { Layers, HelpCircle, UserCog } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navItems = [
    {
      label: 'Home',
      path: '/portal',
      icon: <Layers className="w-5 h-5" />,
      end: true
    },
    {
      label: 'Knowledge Bank',
      path: '/portal/knowledge',
      icon: <HelpCircle className="w-5 h-5" />,
      disabled: true
    },
    {
      label: 'Team Management',
      path: '/portal/admin',
      icon: <UserCog className="w-5 h-5" />,
      disabled: true
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 mr-8">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.disabled ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted cursor-not-allowed opacity-50">
                  {item.icon}
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                      isActive
                        ? 'bg-brand text-white shadow-md shadow-brand/20'
                        : 'text-main hover:bg-surface-hover hover:text-brand'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
