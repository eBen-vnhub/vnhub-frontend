import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Users, ShieldAlert } from 'lucide-react';
import TeamMembersList from '../components/TeamMembersList';
import InviteUserForm from '../components/InviteUserForm';
import { useVendorAdmin } from '../hooks/useVendorAdmin';

export default function VendorAdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { teamMembers, isLoading, isInviting, canManageTeam, handleInvite, handleRemove } = useVendorAdmin();

  if (!canManageTeam) {
    return (
      <div className="flex bg-surface rounded-2xl items-center justify-center p-8 mt-12 min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-main mb-2">{t.portal.vendorAdmin.accessDenied}</h2>
          <p className="text-muted text-sm leading-relaxed">
            {t.portal.vendorAdmin.accessDeniedMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/10 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold text-main">{t.portal.vendorAdmin.title}</h1>
        </div>
        <p className="text-muted">{t.portal.vendorAdmin.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TeamMembersList
            members={teamMembers}
            isLoading={isLoading}
            currentUser={user}
            onRemove={handleRemove}
          />
        </div>

        <div>
          <InviteUserForm
            onInvite={handleInvite}
            isInviting={isInviting}
          />
        </div>
      </div>
    </div>
  );
}
