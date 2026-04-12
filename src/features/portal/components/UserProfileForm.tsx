import { useState } from 'react';
import { User, Shield, UserCheck, Edit2, X } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useUserProfile } from '../hooks/useUserProfile';

export default function UserProfileForm() {
  const { t } = useLanguage();
  const { userProfile, isSubmitting, handleSubmit } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (!userProfile) return null;

  const isPrimary = userProfile.role === 'SUPER_ADMIN';

  const onFormSubmit = (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    handleSubmit(e, {
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      jobTitle: data.get('jobTitle') as string,
      mobileCountryCode: data.get('mobileCountryCode') as string,
      mobileNumber: data.get('mobileNumber') as string,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-surface border border-border shadow-sm rounded-3xl p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <User className="w-5 h-5 text-brand" />
            {t.portal.userProfile.title}
          </h2>
          <p className="text-sm text-muted mt-1">{t.portal.userProfile.subtitle}</p>
        </div>

        {!isEditing ? (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4" />
            {(t.portal.companyProfile as any).editProfile || 'Edit Profile'}
          </Button>
        ) : (
          <button
            type="button"
            className="p-2 text-muted hover:text-main hover:bg-surface-hover rounded-full transition-colors"
            onClick={() => setIsEditing(false)}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={onFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t.portal.userProfile.firstName}
            name="firstName"
            defaultValue={userProfile.firstName || ''}
            disabled={!isEditing}
            required
          />

          <Input
            label={t.portal.userProfile.lastName}
            name="lastName"
            defaultValue={userProfile.lastName || ''}
            disabled={!isEditing}
            required
          />

          <Input
            label={t.portal.userProfile.jobTitle}
            name="jobTitle"
            defaultValue={userProfile.jobTitle || ''}
            disabled={!isEditing}
          />

          <Input
            label={t.portal.userProfile.email}
            name="email"
            value={userProfile.email}
            disabled
            className="bg-surface-hover/50 text-muted-foreground select-none"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label={(t.portal.userProfile as any).mobileCode || 'Code'}
              name="mobileCountryCode"
              defaultValue={userProfile.mobileCountryCode || '+20'}
              disabled={!isEditing}
              className="col-span-1"
            />
            <div className="col-span-2">
              <Input
                label={(t.portal.userProfile as any).mobileNumber || 'Mobile Number'}
                name="mobileNumber"
                defaultValue={userProfile.mobileNumber || ''}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-main">{t.portal.userProfile.role}</label>
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
              isPrimary ? 'border-brand/20 bg-brand/5' : 'border-input bg-surface-hover/50'
            }`}>
              {isPrimary ? <Shield className="w-4 h-4 text-brand" /> : <UserCheck className="w-4 h-4 text-muted" />}
              <span className={`text-sm font-semibold ${isPrimary ? 'text-brand' : 'text-muted'}`}>
                {isPrimary ? t.portal.userProfile.primaryAdmin : t.portal.userProfile.standardUser}
              </span>
            </div>
            <p className="text-[11px] text-muted ps-1">
              {isPrimary ? t.portal.userProfile.primaryAdminDescription : t.portal.userProfile.standardUserDescription}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t.portal.userProfile.saveChanges}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
