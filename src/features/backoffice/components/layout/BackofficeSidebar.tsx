import { NavLink } from 'react-router-dom';
import { Users, ClipboardList, Briefcase, Activity, ServerCog, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';

export default function BackofficeSidebar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const role = user?.role || '';
  const [opsExpanded, setOpsExpanded] = useState(true);
  const [vsmExpanded, setVsmExpanded] = useState(true);

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN' || isSuperAdmin;
  const isVsm = role === 'VSM';
  const isOps = role === 'OPERATIONS';

  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out fixed md:sticky top-[64px] z-10 h-[calc(100vh-64px)] w-64 hidden md:flex">
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">

        {isAdmin && (
          <>
            <div className="space-y-1">
              <h2 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t.backoffice.sidebar.adminSection}
              </h2>
              <nav className="space-y-1">
                <SidebarLink to="/backoffice/vendors" icon={<Users />} label={t.backoffice.sidebar.vendorsDirectory} />
                {isSuperAdmin && (
                  <>
                    <SidebarLink to="/backoffice/users" icon={<Users />} label={t.settings?.users || 'User Management'} />
                    <SidebarLink to="/backoffice/activity-logs" icon={<Settings />} label={t.settings?.logs || 'Activity Logs'} />
                  </>
                )}
              </nav>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setVsmExpanded(!vsmExpanded)}
                className="w-full flex items-center justify-between px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-500 transition-colors"
              >
                {t.backoffice.sidebar.vsmSection}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${vsmExpanded ? '' : '-rotate-90'}`} />
              </button>
              {vsmExpanded && (
                <nav className="space-y-1">
                  <SidebarLink to="/backoffice/onboarding" icon={<ClipboardList />} label={t.backoffice.sidebar.vendorOnboarding} />
                  <SidebarLink to="/backoffice/benefit-tracker" icon={<Activity />} label={t.backoffice.sidebar.benefitTracker} />
                </nav>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setOpsExpanded(!opsExpanded)}
                className="w-full flex items-center justify-between px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-500 transition-colors"
              >
                {t.backoffice.sidebar.opsSection}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${opsExpanded ? '' : '-rotate-90'}`} />
              </button>
              {opsExpanded && (
                <nav className="space-y-1">
                  <SidebarLink to="/backoffice/vendor-setup" icon={<ServerCog />} label={t.backoffice.sidebar.vendorSetup} />
                  <SidebarLink to="/backoffice/benefit-builds" icon={<Activity />} label={t.backoffice.sidebar.benefitBuilds} />
                </nav>
              )}
            </div>
          </>
        )}

        {isVsm && (
          <div className="space-y-1">
            <h2 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.backoffice.sidebar.vsmSection}
            </h2>
            <nav className="space-y-1">
              <SidebarLink to="/backoffice/vendors" icon={<Users />} label={t.backoffice.sidebar.vendorsDirectory} />
              <SidebarLink to="/backoffice/onboarding" icon={<Briefcase />} label={t.backoffice.sidebar.vendorOnboarding} />
              <SidebarLink to="/backoffice/benefit-tracker" icon={<Activity />} label={t.backoffice.sidebar.benefitTracker} />
            </nav>
          </div>
        )}

        {isOps && (
          <div className="space-y-1">
            <h2 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.backoffice.sidebar.opsSection}
            </h2>
            <nav className="space-y-1">
              <SidebarLink to="/backoffice/vendor-setup" icon={<ServerCog />} label={t.backoffice.sidebar.vendorSetup} />
              <SidebarLink to="/backoffice/benefit-builds" icon={<Activity />} label={t.backoffice.sidebar.benefitBuilds} />
            </nav>
          </div>
        )}

      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label, end = false }: { to: string; icon: React.ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${isActive
          ? 'bg-brand/10 text-brand font-semibold'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
        }`
      }
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm truncate">{label}</span>
    </NavLink>
  );
}
