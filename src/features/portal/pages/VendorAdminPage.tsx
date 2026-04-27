import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Users } from 'lucide-react';
import TeamMembersList from '../components/TeamMembersList';
import InviteUserForm from '../components/InviteUserForm';
import { useVendorAdmin } from '../hooks/useVendorAdmin';

export default function VendorAdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { teamMembers, isLoading, isInviting, canManageTeam, handleInvite, handleRemove } = useVendorAdmin();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/10 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold text-main">{t.portal.vendorAdmin.title}</h1>
        </div>
        <p className="text-muted">{t.portal.vendorAdmin.subtitle}</p>
      </div>

      <div className={`grid grid-cols-1 ${canManageTeam ? 'lg:grid-cols-3' : ''} gap-8`}>
        <div className={canManageTeam ? 'lg:col-span-2' : ''}>
          <TeamMembersList
            members={teamMembers}
            isLoading={isLoading}
            currentUser={user}
            onRemove={canManageTeam ? handleRemove : undefined}
          />
        </div>

        {canManageTeam && (
          <div>
            <InviteUserForm
              onInvite={handleInvite}
              isInviting={isInviting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
