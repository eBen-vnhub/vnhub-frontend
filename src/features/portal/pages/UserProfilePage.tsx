import { useUserProfile } from '../hooks/useUserProfile';
import UserProfileForm from '../components/UserProfileForm';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function UserProfilePage() {
  const { isLoading } = useUserProfile();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex bg-surface rounded-2xl items-center justify-center p-8 mt-12 min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 md:w-16 md:h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-sm md:text-base animate-pulse">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfileForm />
      </div>
    </div>
  );
}
