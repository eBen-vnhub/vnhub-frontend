import { useState } from 'react';
import { Home, Building, Users, Gift, Store, ClipboardList } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import InlineSubscriptionModal from './InlineSubscriptionModal';

export default function Sidebar() {
  const { t } = useLanguage();
  const [showBranchModal, setShowBranchModal] = useState(false);

  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out fixed md:sticky top-[64px] z-10 h-[calc(100vh-64px)] w-64 hidden md:flex">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="mb-4">
          <WorkspaceSwitcher onAddBranch={() => setShowBranchModal(true)} />
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/portal"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
            end
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.portal.sidebar.home}</span>
          </NavLink>

          <NavLink
            to="/portal/company-profile"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Building className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.portal.sidebar.companyProfile}</span>
          </NavLink>

          <NavLink
            to="/portal/vendor-listing"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Store className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{(t.portal.sidebar as any).vendorListing || 'Vendor Listing'}</span>
          </NavLink>

          <NavLink
            to="/portal/onboarding"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.vendorPortal.onboarding.sidebarTitle}</span>
          </NavLink>

          <NavLink
            to="/portal/benefits"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Gift className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{(t.portal as any).myBenefits?.title || 'My Benefits'}</span>
          </NavLink>

          <NavLink
            to="/portal/admin"
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold truncate">{t.portal.sidebar.vendorAdmin}</span>
          </NavLink>
        </nav>
      </div>

      <InlineSubscriptionModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        onSuccess={async (vendorId?: number) => {
          setShowBranchModal(false);
          if (vendorId) {
            import('../../services/vendors').then(v => {
              v.default.switchWorkspace(vendorId).then(() => {
                window.location.reload();
              });
            });
          } else {
            window.location.reload();
          }
        }}
        newBranch={true}
      />
    </aside>
  );
}
